import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from '../../assets/icon.tsx';
import colors from '../../constants/themes/colors.ts';
import { ThemeType } from '../../constants/themes/themeType.ts';
import { IconName } from '../../constants/interfaces/iconInterface.ts';

export default function SimpleHeader({
  onBack,
  title,
  theme,
  leftIcon,
  rightIcon,
  rightIconAction,
}: {
  onBack: () => void;
  title: string;
  theme: ThemeType;
  leftIcon?: IconName;
  rightIcon?: IconName;
  rightIconAction?: () => void;
}) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Icon
          name={leftIcon || 'chevronLeft'}
          size={32}
          color={colors[theme].main}
        />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors[theme].main }]}>
        {title}
      </Text>
      {rightIcon ? (
        <TouchableOpacity
          onPress={rightIconAction}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Icon name={rightIcon} size={32} color={colors[theme].main} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
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
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  button: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
  },
  placeholder: {
    width: 60,
  },
});
