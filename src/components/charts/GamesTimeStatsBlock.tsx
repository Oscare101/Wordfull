import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Language, Statistics } from '../../constants/interfaces/interface';
import text from '../../constants/languages/text';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';
import { TimeFormat } from '../../functions/functions';

export default function GamesTimeStatsBlock({
  statistics,
  theme,
  language,
}: {
  statistics: Statistics | null;
  theme: ThemeType;
  language: Language;
}) {
  return (
    <View style={[styles.container, { borderColor: colors[theme].border }]}>
      <View
        style={[
          styles.block,
          {
            borderRightWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors[theme].border,
          },
        ]}
      >
        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].GamesCompleted}
        </Text>
        <Text style={[styles.title, { color: colors[theme].main }]}>
          {statistics?.games}
        </Text>
      </View>
      <View style={styles.block}>
        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].TimePlaying}
        </Text>
        <Text style={[styles.title, { color: colors[theme].main }]}>
          {TimeFormat(statistics?.timeSpent ?? 0, language)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    height: 80,
  },
  block: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  comment: { fontSize: 14 },
});
