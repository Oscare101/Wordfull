import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { IconName } from '../../constants/interfaces/iconInterface';
import Icon from '../../assets/icon';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';

export default function SettingsButtonItem({
  title,
  icon,
  onPress,
  theme,
}: {
  title: string;
  icon: IconName;
  onPress: () => void;
  theme: ThemeType;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          borderColor: colors[theme].border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonTitle, { color: colors[theme].main }]}>
        {title}
      </Text>
      <Icon name={icon} size={24} color={colors[theme].main} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderRadius: 16,
  },
  buttonTitle: {
    fontSize: 16,
  },
});
