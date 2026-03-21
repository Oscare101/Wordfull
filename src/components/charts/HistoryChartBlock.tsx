import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { History, Language } from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';
import text from '../../constants/languages/text';
import colors from '../../constants/themes/colors';
import HistoryActivityChart from './HistoryActivityChart';
import { usePeriodStats } from '../../hooks/usePeriodStats';
import Icon from '../../assets/icon';

function HistoryChartBlock({
  history,
  language,
  theme,
  type,
  height = 150,
  onOpen,
}: {
  history: History[];
  language: Language;
  theme: ThemeType;
  type: 'month' | 'week';
  height?: number;
  onOpen?: () => void;
}) {
  const { wordsLearnedToday, wordsLearnedWeek, wordsLearnedMonth } =
    usePeriodStats();

  const wordsAmount = type === 'month' ? wordsLearnedMonth : wordsLearnedWeek;

  const wordsTitle =
    wordsAmount % 10 === 1
      ? text[language].Word
      : wordsAmount && [2, 3, 4].includes(wordsAmount % 10)
      ? text[language].Words23
      : text[language].Words;

  const container = (
    <View
      style={[
        styles.container,
        { borderColor: colors[theme].border, height: height },
      ]}
    >
      {onOpen && (
        <View style={{ position: 'absolute', top: 16, right: 16 }}>
          <Icon name="open" size={16} color={colors[theme].main} />
        </View>
      )}
      <Text style={{ fontSize: 14, color: colors[theme].main }}>
        {text[language].TotalWordsMemorized}{' '}
        {type === 'month'
          ? text[language].inPast30Days
          : text[language].inPastWeek}
      </Text>
      <Text
        style={{ fontSize: 16, color: colors[theme].main, fontWeight: 'bold' }}
      >
        {wordsAmount} {wordsTitle.toLocaleLowerCase()}
      </Text>
      <HistoryActivityChart
        history={history}
        height={height - 65}
        days={type === 'month' ? 30 : 7}
      />
    </View>
  );

  if (onOpen) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onOpen}>
        {container}
      </TouchableOpacity>
    );
  }

  return container;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
});

export default React.memo(HistoryChartBlock);
