import { Animated, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import CheckBlock from './CheckBlock';
import { ThemeType } from '../../constants/themes/themeType';
import { GameMode, Language } from '../../constants/interfaces/interface';
import text from '../../constants/languages/text';
import CardCountBlock from './CardCountBlock';
import colors from '../../constants/themes/colors';

export default function GameBottomBlock({
  theme,
  language,
  finishAvailable,
  startTime,
  wordIndex,
  wordsAmount,
  onFinish,
  isListOpened,
  mode,
}: {
  theme: ThemeType;
  language: Language;
  finishAvailable: boolean;
  startTime: number | undefined;
  wordIndex: number;
  wordsAmount: number;
  onFinish: () => void;
  isListOpened: boolean;
  mode: GameMode;
}) {
  const sizeAnim = useRef(new Animated.Value(isListOpened ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(sizeAnim, {
      toValue: isListOpened ? 0 : 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isListOpened, sizeAnim]);

  const heightAnim = sizeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 250],
  });

  return (
    <Animated.View
      style={{
        borderTopWidth: 2,
        borderColor: colors[theme].border,
        paddingTop: 32,
        gap: 32,
        height: heightAnim,
      }}
    >
      <CheckBlock
        theme={theme}
        language={language}
        finishAvailable={finishAvailable}
        buttonTitle={text[language].Finish}
        comment={text[language].IfYouReadyToCheck}
        onCheck={() => {
          onFinish();
        }}
      />
      {!isListOpened && (
        <CardCountBlock
          theme={theme}
          wordsAmount={wordsAmount}
          type={mode}
          wordNumber={wordIndex + 1}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
