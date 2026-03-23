import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  History,
  Language,
  Statistics,
} from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';
import text from '../../constants/languages/text';
import colors from '../../constants/themes/colors';
import AccuracyProgressChart from '../charts/AccuracyProgressChart';
import Icon from '../../assets/icon';

export default function AccuracyHistoryBlock({
  history,
  statistics,
  language,
  theme,
  height = 150,
  onOpen,
}: {
  history: History[];
  statistics: Statistics | null;
  language: Language;
  theme: ThemeType;
  height?: number;
  onOpen?: () => void;
}) {
  const wordsAmount: number = statistics?.wordsMemorized ?? 0;

  const container = (
    <View
      style={[styles.container, { borderColor: colors[theme].border, height }]}
    >
      {onOpen && (
        <View style={{ position: 'absolute', top: 16, right: 16 }}>
          <Icon name="open" size={16} color={colors[theme].main} />
        </View>
      )}
      <Text style={{ fontSize: 14, color: colors[theme].main }}>
        {text[language].WordsAmount} ■ + {text[language].Accuracy}{' '}
        <Text style={{ color: colors[theme].comment }}>●</Text>
      </Text>
      <AccuracyProgressChart
        history={history}
        days={7}
        accuracyColor={colors[theme].comment}
        height={height - 40}
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
