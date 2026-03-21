import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageButtonItem from '../components/settings/LanguageButtonItem';
import { Language } from '../constants/interfaces/interface';

type Props = StackScreenProps<RootStackParamList, 'LanguageScreen'>;
const width = Dimensions.get('screen').width;

export default function LanguageScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme, setLanguage } = useSettings();

  const languages: { code: Language; title: string; flag: string }[] = [
    { code: 'en', title: text[language].English, flag: '🇬🇧' },
    { code: 'uk', title: text[language].Ukrainian, flag: '🇺🇦' },
  ];

  const onChangeLanguage = useCallback(
    (code: Language) => {
      setLanguage(code);
    },
    [setLanguage],
  );

  const renderLanguageItem = useCallback(
    ({ item }: { item: { code: Language; title: string; flag: string } }) => (
      <LanguageButtonItem
        title={item.title}
        flag={item.flag}
        onPress={onChangeLanguage.bind(null, item.code)}
        theme={theme}
        width={(width - 32 - 8) / 2}
      />
    ),
    [theme, onChangeLanguage],
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
        title={text[language].Language}
        theme={theme}
      />
      <Text style={[styles.title, { color: colors[theme].main }]}>
        {text[language].YourLanguage}
      </Text>
      <LanguageButtonItem
        title={languages.find(l => l.code === language)?.title || ''}
        flag={languages.find(l => l.code === language)?.flag || ''}
        theme={theme}
        width={width - 32}
      />
      <Text style={[styles.title, { color: colors[theme].main }]}>
        {text[language].OtherLanguages}
      </Text>

      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 8,
        }}
        columnWrapperStyle={{ gap: 8 }}
        data={languages}
        numColumns={2}
        renderItem={renderLanguageItem}
      />
      <Text
        style={[
          styles.comment,
          { color: colors[theme].comment, marginBottom: insets.bottom + 16 },
        ]}
      >
        {text[language].AfterChangingLanguageWarning}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    width: '92%',
    marginBottom: 8,
    marginTop: 16,
  },
  comment: {
    fontSize: 14,
    width: '92%',
    marginBottom: 16,
    textAlign: 'center',
  },
});
