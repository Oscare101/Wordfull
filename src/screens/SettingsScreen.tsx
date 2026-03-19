import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language } from '../constants/interfaces/interface';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import { IconName } from '../constants/interfaces/iconInterface';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';
import { getSystemWordPackById } from '../constants/wordPacks/wordPack';

type Props = StackScreenProps<RootStackParamList, 'SettingsScreen'>;

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme, selectedWordPackId } = useSettings();

  const buttons: { title: string; icon: IconName; onPress: () => void }[] = [
    {
      title: text[language].Theme,
      icon: 'palette',
      onPress: () => {
        navigation.navigate('ThemeScreen');
      },
    },
    {
      title: text[language].Language,
      icon: 'language',
      onPress: () => {
        navigation.navigate('LanguageScreen');
      },
    },
    {
      title:
        getSystemWordPackById(selectedWordPackId)?.name || selectedWordPackId,
      icon: 'list',
      onPress: () => {},
    },
  ];

  const renderSettingsItem = useCallback(
    ({
      item,
    }: {
      item: { title: string; icon: IconName; onPress: () => void };
    }) => (
      <SettingsButtonItem
        title={item.title}
        icon={item.icon}
        onPress={item.onPress}
        theme={theme}
      />
    ),
    [theme],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors[theme].bg },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].Settings}
        theme={theme}
      />
      <FlatList
        data={buttons}
        renderItem={renderSettingsItem}
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
  header: {
    fontSize: 16,
  },
});
