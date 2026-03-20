import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import ButtonBlock from '../components/global/ButtonBlock';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreventGoBack } from '../hooks/usePreventGoBack';
import { GameMode, WordPack } from '../constants/interfaces/interface';
import { useSelectedWordPack } from '../constants/wordPacks/useSelectedWordPack';
import GameHeader from '../components/game/GameHeader';
import CardListBlock from '../components/game/CardListBlock';
import CloseGameModal from '../components/game/CloseGameModal';
import GameBottomBlock from '../components/game/GameBottomBlock';

type Props = StackScreenProps<RootStackParamList, 'GameScreen'>;

export default function GameScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const wordsAmount: number = route.params.wordsAmount;
  const gameMode: GameMode = route.params.mode;
  const words: string[] = route.params.words;
  // const wordPack: WordPack = useSelectedWordPack();

  const [startTime, setStartTime] = useState<number>();
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const [finishAvailable, setFinishAvailable] = useState<boolean>(
    gameMode === 'stamina' || false,
  );
  const [isListOpened, setIsListOpened] = useState<boolean>(false);

  useEffect(() => {
    setStartTime(new Date().getTime());
  }, []);

  usePreventGoBack({
    enabled: !modal,
    onBlockedGoBack: useCallback(() => {
      setModal(true);
    }, []),
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <GameHeader
        isListOpened={isListOpened}
        theme={theme}
        language={language}
        onClose={() => {
          setModal(true);
        }}
        onToggleList={() => {
          setIsListOpened(!isListOpened);

          setFinishAvailable(true);
        }}
        isStamina={gameMode === 'stamina'}
      />
      <View style={[styles.block, { marginBottom: insets.bottom + 16 }]}>
        <CardListBlock
          isListOpened={isListOpened}
          theme={theme}
          language={language}
          words={words}
          wordIndex={wordIndex}
          onCloseList={(index: number) => {
            setWordIndex(index);
            setIsListOpened(false);
          }}
          mode={gameMode}
          setWordIndex={(i: number) => {
            if (i === words.length - 1) {
              setFinishAvailable(true);
            }
            setWordIndex(i);
          }}
        />
        <GameBottomBlock
          theme={theme}
          language={language}
          wordsAmount={wordsAmount}
          startTime={startTime}
          wordIndex={wordIndex}
          finishAvailable={finishAvailable}
          onFinish={() => {
            setModal(true);
            // navigation.navigate('CheckScreen', {
            //   start: startTime,
            //   finish: new Date().getTime(),
            //   words:
            //     route.params.type === 'stamina'
            //       ? route.params.words.slice(0, wordIndex + 1)
            //       : route.params.words,
            //   type: route.params.type,
            // });
          }}
          isListOpened={isListOpened}
          mode={gameMode}
        />
        <CloseGameModal
          theme={theme}
          language={language}
          visible={modal}
          onClose={() => setModal(false)}
          onSubmit={() => {
            setModal(false);
            navigation.goBack();
            // TODO save statistics
          }}
        />
      </View>
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
  },
});
