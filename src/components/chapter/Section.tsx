import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';

export default function Section({
  children,
  theme,
  title,
}: {
  children: React.ReactNode;
  theme: ThemeType;
  title: string;
}) {
  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, { color: colors[theme].main }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ container: {}, title: {} });
