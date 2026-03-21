import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { History, Language } from '../../constants/interfaces/interface';
import colors from '../../constants/themes/colors';
import { useSettings } from '../../context/SettingsContext';
import text from '../../constants/languages/text';

interface TopGamesChartProps {
  games: History[];
  maxItems?: number;
  height?: number;
}

function formatGameDate(timestamp: number, language: Language): string {
  const date = new Date(timestamp);

  return date.toLocaleDateString(language, {
    month: 'long',
    day: 'numeric',
  });
}

export default function TopGamesChart({
  games,
  maxItems = 5,
  height = 100,
}: TopGamesChartProps) {
  const { theme, language } = useSettings();
  const themeColors = colors[theme];

  const visibleGames = useMemo(() => {
    return games.slice(0, maxItems);
  }, [games, maxItems]);

  const bestGame = visibleGames[0];
  const maxCorrectWords = bestGame?.correctWords ?? 1;

  if (!bestGame) {
    return null;
  }

  const perioud = (height - 40) / (maxItems * 2 + maxItems - 1);

  const wordsTitle =
    bestGame.correctWords % 10 === 1
      ? text[language].Word
      : bestGame.correctWords && [2, 3, 4].includes(bestGame.correctWords % 10)
      ? text[language].Words23
      : text[language].Words;

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.topRow}>
        <Text style={[styles.bestWordsText, { color: themeColors.main }]}>
          {bestGame.correctWords} {wordsTitle.toLocaleLowerCase()}
        </Text>

        <Text style={[styles.bestDateText, { color: themeColors.main }]}>
          {formatGameDate(bestGame.timestamp, language)}
        </Text>
      </View>

      <View style={[{ height: height - 40, gap: perioud }]}>
        <View
          style={[
            {
              backgroundColor: themeColors.main,
              width: '100%',
              height: perioud * 2,
              borderRadius: perioud / 2,
            },
          ]}
        />

        {visibleGames.slice(1).map(item => {
          const widthPercent =
            maxCorrectWords > 0
              ? Math.max((item.correctWords / maxCorrectWords) * 100, 12)
              : 12;

          return (
            <View
              key={item.id}
              style={[
                {
                  width: `${widthPercent}%`,
                  backgroundColor: themeColors.main + '66',
                  height: perioud * 2,
                  borderRadius: perioud / 2,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // marginBottom: 12,
  },
  bestWordsText: {
    fontSize: 16,
    lineHeight: 34,
    fontWeight: '700',
  },
  bestDateText: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '400',
  },
});
