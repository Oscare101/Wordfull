import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import { usePeriodStats } from '../hooks/usePeriodStats';
import StatisticsValueItem from '../components/statistics/StatisticsValueItem';
import AccuracyHistoryBlock from '../components/statistics/AccuracyHistoryBlock';
import { useHistory } from '../context/HistoryContext';
import { useStatistics } from '../context/StatisticsContext';
import useGameStats from '../hooks/useGameStats';
import { NumberFormat, TimeFormat } from '../functions/functions';
import StatisticsMultipleValueItem from '../components/statistics/StatisticsMultipleValueItem';
import GamesTimeStatsBlock from '../components/statistics/GamesTimeStatsBlock';

type Props = StackScreenProps<RootStackParamList, 'AverageStatsScreen'>;
const width = Dimensions.get('screen').width;

export default function AverageStatsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const { statistics } = useStatistics();
  const { history } = useHistory();
  const {
    accuracyToday,
    accuracyWeek,
    accuracyMonth,
    accuracyYear,
    accuracyTotal,
  } = usePeriodStats();

  const {
    gamesAmountEasy,
    wordsMemorizedEasy,
    wordsAttemptsEasy,
    timePlayedEasy,
    gamesAmountHard,
    wordsMemorizedHard,
    wordsAttemptsHard,
    timePlayedHard,
    gamesAmountStamina,
    wordsMemorizedStamina,
    wordsAttemptsStamina,
    timePlayedStamina,
    averageTimePerGame,
    averageTimePerWord,
  } = useGameStats(history);

  const stats = [
    {
      multiple: true,
      title1: text[language].GamesPlayedEasy,
      value1: NumberFormat(gamesAmountEasy, language),
      title2: text[language].TotalWordsMemorized,
      value2: NumberFormat(wordsMemorizedEasy, language),
      title3: text[language].AverageAccuracy,
      value3:
        wordsAttemptsEasy > 0
          ? ((wordsMemorizedEasy / wordsAttemptsEasy) * 100).toFixed(2) + '%'
          : '-',
      title4: text[language].TimePlaying,
      value4: TimeFormat(timePlayedEasy, language),
    },
    {
      multiple: true,
      title1: text[language].GamesPlayedHard,
      value1: NumberFormat(gamesAmountHard, language),
      title2: text[language].TotalWordsMemorized,
      value2: NumberFormat(wordsMemorizedHard, language),
      title3: text[language].AverageAccuracy,
      value3:
        wordsAttemptsHard > 0
          ? ((wordsMemorizedHard / wordsAttemptsHard) * 100).toFixed(2) + '%'
          : '-',
      title4: text[language].TimePlaying,
      value4: TimeFormat(timePlayedHard, language),
    },
    {
      multiple: true,
      title1: text[language].GamesPlayedStamina,
      value1: NumberFormat(gamesAmountStamina, language),
      title2: text[language].TotalWordsMemorized,
      value2: NumberFormat(wordsMemorizedStamina, language),
      title3: text[language].AverageAccuracy,
      value3:
        wordsAttemptsStamina > 0
          ? ((wordsMemorizedStamina / wordsAttemptsStamina) * 100).toFixed(2) +
            '%'
          : '-',
      title4: text[language].TimePlaying,
      value4: TimeFormat(timePlayedStamina, language),
    },
    {
      title: text[language].AverageTimePerGame,
      value: TimeFormat(averageTimePerGame, language),
    },
    {
      title: text[language].AverageTimePerWord,
      value: TimeFormat(averageTimePerWord, language),
    },
  ];

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <>
        {item.multiple ? (
          <StatisticsMultipleValueItem
            title1={item.title1}
            value1={item.value1}
            title2={item.title2}
            value2={item.value2}
            title3={item.title3}
            value3={item.value3}
            title4={item.title4}
            value4={item.value4}
            theme={theme}
            width={width}
          />
        ) : (
          <StatisticsValueItem
            title={item.title}
            value={item.value}
            theme={theme}
            type={index ? 'secondary' : 'main'}
          />
        )}
      </>
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
        title={text[language].GamesStatistics}
        theme={theme}
      />
      <View style={styles.block}>
        <GamesTimeStatsBlock
          statistics={statistics}
          theme={theme}
          language={language}
        />
        <FlatList
          data={stats}
          renderItem={renderItem}
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
