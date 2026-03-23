import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import ButtonBlock from '../components/global/ButtonBlock';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';
import { useStatistics } from '../context/StatisticsContext';
import { useHistory } from '../context/HistoryContext';
import HistoryChartBlock from '../components/statistics/HistoryChartBlock';
import QuoteBlock from '../components/home/QuoteBlock';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = StackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: Props) {
  const { language, theme } = useSettings();
  const { statistics } = useStatistics();
  const { history } = useHistory();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors[theme].bg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={[styles.block, { gap: 32, flex: 1 }]}>
        <Text style={[styles.title, { color: colors[theme].main }]}>
          Wordfull
        </Text>
        <QuoteBlock theme={theme} language={language} />
      </View>

      <View style={[styles.block, { flex: 2 }]}>
        <HistoryChartBlock
          history={history}
          language={language}
          theme={theme}
          type="week"
          onOpen={() => navigation.navigate('StatisticsScreen')}
        />
        <SettingsButtonItem
          title={text[language].Learning}
          icon={'book'}
          onPress={() => {
            navigation.navigate('LearningScreen');
          }}
          theme={theme}
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
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  block: {
    gap: 8,
    width: '92%',
    justifyContent: 'center',
  },
});
