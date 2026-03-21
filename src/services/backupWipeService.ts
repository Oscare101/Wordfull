import { backupRepository } from '../db/repositories/backupRepository';

export const backupWipeService = {
  async wipeData(): Promise<void> {
    await backupRepository.wipeAndInit();
  },
};
