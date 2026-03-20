import {
  FlatList,
  InteractionManager,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState, useEffect, useRef } from 'react';
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
import CheckBottomBlock from '../components/game/CheckBottomBlock';
import ConfirmCheckModal from '../components/game/ConfirmCheckModal';

type Props = StackScreenProps<RootStackParamList, 'CheckScreen'>;

export default function CheckScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const wordsAmount: number = route.params.wordsAmount;
  const gameMode: GameMode = route.params.mode;
  const words: string[] = route.params.words;
  const start: number = route.params.start;
  const finish: number = route.params.finish;
  // const wordPack: WordPack = useSelectedWordPack();

  const [confirm, setConfirm] = useState<boolean>(false);
  const [wordsInputs, setWordsInputs] = useState<string[]>(
    Array(wordsAmount).fill(''),
  );
  const inputRefs = useRef<TextInput[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const time = finish - start;

  const [modal, setModal] = useState<boolean>(false);

  usePreventGoBack({
    enabled: !modal,
    onBlockedGoBack: useCallback(() => {
      setModal(true);
    }, []),
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

  const submitConfirmGame = useCallback(() => {
    setConfirm(false);
    // navigation.pop(2);
    navigation.navigate('GameResultsScreen', {
      words: words,
      inputs: wordsInputs,
      time: time,
      mode: gameMode,
    });
    // TODO save result to statistics
  }, [time, wordsInputs, words, gameMode]);

  function RenderItem(item: any) {
    return (
      <View
        style={{
          width: '80%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 40,
          alignSelf: 'center',
        }}
      >
        <Text style={{ fontSize: 24, color: colors[theme].main }}>
          {item.index + 1}
        </Text>
        <TextInput
          ref={(el: any) => (inputRefs.current[item.index] = el!)} // Store reference
          value={wordsInputs[item.index]}
          onChangeText={(value: string) => {
            let arr = [...wordsInputs];
            arr[item.index] = value;

            setWordsInputs(arr);
          }}
          style={{
            flex: 1,
            color: colors[theme].main,
            fontSize: 24,
            padding: 0,
            marginLeft: 16,
            borderBottomWidth: 1,
            borderColor: colors[theme].main,
            borderStyle: 'solid',
          }}
          selectionColor={colors[theme].main}
          autoCapitalize="words"
          returnKeyType={
            item.index === wordsInputs.length - 1 ? 'done' : 'next'
          } // 'done' on last input
          onSubmitEditing={() => {
            const nextIndex = item.index + 1;
            if (nextIndex < wordsInputs.length) {
              flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
                viewPosition: 0.5, // optional: scrolls the item to middle
              });

              InteractionManager.runAfterInteractions(() => {
                inputRefs.current[nextIndex]?.focus();
              });
            }
          }}
        />
      </View>
    );
  }

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
          renderItem={RenderItem}
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

        <CloseGameModal
          theme={theme}
          language={language}
          visible={modal}
          onClose={() => setModal(false)}
          onSubmit={() => {
            // navigation.pop(2);

            setModal(false);
            navigation.goBack();
            // TODO save statistics
          }}
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
