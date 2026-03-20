import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import CheckBlock from './CheckBlock';
import { ThemeType } from '../../constants/themes/themeType';
import { GameMode, Language } from '../../constants/interfaces/interface';
import text from '../../constants/languages/text';
import CardCountBlock from './CardCountBlock';
import colors from '../../constants/themes/colors';
import { TimeFormat } from '../../functions/functions';

export default function CheckBottomBlock({
  theme,
  language,
  finishAvailable,
  time,
  wordsAmount,
  onCheck,
  mode,
  correctWordsAmount,
}: {
  theme: ThemeType;
  language: Language;
  finishAvailable: boolean;
  time: number;
  wordsAmount: number;
  onCheck: () => void;
  mode: GameMode;
  correctWordsAmount?: number;
}) {
  return (
    <View
      style={{
        borderTopWidth: 2,
        borderColor: colors[theme].border,
        paddingTop: 32,
        gap: 32,
        height: 250,
      }}
    >
      <CheckBlock
        theme={theme}
        language={language}
        finishAvailable={finishAvailable}
        buttonTitle={text[language].Finish}
        comment={
          correctWordsAmount !== undefined
            ? ''
            : text[language].IfYouEnteredWords
        }
        onCheck={() => {
          onCheck();
        }}
      />
      <View style={styles.timeBlock}>
        <Text style={[styles.timeTitle, { color: colors[theme].main }]}>
          {correctWordsAmount && `${correctWordsAmount}/${wordsAmount}   `}
          <Text style={{ fontSize: correctWordsAmount ? 24 : 32 }}>
            {TimeFormat(time, language)}
          </Text>
        </Text>
        <Text
          style={[
            styles.timeComment,
            {
              color: colors[theme].comment,
            },
          ]}
        >
          {correctWordsAmount
            ? text[language].correctWordsMemorized
            : text[language].timeMemorizing}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeBlock: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTitle: {
    fontSize: 32,
  },
  timeComment: {
    fontSize: 16,
  },
});
