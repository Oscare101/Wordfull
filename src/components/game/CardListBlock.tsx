import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import { GameMode, Language } from '../../constants/interfaces/interface';
import colors from '../../constants/themes/colors';
import WordsListBlock from './WordsListBlock';
import CardNavigation from './CardNavigation';

export default function CardListBlock({
  isListOpened,
  theme,
  language,
  words,
  wordIndex,
  onCloseList,
  mode,
  setWordIndex,
}: {
  isListOpened: boolean;
  theme: ThemeType;
  language: Language;
  words: string[];
  wordIndex: number;
  onCloseList: (index: number) => void;
  mode: GameMode;
  setWordIndex: (index: number) => void;
}) {
  return (
    <>
      {isListOpened ? (
        <WordsListBlock
          theme={theme}
          wordsList={words}
          onOpenCard={(index: number) => {
            onCloseList(index);
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Text style={{ fontSize: 32, color: colors[theme].main }}>
            {words[wordIndex].charAt(0).toUpperCase() +
              words[wordIndex].slice(1)}
          </Text>
          <CardNavigation
            theme={theme}
            wordsAmount={words.length}
            mode={mode}
            wordIndex={wordIndex}
            setWordIndex={(i: number) => {
              setWordIndex(i);
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({});
