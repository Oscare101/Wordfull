import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language } from '../constants/interfaces/interface';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';

type Props = StackScreenProps<RootStackParamList, 'SettingsScreen'>;

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, theme, setTheme } = useSettings();

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
      <Text style={[styles.header, { color: colors[theme].main }]}>
        {text[language].Language}
      </Text>

      <Button
        title={text[language].Ukrainian}
        onPress={() => {
          setLanguage('uk');
        }}
      />
      <Button
        title={text[language].English}
        onPress={() => {
          setLanguage('en');
        }}
      />
      <Text style={[styles.header, { color: colors[theme].main }]}>
        {text[language].Theme}
      </Text>
      <Button
        title="Olive"
        onPress={() => {
          setTheme('olive');
        }}
      />
      <Button
        title="Dark Blue"
        onPress={() => {
          setTheme('darkBlue');
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
