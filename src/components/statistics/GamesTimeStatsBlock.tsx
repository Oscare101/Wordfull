import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Language, Statistics } from '../../constants/interfaces/interface';
import text from '../../constants/languages/text';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';
import { NumberFormat, TimeFormat } from '../../functions/functions';
import Svg, { Line } from 'react-native-svg';
import Icon from '../../assets/icon';

function GamesTimeStatsBlock({
  statistics,
  theme,
  language,
  height = 80,
  onOpen,
}: {
  statistics: Statistics | null;
  theme: ThemeType;
  language: Language;
  height?: number;
  onOpen?: () => void;
}) {
  const container = (
    <View
      style={[styles.container, { borderColor: colors[theme].border, height }]}
    >
      {onOpen && (
        <View style={{ position: 'absolute', top: 16, right: 16 }}>
          <Icon name="open" size={16} color={colors[theme].main} />
        </View>
      )}
      <View style={[styles.block]}>
        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].GamesCompleted}
        </Text>
        <Text style={[styles.title, { color: colors[theme].main }]}>
          {NumberFormat(statistics?.games || 0, language)}
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
