import { FlatList, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import React, { useCallback, useState, useRef } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BeforeRemoveEvent, usePreventGoBack } from '../hooks/usePreventGoBack';
import { GameMode, WordPack } from '../constants/interfaces/interface';
import { useSelectedWordPack } from '../constants/wordPacks/useSelectedWordPack';
import CheckBottomBlock from '../components/game/CheckBottomBlock';
import ConfirmCheckModal from '../components/game/ConfirmCheckModal';
import { gameResultsRepository } from '../db/repositories/gameResultsRepository';
import { useStatistics } from '../context/StatisticsContext';
import { useHistory } from '../context/HistoryContext';
import CheckInputRow from '../components/game/CheckInputRow';
import Toast from 'react-native-toast-message';
import text from '../constants/languages/text';

type Props = StackScreenProps<RootStackParamList, 'CheckScreen'>;

export default function CheckScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const wordPack: WordPack = useSelectedWordPack();
  const { reloadStatistics } = useStatistics();
  const { reloadHistory } = useHistory();

  const wordsAmount: number = route.params.wordsAmount;
  const gameMode: GameMode = route.params.mode;
  const words: string[] = route.params.words;
  const start: number = route.params.start;
  const finish: number = route.params.finish;

  const [confirm, setConfirm] = useState<boolean>(false);
  const [wordsInputs, setWordsInputs] = useState<string[]>(
    Array(wordsAmount).fill(''),
  );

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const flatListRef = useRef<FlatList<string>>(null);

  const time = finish - start;

  usePreventGoBack({
    enabled: true,
    shouldPrevent: useCallback((event: BeforeRemoveEvent) => {
      const action = event.data.action as {
        type?: string;
        payload?: {
          routes?: Array<{ name?: string }>;
        };
      };

      const routes = action.payload?.routes;
      const isResetToHome =
        action.type === 'RESET' &&
        routes?.length === 1 &&
        routes[0]?.name === 'HomeScreen';

      return !isResetToHome;
    }, []),
    onBlockedGoBack: useCallback(() => {}, []),
  });

  const onCheck = useCallback(() => {
    if (wordsInputs.some((i: any) => !i.trim())) {
      setConfirm(true);
    } else {
      submitConfirmGame();
    }
  }, [wordsInputs]);

  const closeConfirmModal = useCallback(() => {
    setConfirm(false);
  }, []);

  const submitConfirmGame = useCallback(async () => {
    try {
      setConfirm(false);

      await gameResultsRepository.saveCompletedGame({
        duration: time,
        mode: gameMode,
        wordPackId: wordPack.id,
        wordPackNameSnapshot: wordPack.name,
        words,
        inputs: wordsInputs,
        language: language,
      });
      await reloadStatistics();
      await reloadHistory();

      navigation.navigate('GameResultsScreen', {
        words,
        inputs: wordsInputs,
        time,
        mode: gameMode,
      });
    } catch (error) {
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: text[language].SmthWentWrongTryAgain,
        },
        position: 'top',
      });
      if (__DEV__) console.error('Failed to save completed game:', error);
    }
  }, [time, wordsInputs, words, gameMode, wordPack, navigation]);

  const registerInputRef = useCallback(
    (index: number, ref: TextInput | null) => {
      inputRefs.current[index] = ref;
    },
    [],
  );

  const onChangeValue = useCallback((index: number, value: string) => {
    setWordsInputs(prev => {
      if (prev[index] === value) {
        return prev;
      }

      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const onSubmitIndex = useCallback(
    (index: number) => {
      const nextIndex = index + 1;

      if (nextIndex < wordsInputs.length) {
        inputRefs.current[nextIndex]?.focus();

        requestAnimationFrame(() => {
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.5,
          });
        });
      } else {
        Keyboard.dismiss();
      }
    },
    [wordsInputs.length],
  );

  const renderItem = useCallback(
    ({ index }: { item: string; index: number }) => {
      return (
        <CheckInputRow
          index={index}
          value={wordsInputs[index]}
          totalCount={wordsInputs.length}
          theme={theme}
          onChangeValue={onChangeValue}
          onSubmitIndex={onSubmitIndex}
          registerInputRef={registerInputRef}
        />
      );
    },
    [wordsInputs, theme, onChangeValue, onSubmitIndex, registerInputRef],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <View style={[styles.block, { marginBottom: insets.bottom + 16 }]}>
        <FlatList
          ref={flatListRef}
          style={{ width: '100%' }}
          data={words}
          renderItem={renderItem}
          ListHeaderComponent={() => <View style={{ height: 32 }} />}
          ListFooterComponent={() => <View style={{ height: 200 }} />}
        />
        <CheckBottomBlock
          theme={theme}
          language={language}
          wordsAmount={wordsAmount}
          time={time}
          finishAvailable={true}
          onCheck={onCheck}
          mode={gameMode}
        />

        <ConfirmCheckModal
          theme={theme}
          language={language}
          visible={confirm}
          onClose={closeConfirmModal}
          onSubmit={submitConfirmGame}
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
