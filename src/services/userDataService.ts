import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { backupRepository } from '../db/repositories/backupRepository';
import { encrypt } from '../utils/backupCrypto';

export type PlainBackupFile = {
  fileType: 'wordfull-backup';
  version: 1;
  exportedAt: number;
  data: {
    settings: any[];
    statistics: any[];
    history: any[];
  };
};

function buildBackupFileName(timestamp: number): string {
  const date = new Date(timestamp);

  const pad = (value: number) => String(value).padStart(2, '0');

  return `wordfull-backup-${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(
    date.getMinutes(),
  )}-${pad(date.getSeconds())}.json`;
}

export const backupExportService = {
  async exportPlainJsonBackup(): Promise<void> {
    const exportedAt = Date.now();
    const dbData = await backupRepository.readAllTables();

    const rawPayload = JSON.stringify({
      exportedAt,
      data: dbData,
    });

    const encrypted = await encrypt(rawPayload);

    const backupFile = {
      fileType: 'wordfull-backup',
      version: 1,
      exportedAt,
      crypto: {
        salt: encrypted.salt,
        iv: encrypted.iv,
      },
      payload: encrypted.cipher,
    };

    const fileName = buildBackupFileName(exportedAt);
    const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    const content = JSON.stringify(backupFile, null, 2);

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
  },
};
