import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import {
  Language,
  SystemWordPackKey,
  WordPack,
} from '../constants/interfaces/interface';
import WordPackButtonItem from '../components/wordPack/WordPackButtonItem';
import { getSystemWordPackByKey } from '../constants/wordPacks/wordPack';

type Props = StackScreenProps<RootStackParamList, 'WordPackPreviewScreen'>;

export default function WordPackPreviewScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();

  const wordPackKey: SystemWordPackKey = route.params.wordPackKey;
  const wordPack = getSystemWordPackByKey(language, wordPackKey);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <Text style={{ fontSize: 16, color: colors[theme].main }}>{item}</Text>
    ),
    [],
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
        title={text[language][wordPackKey as keyof (typeof text)[Language]]}
        theme={theme}
      />
      <FlatList
        data={wordPack?.words.slice(0, 20)}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 8,
        }}
        ListFooterComponent={() => (
          <Text style={{ fontSize: 16, color: colors[theme].main }}>...</Text>
        )}
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
