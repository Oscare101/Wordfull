import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ButtonBlock from '../components/global/ButtonBlock';
import UserDataActionModal from '../components/settings/UserDataActionModal';
import { backupExportService } from '../services/userDataService';
import { useStatistics } from '../context/StatisticsContext';
import { useHistory } from '../context/HistoryContext';
import { EncryptedBackupFile } from '../constants/interfaces/backup';
import { backupImportService } from '../services/backupImportService';
import WipeDataWarningModal from '../components/settings/WipeDataWarningModal';
import ExportWarningModal from '../components/settings/ExportWarningModal';
import ImportWarningModal from '../components/settings/ImportWarningModal';

type Props = StackScreenProps<RootStackParamList, 'UserDataScreen'>;
type ModalType = 'export' | 'importSelect' | 'importConfirm' | 'wipe' | null;

export default function UserDataScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme, reloadSettings } = useSettings();
  const { reloadStatistics } = useStatistics();
  const { reloadHistory } = useHistory();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);

  const [exportPassword, setExportPassword] = useState('');
  const [importPassword, setImportPassword] = useState('');

  const [wipeDataWarningModal, setWipeDataWarningModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [importModal, setImportModal] = useState(false);

  const [exportInfo, setExportInfo] = useState<{
    fileName: string;
    approximateSize: string;
    preview: any;
  } | null>(null);

  const [importedFile, setImportedFile] = useState<EncryptedBackupFile | null>(
    null,
  );
  const [importedFileName, setImportedFileName] = useState('');

  const closeModal = () => {
    if (loading) return;
    setModalType(null);
  };

  const reloadAll = async () => {
    await Promise.all([reloadSettings(), reloadStatistics(), reloadHistory()]);
  };

  const confirmExport = async () => {
    if (!exportPassword.trim()) {
      Alert.alert('Password required', 'Please enter a backup password');
      return;
    }

    try {
      setLoading(true);
      await backupExportService.exportPlainJsonBackup();
      setModalType(null);
      setExportPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to export backup');
    } finally {
      setLoading(false);
    }
  };

  const selectImportFile = async () => {
    try {
      setLoading(true);
      const result = await backupExportService.exportPlainJsonBackup();
      // setImportedFile(result.filename);
      // setImportedFileName(result.fileName);
      setModalType('importConfirm');
    } catch (error) {
      Alert.alert('Error', 'Failed to read selected backup file');
    } finally {
      setLoading(false);
    }
  };

  const confirmImport = async () => {
    if (!importedFile) return;

    if (!importPassword.trim()) {
      Alert.alert('Password required', 'Please enter the backup password');
      return;
    }

    try {
      setLoading(true);
      // await userDataService.exportBackup(importedFile, importPassword.trim());
      await reloadAll();

      setModalType(null);
      setImportedFile(null);
      setImportedFileName('');
      setImportPassword('');
    } catch (error) {
      Alert.alert(
        'Import failed',
        'Wrong password, invalid backup, or the file was modified.',
      );
    } finally {
      setLoading(false);
    }
  };

  const importPreview = useMemo(() => {
    return importedFile?.preview ?? null;
  }, [importedFile]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].UserData}
        theme={theme}
      />

      <View style={styles.block}>
        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].ExportDescription}
        </Text>
        <ButtonBlock
          title={text[language].Export}
          // action={onExportPress}
          action={() => setExportModal(true)}
          theme={theme}
          icon="export"
          styles={{ justifyContent: 'center', marginBottom: 32 }}
        />

        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].ImportDescription}
        </Text>
        <ButtonBlock
          title={text[language].Import}
          action={() => setImportModal(true)}
          theme={theme}
          icon="import"
          styles={{ justifyContent: 'center', marginBottom: 32 }}
        />

        <View
          style={[styles.dangerBlock, { borderColor: colors[theme].error }]}
        >
          <Text style={[styles.title, { color: colors[theme].error }]}>
            {text[language].DangerZone}
          </Text>
          <Text style={[styles.comment, { color: colors[theme].main }]}>
            {text[language].WipeDataDescription}
          </Text>
          <ButtonBlock
            title={text[language].WipeData}
            action={() => setWipeDataWarningModal(true)}
            theme={theme}
            icon="trash"
            styles={{
              justifyContent: 'center',
              width: '100%',
              borderRadius: 8,
              backgroundColor: colors[theme].error,
            }}
          />
        </View>
      </View>

      <UserDataActionModal
        visible={modalType === 'export'}
        title="Export backup"
        description={`File name: ${
          exportInfo?.fileName ?? '-'
        }\nApproximate size: ${
          exportInfo?.approximateSize ?? '-'
        }\n\nThis backup contains your local app data and can be imported on another device.`}
        confirmTitle="Export"
        cancelTitle="Cancel"
        onClose={closeModal}
        onConfirm={confirmExport}
        theme={theme}
        language={language}
        password={exportPassword}
        setPassword={setExportPassword}
        showPasswordInput
        loading={loading}
      >
        {exportInfo?.preview ? (
          <View style={styles.previewBox}>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Language: {exportInfo.preview.settings?.language ?? '-'}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Theme: {exportInfo.preview.settings?.theme ?? '-'}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Games: {exportInfo.preview.statistics?.games ?? 0}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              History entries: {exportInfo.preview.historyCount}
            </Text>
          </View>
        ) : null}
      </UserDataActionModal>

      <UserDataActionModal
        visible={modalType === 'importSelect'}
        title="Import backup"
        description="Select a Wordfull backup file from your device. After selection, you will see a preview before replacing your current data."
        confirmTitle="Choose file"
        cancelTitle="Cancel"
        onClose={closeModal}
        onConfirm={selectImportFile}
        theme={theme}
        language={language}
        loading={loading}
      />

      <UserDataActionModal
        visible={modalType === 'importConfirm'}
        title="Import selected backup"
        description={`File: ${importedFileName}\n\nImport will completely replace your current local data.`}
        confirmTitle="Import"
        cancelTitle="Cancel"
        onClose={closeModal}
        onConfirm={confirmImport}
        theme={theme}
        language={language}
        password={importPassword}
        setPassword={setImportPassword}
        showPasswordInput
        loading={loading}
      >
        {importPreview ? (
          <View style={styles.previewBox}>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Exported: {new Date(importPreview.exportedAt).toLocaleString()}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Device: {importPreview.device.brand} {importPreview.device.model}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              OS: {importPreview.device.os} {importPreview.device.osVersion}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Language: {importPreview.settings?.language ?? '-'}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Theme: {importPreview.settings?.theme ?? '-'}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              Games: {importPreview.statistics?.games ?? 0}
            </Text>
            <Text style={[styles.previewText, { color: colors[theme].main }]}>
              History entries: {importPreview.historyCount}
            </Text>
          </View>
        ) : null}
      </UserDataActionModal>

      <ImportWarningModal
        theme={theme}
        language={language}
        visible={importModal}
        onClose={() => setImportModal(false)}
      />

      <ExportWarningModal
        theme={theme}
        language={language}
        visible={exportModal}
        onClose={() => setExportModal(false)}
        fileName={exportInfo?.fileName ?? ''}
        fileSize={exportInfo?.approximateSize ?? ''}
      />

      <WipeDataWarningModal
        theme={theme}
        language={language}
        visible={wipeDataWarningModal}
        onClose={() => setWipeDataWarningModal(false)}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    width: '92%',
    marginBottom: 16,
  },
  dangerBlock: {
    width: '92%',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
  },
  previewBox: {
    width: '100%',
    gap: 6,
  },
  previewText: {
    fontSize: 14,
  },
});
