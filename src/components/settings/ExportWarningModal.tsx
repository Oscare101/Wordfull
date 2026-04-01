import React from 'react';
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

const width = Dimensions.get('screen').width;

function ExportWarningModal({
  visible,
  onClose,
  theme,
  language,
  fileName,
  fileSize,
}: {
  visible: boolean;
  onClose: () => void;
  theme: ThemeType;
  language: Language;
  fileName: string;
  fileSize: string;
}) {
  const onExportData = async () => {
    try {
      await backupExportService.exportPlainJsonBackup('password'); // TODO
      onClose();
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].YourDataWasExported,
        },
        position: 'top',
      });
    } catch (error) {
      console.error('onExportPress error:', error);
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].ExportFailed,
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
            <Icon name="export" size={96} color={colors[theme].main} />

            <Text
              style={{
                fontSize: 24,
                color: colors[theme].main,
              }}
            >
              {text[language].ExportWarningTitle}
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
            <Text
              style={{
                fontSize: 16,
                color: colors[theme].main,
                width: '90%',
                textAlign: 'center',
              }}
            >
              {text[language].ExportWarning}
              {'\n'}
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
                title={text[language].Export}
                action={onExportData}
                styles={[styles.buttonStyle, { backgroundColor: '#00000000' }]}
                titleStyles={{ fontSize: 20, color: colors[theme].accent }}
                theme={theme}
              />
            </View>
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

export default React.memo(ExportWarningModal);
