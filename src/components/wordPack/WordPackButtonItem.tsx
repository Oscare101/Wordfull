import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { IconName } from '../../constants/interfaces/iconInterface';
import Icon from '../../assets/icon';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';
import text from '../../constants/languages/text';
import { Language } from '../../constants/interfaces/interface';

function WordPackButtonItem({
  title,
  isSelected,
  onToggle,
  onPreview,
  theme,
  language,
  wordsAmount,
}: {
  title: string;
  isSelected: true | false;
  onToggle?: () => void;
  onPreview?: () => void;
  theme: ThemeType;
  language: Language;
  wordsAmount: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          borderColor: colors[theme].border,
        },
      ]}
      disabled={!onToggle && !onPreview}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Text style={[styles.buttonTitle, { color: colors[theme].main }]}>
          {title}
        </Text>
        <View
          style={{
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderRadius: 4,
            borderColor: isSelected
              ? colors[theme].main
              : colors[theme].main + 'aa',
            backgroundColor: isSelected ? colors[theme].main : 'transparent',
          }}
        >
          {isSelected && (
            <Icon name={'check'} size={18} color={colors[theme].bg} />
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <TouchableOpacity
          style={styles.previewButton}
          activeOpacity={0.8}
          onPress={onPreview}
        >
          <Text style={{ fontSize: 14, color: colors[theme].main + 'aa' }}>
            {text[language].Preview} {wordsAmount}
          </Text>
          <Icon
            name="chevronRight"
            size={14}
            color={colors[theme].main + 'aa'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
    // height: 80,
    borderWidth: 1,
    borderRadius: 16,
    gap: 8,
  },
  buttonTitle: {
    fontSize: 16,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default React.memo(WordPackButtonItem);
