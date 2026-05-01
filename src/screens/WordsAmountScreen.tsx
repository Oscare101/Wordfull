import { FlatList, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language } from '../constants/interfaces/interface';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import HistoryChartBlock from '../components/statistics/HistoryChartBlock';
import { useHistory } from '../context/HistoryContext';
import { useStatistics } from '../context/StatisticsContext';
import { usePeriodStats } from '../hooks/usePeriodStats';
import StatisticsValueItem from '../components/statistics/StatisticsValueItem';
import { WordsTitleFromAmount } from '../functions/functions';

type Props = StackScreenProps<RootStackParamList, 'WordsAmountScreen'>;

export default function WordsAmountScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const { statistics } = useStatistics();
  const { history } = useHistory();
  const {
    wordsLearnedToday,

    wordsLearnedWeek,
    wordsLearnedWeekDailyAverage,

    wordsLearnedMonth,
    wordsLearnedMonthDailyAverage,

    wordsLearnedYear,
    wordsLearnedYearDailyAverage,

    wordsLearnedTotal,
    wordsLearnedDailyAverage,
  } = usePeriodStats();

  const stats = [
    {
      title: text[language].Today,
      value:
        wordsLearnedToday.toFixed() +
        ' ' +
        WordsTitleFromAmount(wordsLearnedToday, language),
    },
    {
      title: text[language].DailyAverage,
      value:
        wordsLearnedDailyAverage.toFixed() +
        ' ' +
        WordsTitleFromAmount(wordsLearnedDailyAverage, language),
    },
    {
      title: text[language].TotalWordsMemorized,
      value:
        wordsLearnedTotal.toFixed() +
        ' ' +
        WordsTitleFromAmount(wordsLearnedTotal, language),
    },
    {
      title: text[language].PastWeek,
      value:
        wordsLearnedWeek.toFixed() +
        ' ' +
        WordsTitleFromAmount(wordsLearnedWeek, language),
    },
    {
      title: text[language].PastMonth,
      value:
        wordsLearnedMonth.toFixed() +
        ' ' +
        WordsTitleFromAmount(wordsLearnedMonth, language),
    },
    {
      title: text[language].PastYear,
      value:
        wordsLearnedYear.toFixed() +
        ' ' +
        WordsTitleFromAmount(wordsLearnedYear, language),
    },
  ];

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { title: string; value: string };
      index: number;
    }) => (
      <StatisticsValueItem
        title={item.title}
        value={item.value}
        theme={theme}
        type={index ? 'secondary' : 'main'}
      />
    ),
    [theme],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors[theme].bg },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].WordsAmount}
        theme={theme}
      />
      <View style={styles.block}>
        <HistoryChartBlock
          history={history}
          language={language}
          theme={theme}
          type="month"
          height={200}
          interactive={true}
        />
        <FlatList
          data={stats}
          renderItem={renderItem}
          keyExtractor={item => item.title}
          contentContainerStyle={{ gap: 8, paddingBottom: insets.bottom + 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  block: {
    gap: 8,
    width: '92%',
    flex: 1,
  },
});
