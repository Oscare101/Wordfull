import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  History,
  Language,
  Statistics,
} from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';
import text from '../../constants/languages/text';
import colors from '../../constants/themes/colors';
import HistoryActivityChart from './HistoryActivityChart';

export default function MonthHistoryBlock({
  history,
  statistics,
  language,
  theme,
}: {
  history: History[];
  statistics: Statistics | null;
  language: Language;
  theme: ThemeType;
}) {
  const wordsAmount: number = statistics?.wordsMemorized ?? 0;

  const wordsTitle =
    wordsAmount % 10 === 1
      ? text[language].Word
      : wordsAmount && [2, 3, 4].includes(wordsAmount % 10)
      ? text[language].Words23
      : text[language].Words;

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 14, color: colors[theme].main }}>
        {text[language].TotalWordsMemorized} {text[language].inPast30Days}
      </Text>
      <Text
        style={{ fontSize: 16, color: colors[theme].main, fontWeight: 'bold' }}
      >
        {wordsAmount} {wordsTitle}
      </Text>
      {/* <HistoryActivityChart history={history} days={7} /> */}
      <HistoryActivityChart history={history} days={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
});
