import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/themes/colors';
import {
  GameMode,
  Language,
  WordPack,
} from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';
import Icon from '../../assets/icon';
import text from '../../constants/languages/text';
import Toast from 'react-native-toast-message';

const MIN_WORDS_AMOUNT = 1;
const REPEAT_INTERVAL_MS = 100;

export default function WordsAmountInput({
  wordsAmount,
  setWordsAmount,
  wordPack,
  theme,
  gameMode,
  language,
}: {
  wordsAmount: string;
  setWordsAmount: React.Dispatch<React.SetStateAction<string>>;
  wordPack: WordPack;
  theme: ThemeType;
  gameMode: GameMode;
  language: Language;
}) {
  const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const isFirstMaxToastEffectRef = useRef(true);

  const maxWordsAmount = wordPack.words.length;

  const stopRepeating = useCallback(() => {
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }

    setTimeout(() => {
      longPressTriggeredRef.current = false;
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFirstMaxToastEffectRef.current) {
      isFirstMaxToastEffectRef.current = false;
      return;
    }

    if (Number(wordsAmount) === maxWordsAmount) {
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].wordsMaxWarning.replace(
            '#',
            wordPack.words.length.toString(),
          ),
        },
        position: 'top',
      });
    }
  }, [language, maxWordsAmount, wordPack.words.length, wordsAmount]);

  const updateWordsAmount = useCallback(
    (delta: number) => {
      setWordsAmount(previousValue => {
        const currentValue = Number(previousValue) || MIN_WORDS_AMOUNT;
        const nextValue = currentValue + delta;

        if (nextValue < MIN_WORDS_AMOUNT) {
          return String(MIN_WORDS_AMOUNT);
        }

        if (nextValue > maxWordsAmount) {
          return String(maxWordsAmount);
        }

        return String(nextValue);
      });
    },
    [maxWordsAmount, setWordsAmount],
  );

  const handleSinglePress = useCallback(
    (delta: number) => {
      if (longPressTriggeredRef.current) {
        return;
      }

      updateWordsAmount(delta);
    },
    [updateWordsAmount],
  );

  const handleLongPress = useCallback(
    (delta: number) => {
      longPressTriggeredRef.current = true;

      updateWordsAmount(delta);

      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
      }

      repeatIntervalRef.current = setInterval(() => {
        updateWordsAmount(delta);
      }, REPEAT_INTERVAL_MS);
    },
    [updateWordsAmount],
  );

  if (gameMode === 'stamina') {
    return (
      <>
        <Icon name="infinity" size={48} color={colors[theme].main} />

        <View style={styles.labelWrapper}>
          <Text
            style={[
              styles.labelText,
              { color: colors[theme].main, borderColor: colors[theme].main },
            ]}
          >
            {text[language].NumberOfWordsForExercise}
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.row}>
        <Pressable
          onPress={() => handleSinglePress(-1)}
          onLongPress={() => handleLongPress(-1)}
          onPressOut={stopRepeating}
          delayLongPress={250}
          style={[
            styles.button,
            { opacity: Number(wordsAmount) <= MIN_WORDS_AMOUNT ? 0.5 : 1 },
          ]}
          disabled={Number(wordsAmount) <= MIN_WORDS_AMOUNT}
        >
          <Text style={[styles.buttonText, { color: colors[theme].main }]}>
            -
          </Text>
        </Pressable>

        <Text style={[styles.valueText, { color: colors[theme].main }]}>
          {wordsAmount}
        </Text>

        <Pressable
          onPress={() => handleSinglePress(1)}
          onLongPress={() => handleLongPress(1)}
          onPressOut={stopRepeating}
          delayLongPress={250}
          style={[
            styles.button,
            { opacity: Number(wordsAmount) >= maxWordsAmount ? 0.5 : 1 },
          ]}
          disabled={Number(wordsAmount) >= maxWordsAmount}
        >
          <Text style={[styles.buttonText, { color: colors[theme].main }]}>
            +
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.labelWrapper,
          {
            borderColor: colors[theme].main,
          },
        ]}
      >
        <Text style={[styles.labelText, { color: colors[theme].main }]}>
          {text[language].NumberOfWordsForExercise}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  button: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 40,
    lineHeight: 44,
  },
  valueText: {
    fontSize: 40,
    lineHeight: 44,
    minWidth: 56,
    textAlign: 'center',
  },
  labelWrapper: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
});
