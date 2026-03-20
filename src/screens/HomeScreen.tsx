import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import ButtonBlock from '../components/global/ButtonBlock';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';
import { statisticsRepository } from '../db/repositories/statisticsRepository';
import { useStatistics } from '../context/StatisticsContext';
import { useHistory } from '../context/HistoryContext';
import MonthHistoryBlock from '../components/charts/MonthHistoryBlock';
import GamesTimeStatsBlock from '../components/charts/GamesTimeStatsBlock';

type Props = StackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: Props) {
  const { language, theme } = useSettings();
  const { statistics } = useStatistics();
  const { history } = useHistory();
  console.log('history', history);

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].bg }]}>
      <View style={styles.block}>
        <MonthHistoryBlock
          history={history}
          statistics={statistics}
          language={language}
          theme={theme}
        />
        <GamesTimeStatsBlock
          statistics={statistics}
          theme={theme}
          language={language}
        />
        <SettingsButtonItem
          title={text[language].Settings}
          icon={'settings'}
          onPress={() => {
            navigation.navigate('SettingsScreen');
          }}
          theme={theme}
        />
        <ButtonBlock
          title={text[language].NewGame}
          icon={'play'}
          action={() => {
            navigation.navigate('GameModesScreen');
          }}
          theme={theme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    gap: 8,
    width: '92%',
  },
});
