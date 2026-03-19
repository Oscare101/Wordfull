import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { IconName } from '../../constants/interfaces/iconInterface';
import Icon from '../../assets/icon';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';

export default function LanguageButtonItem({
  title,
  flag,
  onPress,
  theme,
  width,
}: {
  title: string;
  flag: string;
  onPress: () => void;
  theme: ThemeType;
  width: number;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          borderColor: colors[theme].border + '80',
          width: width,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonTitle, { color: colors[theme].main }]}>
        {flag}
      </Text>
      <Text style={[styles.buttonTitle, { color: colors[theme].main }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  buttonTitle: {
    fontSize: 16,
  },
});
