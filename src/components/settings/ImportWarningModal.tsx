import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import colors from '../../constants/themes/colors';
import text from '../../constants/languages/text';
import ButtonBlock from '../global/ButtonBlock';
import Icon from '../../assets/icon';
import Toast from 'react-native-toast-message';
import { Line, Svg } from 'react-native-svg';
import { backupExportService } from '../../services/userDataService';
import { backupImportService } from '../../services/backupImportService';
import { useHistory } from '../../context/HistoryContext';
import { useStatistics } from '../../context/StatisticsContext';
import { useSettings } from '../../context/SettingsContext';
import { TimeFormat } from '../../functions/functions';
import { backupRepository } from '../../db/repositories/backupRepository';

const width = Dimensions.get('screen').width;

function ImportWarningModal({
  visible,
  onClose,
  theme,
  language,
}: {
  visible: boolean;
  onClose: () => void;
  theme: ThemeType;
  language: Language;
}) {
  const { reloadSettings } = useSettings();
  const { reloadStatistics } = useStatistics();
  const { reloadHistory } = useHistory();
  const [state, setState] = useState<'initial' | 'preview'>('initial');
  const [previewData, setPreviewData] = useState<any | null>(null);

  useEffect(() => {
    if (!visible) {
      setState('initial');
      setPreviewData(null);
    }
  }, [visible]);

  const onConfirmImport = async () => {
    try {
      await backupRepository.restoreAllTables(previewData.data);
      await Promise.all([
        reloadSettings(),
        reloadStatistics(),
        reloadHistory(),
      ]);

      onClose();
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].YourDataWasImported,
        },
        position: 'top',
      });
    } catch (error) {
      console.error('onConfirmImport error:', error);
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].ImportFailed,
        },
        position: 'top',
      });
    }
  };

  const onImportData = async () => {
    try {
      const data = await backupImportService.importEncryptedBackup(
        'password',
        true,
      );

      setPreviewData(data);
      setState('preview');
    } catch (error) {
      console.error('onImportPress error:', error);
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].ImportFailed,
        },
        position: 'top',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={() => {
        if (visible) {
          onClose(); // Dismiss the modal
        }
      }}
    >
      <StatusBar
        backgroundColor={colors[theme].bgDim}
        barStyle={colors[theme].barStyle}
      />
      <View
        style={[
          styles.centeredView,
          {
            backgroundColor: colors[theme].bgShadow,
          },
        ]}
      >
        <Pressable
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onClose}
        >
          <Pressable
            style={[styles.modalView, { backgroundColor: colors[theme].bg }]}
          >
            <Icon name="import" size={96} color={colors[theme].main} />

            <Text
              style={{
                fontSize: 24,
                color: colors[theme].main,
              }}
            >
              {state === 'initial'
                ? text[language].ImportWarningTitle
                : text[language].ImportDataPreview}
            </Text>
            <Svg width={width - 64} height={1} viewBox={`0 0 ${width - 64} 1`}>
              <Line
                x1={0}
                y1={0}
                x2={width - 64}
                y2={0}
                stroke={colors[theme].main}
                strokeWidth={1}
                strokeDasharray="4 6"
                opacity={0.6}
              />
            </Svg>
            {state === 'initial' ? (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors[theme].main,
                    width: '90%',
                    textAlign: 'center',
                  }}
                >
                  {text[language].ImportWarning}
                </Text>
                <View style={styles.buttonsRow}>
                  <ButtonBlock
                    title={text[language].Cancel}
                    action={onClose}
                    styles={[
                      styles.buttonStyle,
                      {
                        backgroundColor: '#00000000',
                      },
                    ]}
                    titleStyles={{ fontSize: 20, color: colors[theme].main }}
                    theme={theme}
                  />
                  <ButtonBlock
                    title={text[language].Import}
                    action={onImportData}
                    styles={[
                      styles.buttonStyle,
                      { backgroundColor: '#00000000' },
                    ]}
                    titleStyles={{ fontSize: 20, color: colors[theme].accent }}
                    theme={theme}
                  />
                </View>
              </>
            ) : (
              <View style={{ gap: 8, alignItems: 'flex-start' }}>
                <Text
                  style={{
                    color: colors[theme].main,
                    fontSize: 16,
                  }}
                >
                  {text[language].ExportedAt}:{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    {new Date(previewData?.exportedAt).toLocaleDateString(
                      language,
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </Text>
                </Text>
                <Text style={{ color: colors[theme].main, fontSize: 16 }}>
                  {text[language].GamesCompleted}:{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    {previewData.data.statistics[0].games}
                  </Text>
                </Text>
                <Text style={{ color: colors[theme].main, fontSize: 16 }}>
                  {text[language].TotalWordsMemorized}:{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    {previewData.data.statistics[0].words_memorized}
                  </Text>
                </Text>
                <Text style={{ color: colors[theme].main, fontSize: 16 }}>
                  {text[language].timeMemorizing}:{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    {TimeFormat(
                      previewData.data.statistics[0].time_spent,
                      language,
                    )}
                  </Text>
                </Text>
                <Text style={{ color: colors[theme].main, fontSize: 16 }}>
                  {text[language].PlayedSince}:{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    {new Date(
                      previewData.data.settings[0].start_date,
                    ).toLocaleDateString(language, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </Text>
                <View style={styles.buttonsRow}>
                  <ButtonBlock
                    title={text[language].Cancel}
                    action={onClose}
                    styles={[
                      styles.buttonStyle,
                      {
                        backgroundColor: '#00000000',
                      },
                    ]}
                    titleStyles={{ fontSize: 20, color: colors[theme].main }}
                    theme={theme}
                  />
                  <ButtonBlock
                    title={text[language].Confirm}
                    action={onConfirmImport}
                    styles={[
                      styles.buttonStyle,
                      { backgroundColor: '#00000000' },
                    ]}
                    titleStyles={{ fontSize: 20, color: colors[theme].accent }}
                    theme={theme}
                  />
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: '92%',
    padding: 16,
    paddingTop: 24,
    borderRadius: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  buttonStyle: {
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 0,
  },
});

export default React.memo(ImportWarningModal);
