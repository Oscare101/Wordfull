import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DeviceInfo from 'react-native-device-info';
import { backupRepository } from '../db/repositories/backupRepository';
import {
  BackupPayload,
  BackupPreview,
  EncryptedBackupFile,
} from '../constants/interfaces/backup';
import { BACKUP_CRYPTO_ITERATIONS, encrypt } from '../utils/backupCrypto';
import { parseSelectedSystemWordPackKeys } from '../db/repositories/settingsRepository';

function buildBackupFileName(timestamp: number): string {
  const date = new Date(timestamp);

  const pad = (value: number) => String(value).padStart(2, '0');

  return `wordfull-backup-${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(
    date.getMinutes(),
  )}-${pad(date.getSeconds())}.json`;
}

function formatApproximateSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildPreviewFromPayload(payload: BackupPayload): BackupPreview {
  const firstSettingsRow = payload.data.settings[0] ?? null;
  const firstStatisticsRow = payload.data.statistics[0] ?? null;

  return {
    exportedAt: payload.exportedAt,
    device: payload.device,
    historyCount: payload.data.history.length,
    settings: firstSettingsRow
      ? {
          language: firstSettingsRow.language as 'en' | 'uk',
          theme:
            firstSettingsRow.theme as BackupPreview['settings'] extends infer S
              ? S extends { theme: infer T }
                ? T
                : never
              : never,
          selectedSystemWordPackKeys: parseSelectedSystemWordPackKeys(
            firstSettingsRow.selected_system_word_pack_keys_json ?? null,
          ),
          startDate: firstSettingsRow.start_date,
        }
      : null,
    statistics: firstStatisticsRow
      ? {
          wordsMemorized: firstStatisticsRow.words_memorized,
          wordsAttempted: firstStatisticsRow.words_attempted,
          timeSpent: firstStatisticsRow.time_spent,
          games: firstStatisticsRow.games,
        }
      : null,
  };
}

export const backupExportService = {
  async exportPlainJsonBackup(password: string): Promise<{
    fileName: string;
    approximateSize: string;
    preview: BackupPreview;
  }> {
    const exportedAt = Date.now();
    const dbData = await backupRepository.readAllTables();

    const payload: BackupPayload = {
      schemaVersion: 1,
      exportedAt,
      device: {
        os: Platform.OS,
        osVersion: String(DeviceInfo.getSystemVersion()),
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
      },
      data: dbData,
    };

    const preview = buildPreviewFromPayload(payload);

    const rawPayload = JSON.stringify(payload);
    const encrypted = await encrypt(rawPayload, password);

    const backupFile: EncryptedBackupFile = {
      fileType: 'wordfull-backup',
      version: 1,
      preview,
      crypto: {
        algorithm: 'aes-256-cbc',
        kdf: 'pbkdf2-sha256',
        iterations: BACKUP_CRYPTO_ITERATIONS,
        salt: encrypted.salt,
        iv: encrypted.iv,
        mac: '',
      },
      payload: encrypted.cipher,
    };

    const content = JSON.stringify(backupFile, null, 2);
    const fileName = buildBackupFileName(exportedAt);
    const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, content, 'utf8');

    try {
      await Share.open({
        url: `file://${filePath}`,
        type: 'application/json',
        filename: fileName,
        failOnCancel: false,
        saveToFiles: true,
      });
    } finally {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath).catch(() => {});
      }
    }

    return {
      fileName,
      approximateSize: '0', // TODO implement later
      preview,
    };
  },
};
