import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import colors from '../../constants/themes/colors';
import {
  GameMode,
  Language,
  WordPack,
} from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';
import Icon from '../../assets/icon';
import text from '../../constants/languages/text';

export default function WordsAmountInput({
  wordsAmount,
  setWordsAmount,
  wordPack,
  theme,
  gameMode,
  language,
}: {
  wordsAmount: string;
  setWordsAmount: (value: string) => void;
  wordPack: WordPack;
  theme: ThemeType;
  gameMode: GameMode;
  language: Language;
}) {
  return (
    <>
      {gameMode === 'stamina' ? (
        <Icon name="infinity" size={48} color={colors[theme].main} />
      ) : (
        <TextInput
          value={wordsAmount}
          onChangeText={(newValue: string) => {
            if (newValue.length === 0 || /^[1-9][0-9]*$/.test(newValue)) {
              setWordsAmount(newValue);
            }
          }}
          style={{
            textAlign: 'center',
            fontSize: 40,
            height: 80,
            // width: 200,
            alignItems: 'center',
            justifyContent: 'center',
            color:
              +wordsAmount > wordPack.words.length
                ? colors[theme].error
                : colors[theme].main,
          }}
          placeholder="0"
          placeholderTextColor={colors[theme].comment}
          keyboardType="number-pad"
          selectionColor={
            wordsAmount.length ? colors[theme].main : colors[theme].comment
          }
        />
      )}

      <View
        style={{
          borderTopWidth: 1,
          borderColor: colors[theme].main,
          borderStyle: 'solid',
          paddingTop: 8,
          // width: 240,
        }}
      >
        <Text
          style={{
            color: colors[theme].main,
            fontSize: 16,
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          {text[language].NumberOfWordsForExercise}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
