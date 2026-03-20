import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import Icon from '../../assets/icon';
import colors from '../../constants/themes/colors';
import text from '../../constants/languages/text';

export default function GameHeader({
  isListOpened,
  theme,
  language,
  onClose,
  onToggleList,
  isStamina,
}: {
  isListOpened: boolean;
  theme: ThemeType;
  language: Language;
  onClose: () => void;
  onToggleList: () => void;
  isStamina: boolean;
}) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Icon name="close" size={32} color={colors[theme].main} />
      </TouchableOpacity>
      {!isStamina && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={onToggleList}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18, color: colors[theme].main }}>
            {isListOpened ? text[language].backToCards : text[language].list}
          </Text>
        </TouchableOpacity>
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
    paddingRight: 16,
    justifyContent: 'space-between',
  },
  button: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  rightButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
