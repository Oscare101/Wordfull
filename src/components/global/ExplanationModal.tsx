import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import colors from '../../constants/themes/colors';
import ButtonBlock from './ButtonBlock';
import text from '../../constants/languages/text';
import { Line, Svg } from 'react-native-svg';

const width = Dimensions.get('screen').width;

function ExplanationModal({
  theme,
  language,
  type,
  visible,
  onClose,
  wordsAmount,
}: {
  theme: ThemeType;
  language: Language;
  type: 'gameModes' | 'preGameEasyHard' | 'preGameStamina';
  visible: boolean;
  onClose: () => void;
  wordsAmount?: number;
}) {
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
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.modalView, { backgroundColor: colors[theme].bg }]}>
          {type === 'gameModes' ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors[theme].main,
                }}
              >
                {text[language].Explanation}
              </Text>
              <Svg
                width={width - 64}
                height={1}
                viewBox={`0 0 ${width - 64} 1`}
              >
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
                  fontSize: 14,
                  color: colors[theme].main,
                }}
              >
                {text[language].GameModeExplanation}
              </Text>
            </ScrollView>
          ) : (
            <Text
              style={{
                fontSize: 14,
                color: colors[theme].main,
              }}
            >
              {type === 'preGameEasyHard'
                ? text[language].PreGameEasyHardExplanation
                : type === 'preGameStamina'
                ? text[language].PreGameStaminaExplanation.replace(
                    '#',
                    wordsAmount?.toString() || '',
                  )
                : ''}
            </Text>
          )}

          <ButtonBlock
            title={text[language].Continue}
            action={onClose}
            titleStyles={{ fontSize: 20 }}
            theme={theme}
            styles={{ borderRadius: 8, width: '100%' }}
          />
        </View>
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
    maxHeight: '60%',
    padding: 16,
    paddingTop: 24,
    borderRadius: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 4,
    gap: 16,
  },
});

export default React.memo(ExplanationModal);
