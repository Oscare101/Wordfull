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
import HistoryProgressChart from './HistoryProgressChart';

export default function AccuracyHistoryBlock({
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

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 14, color: colors[theme].main }}>
        {text[language].WordsAmount} ■ + {text[language].Accuracy}{' '}
        <Text style={{ color: colors[theme].comment }}>●</Text>{' '}
        {text[language].inPastWeek}
      </Text>
      <HistoryProgressChart
        history={history}
        days={7}
        accuracyColor={colors[theme].comment}
      />
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
