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

type Props = StackScreenProps<RootStackParamList, 'LearningScreen'>;

export default function LearningScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors[theme].bg },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].Learning}
        theme={theme}
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
