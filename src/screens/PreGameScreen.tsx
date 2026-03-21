import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import ButtonBlock from '../components/global/ButtonBlock';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameMode, WordPack } from '../constants/interfaces/interface';
import { rules } from '../constants/rules';
import { useSelectedWordPack } from '../constants/wordPacks/useSelectedWordPack';
import WordsAmountInput from '../components/preGame/WordsAmountInput';
import GameModeBanner from '../components/preGame/GameModeBanner';
import { GetRandomWords } from '../functions/functions';
import ExplanationModal from '../components/global/ExplanationModal';

type Props = StackScreenProps<RootStackParamList, 'PreGameScreen'>;

export default function PreGameScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const gameMode: GameMode = route.params.mode;
  const wordPack: WordPack = useSelectedWordPack();

  const [wordsAmount, setWordsAmount] = useState<string>(
    gameMode === 'stamina'
      ? wordPack.words.length.toString()
      : rules.defaultWordsAmount.toString(),
  );
  const [explanationModal, setExplanationModal] = useState<boolean>(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={''}
        theme={theme}
        rightIcon="info"
        rightIconAction={() => {
          setExplanationModal(true);
        }}
      />
      <View style={[styles.block, { marginBottom: insets.bottom + 16 }]}>
        <WordsAmountInput
          wordsAmount={wordsAmount}
          setWordsAmount={setWordsAmount}
          wordPack={wordPack}
          theme={theme}
          gameMode={gameMode}
          language={language}
        />
        <GameModeBanner gameMode={gameMode} language={language} theme={theme} />

        <Text
          style={{
            fontSize: 14,
            marginBottom: 16,
            color: colors[theme].main,
          }}
        >
          {text[language].gamePreambula}
        </Text>
        <ButtonBlock
          title={text[language].Start}
          icon={'play'}
          action={() => {
            const wordsArray = GetRandomWords(wordPack.words, +wordsAmount);

            navigation.navigate('GameScreen', {
              wordsAmount: +wordsAmount,
              mode: gameMode,
              words: wordsArray,
            });
          }}
          disabled={
            +wordsAmount === 0 ||
            +wordsAmount > wordPack.words.length ||
            isNaN(+wordsAmount)
          }
          theme={theme}
          titleStyles={{ fontSize: 26 }}
          iconSize={32}
          styles={{ justifyContent: 'center', height: 70 }}
        />
        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            marginTop: 16,
            color: colors[theme].main,
          }}
        >
          {text[language].startWhenReady}
        </Text>
      </View>
      <ExplanationModal
        theme={theme}
        language={language}
        type={gameMode === 'stamina' ? 'preGameStamina' : 'preGameEasyHard'}
        visible={explanationModal}
        onClose={() => setExplanationModal(false)}
        wordsAmount={wordPack.words.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  block: {
    gap: 8,
    width: '92%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
