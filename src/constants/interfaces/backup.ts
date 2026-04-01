import { Statistics, SystemWordPackKey } from './interface';
import { AppSettings } from '../../db/repositories/settingsRepository';

export interface RawSettingsRow {
  id: number;
  theme: string;
  language: string;
  selected_system_word_pack_keys_json?: string | null;
  start_date: number;
}

export interface RawStatisticsRow {
  id: number;
  words_memorized: number;
  words_attempted: number;
  time_spent: number;
  games: number;
}

export interface RawHistoryRow {
  id: string;
  timestamp: number;
  duration: number;
  mode: string;
  word_pack_id: string;
  word_pack_name_snapshot: string;
  words_amount: number;
  correct_words: number;
  words_json: string;
  inputs_json: string;
  language: string;
}

export interface BackupPayloadData {
  settings: RawSettingsRow[];
  statistics: RawStatisticsRow[];
  history: RawHistoryRow[];
}

export interface BackupPayload {
  schemaVersion: 1;
  exportedAt: number;
  device: {
    os: string;
    osVersion: string;
    brand: string;
    model: string;
  };
  data: BackupPayloadData;
}

export interface BackupPreview {
  exportedAt: number;
  device: {
    os: string;
    osVersion: string;
    brand: string;
    model: string;
  };
  historyCount: number;
  settings: {
    language: AppSettings['language'];
    theme: AppSettings['theme'];
    selectedSystemWordPackKeys: SystemWordPackKey[];
    startDate: number;
  } | null;
  statistics: Statistics | null;
}

export interface EncryptedBackupFile {
  fileType: 'wordfull-backup';
  version: 1;
  preview: BackupPreview;
  crypto: {
    algorithm: 'aes-256-cbc';
    kdf: 'pbkdf2-sha256';
    iterations: number;
    salt: string;
    iv: string;
    mac: string;
  };
  payload: string;
}
