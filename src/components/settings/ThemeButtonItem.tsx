import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';

function ThemeButtonItem({
  title,
  onPress,
  theme,
  width,
}: {
  title: string;
  onPress?: () => void;
  theme: ThemeType;
  width: number;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          borderColor: colors[theme].border,
          width: width,
          backgroundColor: colors[theme].bg,
        },
      ]}
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.8}
    >
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
    borderRadius: 16,
    gap: 8,
  },
  buttonTitle: {
    fontSize: 16,
  },
});

export default React.memo(ThemeButtonItem);
