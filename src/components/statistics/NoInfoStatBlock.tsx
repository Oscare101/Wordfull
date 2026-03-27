import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import colors from '../../constants/themes/colors';
import text from '../../constants/languages/text';

export default function NoInfoStatBlock({
  language,
  theme,
  height,
}: {
  language: Language;
  theme: ThemeType;
  height: number;
}) {
  return (
    <View
      style={{
        width: '100%',
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: colors[theme].main,
        }}
      >
        {text[language].NoInfo}
      </Text>
      <Text style={{ fontSize: 14, color: colors[theme].main }}>
        {text[language].PlayYourFirstGame}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
