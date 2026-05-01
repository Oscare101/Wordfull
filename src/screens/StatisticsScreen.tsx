import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageButtonItem from '../components/settings/LanguageButtonItem';
import { Language } from '../constants/interfaces/interface';
import AccuracyHistoryBlock from '../components/statistics/AccuracyHistoryBlock';
import { useHistory } from '../context/HistoryContext';
import { useStatistics } from '../context/StatisticsContext';
import PersonalBestsBlock from '../components/statistics/PersonalBestsBlock';
import HistoryChartBlock from '../components/statistics/HistoryChartBlock';
import GamesTimeStatsBlock from '../components/statistics/GamesTimeStatsBlock';

type Props = StackScreenProps<RootStackParamList, 'StatisticsScreen'>;

export default function StatisticsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme, setLanguage } = useSettings();
  const { statistics } = useStatistics();
  const { history } = useHistory();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].Statistics}
        theme={theme}
      />
      <View style={styles.block}>
        <HistoryChartBlock
          history={history}
          language={language}
          theme={theme}
          type="month"
          height={150}
          onOpen={() => navigation.navigate('WordsAmountScreen')}
          interactive={false}
        />
        <AccuracyHistoryBlock
          history={history}
          statistics={statistics}
          language={language}
          theme={theme}
          height={150}
          onOpen={() => navigation.navigate('AccuracyScreen')}
        />
        <PersonalBestsBlock
          language={language}
          theme={theme}
          height={150}
          maxGames={5}
          onOpen={() => navigation.navigate('PersonalBestsScreen')}
        />
        <GamesTimeStatsBlock
          statistics={statistics}
          theme={theme}
          language={language}
          onOpen={() => navigation.navigate('AverageStatsScreen')}
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
