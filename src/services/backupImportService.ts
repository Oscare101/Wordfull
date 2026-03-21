import { pick, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { decrypt } from '../utils/backupCrypto';
import {
  backupRepository,
  BackupData,
} from '../db/repositories/backupRepository';

type EncryptedBackupFile = {
  fileType: 'wordfull-backup';
  version: 1;
  exportedAt: number;
  crypto: {
    salt: string;
    iv: string;
  };
  payload: string;
};

type DecryptedBackupPayload = {
  exportedAt: number;
  data: BackupData;
};

function isBackupDataValid(data: any): data is BackupData {
  return (
    data &&
    Array.isArray(data.settings) &&
    Array.isArray(data.statistics) &&
    Array.isArray(data.history)
  );
}

export const backupImportService = {
  async importEncryptedBackup(
    onlyDecrypt?: boolean,
  ): Promise<DecryptedBackupPayload> {
    const result = await pick({
      mode: 'import',
      type: [types.allFiles],
      allowMultiSelection: false,
    });

    const pickedFile = Array.isArray(result) ? result[0] : result;
    const fileUri = pickedFile.uri;

    if (!fileUri) {
      throw new Error('Could not access selected file');
    }

    const filePath = fileUri.replace('file://', '');
    const fileContent = await RNFS.readFile(filePath, 'utf8');

    const parsedFile = JSON.parse(fileContent) as EncryptedBackupFile;

    if (parsedFile.fileType !== 'wordfull-backup') {
      throw new Error('Selected file is not a valid backup');
    }

    if (parsedFile.version !== 1) {
      throw new Error('Unsupported backup version');
    }

    if (
      !parsedFile.crypto ||
      !parsedFile.crypto.salt ||
      !parsedFile.crypto.iv ||
      !parsedFile.payload
    ) {
      throw new Error('Backup file is corrupted');
    }

    const decryptedText = await decrypt({
      cipher: parsedFile.payload,
      salt: parsedFile.crypto.salt,
      iv: parsedFile.crypto.iv,
    });

    const parsedPayload = JSON.parse(decryptedText) as DecryptedBackupPayload;
    if (!isBackupDataValid(parsedPayload.data)) {
      throw new Error('Backup data structure is invalid');
    }

    if (!onlyDecrypt) {
      await backupRepository.restoreAllTables(parsedPayload.data);
    }
    return parsedPayload;
  },
};
