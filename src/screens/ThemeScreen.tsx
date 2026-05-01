import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeButtonItem from '../components/settings/ThemeButtonItem';
import { ThemeType } from '../constants/themes/themeType';

type Props = StackScreenProps<RootStackParamList, 'ThemeScreen'>;
const width = Dimensions.get('screen').width;
export default function ThemeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme, setTheme } = useSettings();

  const themes: { title: string; id: ThemeType }[] = [
    { title: 'Olive', id: 'olive' },
    { title: 'Dark Blue', id: 'darkBlue' },
    { title: 'Dark Red', id: 'darkRed' },
    { title: 'Sky', id: 'sky' },
    { title: 'Black & White', id: 'blackWhite' },
  ];

  const onChangeTheme = useCallback(
    (id: ThemeType) => {
      setTheme(id);
    },
    [setTheme],
  );

  const renderThemeItem = useCallback(
    ({ item }: { item: { title: string; id: ThemeType } }) => (
      <ThemeButtonItem
        title={text[language][item.id]}
        onPress={onChangeTheme.bind(null, item.id)}
        theme={item.id}
        width={(width - 32 - 8) / 2}
      />
    ),
    [theme, onChangeTheme],
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
        title={text[language].Theme}
        theme={theme}
      />
      <Text style={[styles.title, { color: colors[theme].main }]}>
        {text[language].YourTheme}
      </Text>
      <ThemeButtonItem
        title={text[language][themes.find(t => t.id === theme)!.id] || ''}
        theme={theme}
        width={width - 32}
      />
      <Text style={[styles.title, { color: colors[theme].main }]}>
        {text[language].OtherThemes}
      </Text>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 8,
        }}
        columnWrapperStyle={{ gap: 8 }}
        data={themes}
        numColumns={2}
        renderItem={renderThemeItem}
      />
      <Text
        style={[
          styles.comment,
          { color: colors[theme].comment, marginBottom: insets.bottom + 16 },
        ]}
      >
        {text[language].AfterChangingThemeWarning}
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
