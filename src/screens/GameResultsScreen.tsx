import { BackHandler, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { use, useCallback, useState } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BeforeRemoveEvent, usePreventGoBack } from '../hooks/usePreventGoBack';
import { GameMode } from '../constants/interfaces/interface';
import CheckBottomBlock from '../components/game/CheckBottomBlock';
import ResultsViewSwitcher from '../components/game/ResultsViewSwitcher';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { gameResultsRepository } from '../db/repositories/gameResultsRepository';
import { useSelectedWordPack } from '../constants/wordPacks/useSelectedWordPack';

type Props = StackScreenProps<RootStackParamList, 'GameResultsScreen'>;

export default function GameResultsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const gameMode: GameMode = route.params.mode;
  const wordPack = useSelectedWordPack();
  const words: string[] = route.params.words.map(item =>
    item.trim().toLowerCase(),
  );
  const inputs: string[] = route.params.inputs.map(item =>
    item.trim().toLowerCase(),
  );
  const time: number = route.params.time;

  const correctWordsAmount = words.reduce((acc, word, index) => {
    if (word === inputs[index]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const [viewMode, setViewMode] = useState<'inputs' | 'words'>('inputs');

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );

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

  const navigateHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      }),
    );
  }, [navigation]);

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
          onCheck={navigateHome}
          mode={gameMode}
          correctWordsAmount={correctWordsAmount}
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
