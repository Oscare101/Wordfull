import { pick, types, keepLocalCopy } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { decrypt } from '../utils/backupCrypto';
import {
  EncryptedBackupFile,
  BackupPayload,
} from '../constants/interfaces/backup';
import {
  backupRepository,
  BackupData,
} from '../db/repositories/backupRepository';

type ImportEncryptedBackupResult = {
  backupFile: EncryptedBackupFile;
  payload: BackupPayload;
};

function isBackupDataValid(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const typedData = data as BackupData;

  return (
    Array.isArray(typedData.settings) &&
    Array.isArray(typedData.statistics) &&
    Array.isArray(typedData.history)
  );
}

function isEncryptedBackupFile(value: unknown): value is EncryptedBackupFile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const file = value as EncryptedBackupFile;

  return (
    file.fileType === 'wordfull-backup' &&
    file.version === 1 &&
    !!file.preview &&
    !!file.crypto &&
    typeof file.crypto.salt === 'string' &&
    typeof file.crypto.iv === 'string' &&
    typeof file.payload === 'string'
  );
}

async function readPickedFileAsText(): Promise<string> {
  const result = await pick({
    mode: 'import',
    type: [types.allFiles],
    allowMultiSelection: false,
  });
  const pickedFile = Array.isArray(result) ? result[0] : result;
  if (!pickedFile?.uri) {
    throw new Error('Could not access selected file');
  }
  const localCopyResult = await keepLocalCopy({
    files: [
      {
        uri: pickedFile.uri,
        fileName: pickedFile.name ?? `backup-${Date.now()}.json`,
      },
    ],
    destination: 'cachesDirectory',
  });
  const copiedFile: any = localCopyResult[0];
  const localUri = copiedFile?.localUri;
  if (!localUri) {
    throw new Error('Could not create local copy of selected file');
  }
  const localPath = localUri.replace('file://', '');
  const fileContent = await RNFS.readFile(localPath, 'utf8');
  await RNFS.unlink(localPath).catch(() => {});
  return fileContent;
}

export const backupImportService = {
  async importEncryptedBackup(
    password: string,
    onlyDecrypt?: boolean,
  ): Promise<ImportEncryptedBackupResult> {
    const fileContent = await readPickedFileAsText();
    const parsedFile = JSON.parse(fileContent) as unknown;

    if (!isEncryptedBackupFile(parsedFile)) {
      throw new Error('Selected file is not a valid backup');
    }

    const decryptedText = await decrypt({
      cipher: parsedFile.payload,
      salt: parsedFile.crypto.salt,
      iv: parsedFile.crypto.iv,
      password,
    });

    const parsedPayload = JSON.parse(decryptedText) as unknown;

    if (
      !parsedPayload ||
      typeof parsedPayload !== 'object' ||
      !('data' in parsedPayload)
    ) {
      throw new Error('Backup payload is invalid');
    }

    const payload = parsedPayload as BackupPayload;

    if (!isBackupDataValid(payload.data)) {
      throw new Error('Backup data structure is invalid');
    }

    if (!onlyDecrypt) {
      await backupRepository.restoreAllTables(payload.data);
    }
    return { backupFile: parsedFile, payload };
  },
};
