import React from 'react';
import {
  View,
  Text,
  Modal,
  StatusBar,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import colors from '../../constants/themes/colors';
import text from '../../constants/languages/text';
import ButtonBlock from '../global/ButtonBlock';

interface CloseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  theme: ThemeType;
  language: Language;
}

function CloseGameModal({
  visible,
  onClose,
  onSubmit,
  theme,
  language,
}: CloseModalProps) {
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
            <Text
              style={{
                fontSize: 24,
                color: colors[theme].main,
              }}
            >
              {text[language].CloseGameWarningTitle}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: colors[theme].comment,
                width: '90%',
                textAlign: 'center',
              }}
            >
              {text[language].CloseGameWarning}
            </Text>
            <View style={styles.buttonsRow}>
              <ButtonBlock
                title={text[language].goBack}
                action={onClose}
                styles={styles.buttonStyle}
                titleStyles={{ fontSize: 20 }}
                theme={theme}
              />
              <ButtonBlock
                title={text[language].Stop}
                action={onSubmit}
                styles={[styles.buttonStyle, { backgroundColor: '#00000000' }]}
                titleStyles={{ fontSize: 20, color: colors[theme].main }}
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
  },
  buttonStyle: {
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 0,
  },
});

export default React.memo(CloseGameModal);
