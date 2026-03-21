import { FlatList, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { History, Language } from '../constants/interfaces/interface';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import { useHistory } from '../context/HistoryContext';
import { useStatistics } from '../context/StatisticsContext';
import StatisticsValueItem from '../components/statistics/StatisticsValueItem';
import PersonalBestsBlock from '../components/charts/PersonalBestsBlock';
import { useTopBestGames } from '../hooks/useTopBestGames';

type Props = StackScreenProps<RootStackParamList, 'PersonalBestsScreen'>;

export default function PersonalBestsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const { statistics } = useStatistics();
  const { history } = useHistory();
  const topGames = useTopBestGames(10);

  function getWordsTitle(count: number) {
    return count % 10 === 1
      ? text[language].Word
      : count && [2, 3, 4].includes(count % 10)
      ? text[language].Words23
      : text[language].Words;
  }

  function getShortMonthDay(date: Date, language: Language): string {
    return date.toLocaleDateString(language, {
      month: 'long',
      day: 'numeric',
    });
  }

  const renderItem = useCallback(
    ({ item, index }: { item: History; index: number }) => (
      <StatisticsValueItem
        title={`${(index + 1).toString()}. ${getShortMonthDay(
          new Date(item.timestamp),
          language,
        )}`}
        value={
          item.correctWords.toString() +
          ' ' +
          getWordsTitle(item.correctWords).toLocaleLowerCase()
        }
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
        title={text[language].PersonalBestResults}
        theme={theme}
      />
      <View style={styles.block}>
        <PersonalBestsBlock
          language={language}
          theme={theme}
          height={150}
          maxGames={5}
        />
        <FlatList
          data={topGames}
          renderItem={renderItem}
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
