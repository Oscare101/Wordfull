import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from '../../assets/icon.tsx';
import { Theme } from '../../constants/interfaces/interface.ts';
import colors from '../../constants/themes/colors.ts';

export default function SimpleHeader({
  onBack,
  title,
  theme,
}: {
  onBack: () => void;
  title: string;
  theme: Theme['id'];
}) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Icon name="chevronLeft" size={24} color={colors[theme].main} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors[theme].main }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    width: '100%',
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  headerTitle: {
    fontSize: 18,
  },
});
