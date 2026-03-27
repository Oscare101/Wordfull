import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Language } from '../../constants/interfaces/interface';
import text from '../../constants/languages/text';
import colors from '../../constants/themes/colors';
import { ThemeType } from '../../constants/themes/themeType';
import { useTopBestGames } from '../../hooks/useTopBestGames';
import TopGamesChart from '../charts/TopGamesChart';
import Icon from '../../assets/icon';
import NoInfoStatBlock from './NoInfoStatBlock';

function PersonalBestsBlock({
  language,
  theme,
  height = 150,
  maxGames = 5,
  onOpen,
}: {
  language: Language;
  theme: ThemeType;
  height?: number;
  maxGames?: number;
  onOpen?: () => void;
}) {
  const topGames = useTopBestGames(maxGames);
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
        {text[language].PersonalBestResults}
      </Text>
      {topGames.length === 0 ? (
        <NoInfoStatBlock
          language={language}
          theme={theme}
          height={height - 50}
        />
      ) : (
        <TopGamesChart
          games={topGames}
          height={height - 50}
          maxItems={maxGames}
        />
      )}
      {topGames.length === 1 && (
        <Text
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            color: colors[theme].main,
          }}
        >
          {text[language].PlayMoreGamesToUnlockYourPersonalBests}
        </Text>
      )}
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});

export default React.memo(PersonalBestsBlock);
