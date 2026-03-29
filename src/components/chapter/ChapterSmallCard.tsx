import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../constants/themes/colors';
import { ThemeType } from '../../constants/themes/themeType';
import Icon from '../../assets/icon';
import { IconName } from '../../constants/interfaces/iconInterface';

export default function ChapterSmallCard({
  theme,
  title,
  icon,
}: {
  theme: ThemeType;
  title: string;
  icon: IconName;
}) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors[theme].main,
        padding: 8,
        borderRadius: 8,
        gap: 4,
      }}
    >
      <Icon name={icon} size={24} color={colors[theme].buttonTitleActive} />
      <Text style={{ color: colors[theme].buttonTitleActive }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
