import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';
import Icon from '../../assets/icon';

interface CardCountProps {
  theme: ThemeType;
  wordsAmount: number;
  wordNumber: number;
  type: string;
}

export default function CardCountBlock({
  theme,
  wordsAmount,
  wordNumber,
  type,
}: CardCountProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 32,
            color: colors[theme].comment,
          }}
        >
          {wordNumber}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 32,
          color: colors[theme].comment,
          marginHorizontal: 8,
        }}
      >
        /
      </Text>
      <View>
        {type === 'stamina' ? (
          <Icon name="infinity" color={colors[theme].comment} size={48} />
        ) : (
          <Text
            style={{
              fontSize: 32,
              color: colors[theme].comment,
            }}
          >
            {wordsAmount}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
