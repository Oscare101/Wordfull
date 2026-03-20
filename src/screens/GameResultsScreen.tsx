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
import ResultsViewSwitcher from '../components/game/ResultsViewSwitcher';

type Props = StackScreenProps<RootStackParamList, 'GameResultsScreen'>;

export default function GameResultsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const gameMode: GameMode = route.params.mode;
  const words: string[] = route.params.words.map(item => item.toLowerCase());
  const inputs: string[] = route.params.inputs.map(item => item.toLowerCase());
  const time: number = route.params.time;
  // const wordPack: WordPack = useSelectedWordPack();

  const [confirm, setConfirm] = useState<boolean>(false);
  const [wordsInputs, setWordsInputs] = useState<string[]>(
    Array(words.length).fill(''),
  );
  const inputRefs = useRef<TextInput[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const correctWordsAmount = words.reduce((acc, word, index) => {
    if (word === inputs[index]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const [modal, setModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'inputs' | 'words'>('inputs');
  usePreventGoBack({
    enabled: !modal,
    onBlockedGoBack: useCallback(() => {
      setModal(true);
    }, []),
  });

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
        <View
          style={{
            flex: 1,
            padding: 0,
            marginLeft: 16,
            borderBottomWidth: 1,
            borderColor: colors[theme].main,
            borderStyle: 'solid',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color:
                inputs[item.index] === words[item.index]
                  ? colors[theme].main
                  : !inputs[item.index].trim()
                  ? colors[theme].comment
                  : colors[theme].error,
            }}
          >
            {viewMode === 'inputs' ? inputs[item.index] : words[item.index]}
          </Text>
        </View>
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
        <ResultsViewSwitcher
          theme={theme}
          language={language}
          value={viewMode}
          onSwitch={(value: 'inputs' | 'words') => setViewMode(value)}
        />
        <FlatList
          ref={flatListRef}
          style={{ width: '100%' }}
          data={words}
          renderItem={RenderItem}
          ListHeaderComponent={() => <View style={{ height: 32 }} />}
          ListFooterComponent={() => <View style={{ height: 32 }} />}
        />
        <CheckBottomBlock
          theme={theme}
          language={language}
          wordsAmount={words.length}
          time={time}
          finishAvailable={true}
          onCheck={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'HomeScreen' as any }],
            });
          }}
          mode={gameMode}
          correctWordsAmount={correctWordsAmount}
        />
        {/* 
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
        /> */}
        {/* <ConfirmCheckModal
          theme={theme}
          language={language}
          visible={confirm}
          onClose={closeConfirmModal}
          onSubmit={submitConfirmGame}
        /> */}
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
