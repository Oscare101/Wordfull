import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import Icon from '../../assets/icon';
import colors from '../../constants/themes/colors';
import { GameMode } from '../../constants/interfaces/interface';

export default function CardNavigation({
  theme,
  wordsAmount,
  mode,
  wordIndex,
  setWordIndex,
}: {
  theme: ThemeType;
  wordsAmount: number;
  mode: GameMode;
  wordIndex: number;
  setWordIndex: (index: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => {
          if (wordIndex > 0) {
            setWordIndex(wordIndex - 1);
          }
        }}
        disabled={mode !== 'easy' || wordIndex === 0}
      >
        <Icon
          name="arrowLeft"
          size={32}
          color={
            wordIndex === 0 || mode !== 'easy'
              ? '#00000000'
              : colors[theme].main
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => {
          if (wordIndex < wordsAmount - 1) {
            setWordIndex(wordIndex + 1);
          }
        }}
        disabled={wordIndex === wordsAmount - 1}
      >
        <Icon
          name="arrowRight"
          size={32}
          color={
            wordIndex === wordsAmount - 1 ? '#00000000' : colors[theme].main
          }
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    padding: 16,
    // TODO maybe make them bigger
  },
});
