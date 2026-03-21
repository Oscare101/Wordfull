import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Language, Statistics } from '../../constants/interfaces/interface';
import text from '../../constants/languages/text';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';
import { TimeFormat } from '../../functions/functions';
import Svg, { Line } from 'react-native-svg';

function GamesTimeStatsBlock({
  statistics,
  theme,
  language,
  height = 80,
}: {
  statistics: Statistics | null;
  theme: ThemeType;
  language: Language;
  height?: number;
}) {
  return (
    <View
      style={[styles.container, { borderColor: colors[theme].border, height }]}
    >
      <View style={[styles.block]}>
        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].GamesCompleted}
        </Text>
        <Text style={[styles.title, { color: colors[theme].main }]}>
          {statistics?.games}
        </Text>
      </View>
      <Svg width={1} height={height - 32} viewBox={`0 0 ${1} ${height - 32}`}>
        <Line
          x1={0}
          y1={0}
          x2={0}
          y2={height - 32}
          stroke={colors[theme].main}
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={0.6}
        />
      </Svg>

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
    paddingVertical: 16,
    flexDirection: 'row',
  },
  block: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  comment: { fontSize: 14 },
});

export default React.memo(GamesTimeStatsBlock);
