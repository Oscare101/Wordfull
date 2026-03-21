import { FlatList, StyleSheet, View } from 'react-native';
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
import AccuracyHistoryBlock from '../components/charts/AccuracyHistoryBlock';
import { useHistory } from '../context/HistoryContext';
import { useStatistics } from '../context/StatisticsContext';

type Props = StackScreenProps<RootStackParamList, 'AccuracyScreen'>;

export default function AccuracyScreen({ navigation }: Props) {
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

  const stats = [
    {
      title: text[language].Today,
      value: (accuracyToday * 100).toFixed(2) + '%',
    },
    {
      title: text[language].DailyAverage,
      value: (accuracyTotal * 100).toFixed(2) + '%',
    },
    {
      title: text[language].PastWeek,
      value: (accuracyWeek * 100).toFixed(2) + '%',
    },
    {
      title: text[language].PastMonth,
      value: (accuracyMonth * 100).toFixed(2) + '%',
    },
    {
      title: text[language].PastYear,
      value: (accuracyYear * 100).toFixed(2) + '%',
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
        title={text[language].Accuracy}
        theme={theme}
      />
      <View style={styles.block}>
        <AccuracyHistoryBlock
          history={history}
          statistics={statistics}
          language={language}
          theme={theme}
          height={150}
          onOpen={() => navigation.navigate('AccuracyScreen')}
        />
        <FlatList
          data={stats}
          renderItem={renderItem}
          keyExtractor={item => item.title}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
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
  },
});
