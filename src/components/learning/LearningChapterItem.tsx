import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { IconName } from '../../constants/interfaces/iconInterface';
import Icon from '../../assets/icon';
import colors from '../../constants/themes/colors';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import { Line, Svg } from 'react-native-svg';

export default function LearningChapterItem({
  title,
  index,
  icon,
  description,
  theme,
  language,
  onPress,
  width,
}: {
  title: string;
  index: number;
  icon: IconName;
  description: string;
  theme: ThemeType;
  language: Language;
  onPress: () => void;
  width: number;
}) {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          {
            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
            borderColor: colors[theme].border,
            width: width * 0.8,
            alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
          },
        ]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: 'column',
            width: width * 0.8 - 48 - 32,
            gap: 4,
            alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end',
          }}
        >
          <Text
            style={{
              color: colors[theme].main,
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: colors[theme].main,
              fontSize: 14,
              textAlign: index % 2 === 0 ? 'left' : 'right',
            }}
          >
            {description}
          </Text>
        </View>
        <Icon name={icon} size={32} color={colors[theme].main} />
      </TouchableOpacity>
      <Svg width={width} height={100} viewBox={`0 0 ${width} 100`}>
        <Line
          x1={width * 0.2}
          y1={index ? 100 : 0}
          x2={width * 0.8}
          y2={index ? 0 : 100}
          stroke={colors[theme].main}
          strokeWidth={2}
          strokeDasharray="4 6"
          opacity={0.6}
        />
      </Svg>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    gap: 16,
    marginBottom: 4,
  },
});
