import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from '../../assets/icon';
import colors from '../../constants/themes/colors';
import { ThemeType } from '../../constants/themes/themeType';
import { GameMode, Language } from '../../constants/interfaces/interface';
import text from '../../constants/languages/text';

export default function GameModeBanner({
  gameMode,
  language,
  theme,
}: {
  gameMode: GameMode;
  language: Language;
  theme: ThemeType;
}) {
  const icon =
    gameMode === 'easy'
      ? 'speedLow'
      : gameMode === 'hard'
      ? 'speedHigh'
      : 'infinity';

  const title =
    gameMode === 'easy'
      ? text[language].EasyTitle
      : gameMode === 'hard'
      ? text[language].HardTitle
      : text[language].StaminaTitle;

  return (
    <>
      <Icon name={icon} color={colors[theme].main} size={48} />
      <Text
        style={{
          fontSize: 32,
          // fontWeight: 'bold',
          color: colors[theme].main,
          marginBottom: 32,
          marginTop: 8,
        }}
      >
        {title}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({});
