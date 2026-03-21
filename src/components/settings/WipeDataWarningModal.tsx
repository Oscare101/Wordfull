import React, { useState } from 'react';
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
import { backupWipeService } from '../../services/backupWipeService';
import { useSettings } from '../../context/SettingsContext';
import { useStatistics } from '../../context/StatisticsContext';
import { useHistory } from '../../context/HistoryContext';
import Icon from '../../assets/icon';
import Toast from 'react-native-toast-message';
import { Line, Svg } from 'react-native-svg';

const width = Dimensions.get('screen').width;

function WipeDataWarningModal({
  visible,
  onClose,
  theme,
  language,
  navigation,
}: {
  visible: boolean;
  onClose: () => void;
  theme: ThemeType;
  language: Language;
  navigation: any;
}) {
  const { reloadSettings } = useSettings();
  const { reloadStatistics } = useStatistics();
  const { reloadHistory } = useHistory();

  const onWipeData = async () => {
    try {
      await backupWipeService.wipeData();

      await Promise.all([
        reloadSettings(),
        reloadStatistics(),
        reloadHistory(),
      ]);
      onClose();
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].YourDataWasWiped,
        },
        position: 'top',
      });
    } catch (error) {
      console.error('onWipeDataPress error:', error);
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].WipeDataFailed,
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
            <Icon name="trash" size={96} color={colors[theme].main} />

            <Text
              style={{
                fontSize: 24,
                color: colors[theme].main,
              }}
            >
              {text[language].WipeDataWarningTitle}
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
              {text[language].WipeDataWarning}
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
                title={text[language].WipeData}
                action={onWipeData}
                styles={[styles.buttonStyle, { backgroundColor: '#00000000' }]}
                titleStyles={{ fontSize: 20, color: colors[theme].error }}
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

export default React.memo(WipeDataWarningModal);
