import { FlatList, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { WordPack } from '../constants/interfaces/interface';
import WordPackButtonItem from '../components/wordPack/WordPackButtonItem';
import { getSystemWordPackByKey } from '../constants/wordPacks/wordPack';

type Props = StackScreenProps<RootStackParamList, 'WordPacksScreen'>;

export default function WordPacksScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const {
    language,
    theme,
    toggleSystemWordPackKey,
    selectedSystemWordPackKeys,
  } = useSettings();

  const packs: { title: string; key: WordPack['key'] }[] = [
    {
      title: text[language].simple_nouns,
      key: 'simple_nouns',
    },
    {
      title: text[language].complex_nouns,
      key: 'complex_nouns',
    },
    {
      title: text[language].abstract_nouns,
      key: 'abstract_nouns',
    },
  ];

  const renderItem = useCallback(
    ({ item }: { item: { title: string; key: WordPack['key'] } }) => (
      <WordPackButtonItem
        title={item.title}
        isSelected={
          item.key ? selectedSystemWordPackKeys.includes(item.key) : false
        }
        onToggle={() => item.key && toggleSystemWordPackKey(item.key)}
        onPreview={() => {
          if (item.key) {
            navigation.navigate('WordPackPreviewScreen', {
              wordPackKey: item.key,
            });
          }
        }}
        theme={theme}
        language={language}
        wordsAmount={
          item.key
            ? getSystemWordPackByKey(
                language,
                item.key,
              )?.words.length.toString() || '0'
            : '0'
        }
      />
    ),
    [theme, toggleSystemWordPackKey, selectedSystemWordPackKeys, language],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].WordPacks}
        theme={theme}
      />
      <FlatList
        data={packs}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 8,
        }}
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
});
