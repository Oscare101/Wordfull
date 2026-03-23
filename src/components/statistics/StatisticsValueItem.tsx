import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';

function StatisticsValueItem({
  theme,
  type,
  title,
  value,
}: {
  theme: ThemeType;
  type: 'main' | 'secondary';
  title: string;
  value: string | number;
}) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            type == 'main' ? colors[theme].main : colors[theme].bg,
          borderColor: colors[theme].border,
        },
      ]}
    >
      <Text
        style={{
          color: type === 'main' ? colors[theme].cardTitle : colors[theme].main,
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: type === 'main' ? colors[theme].cardTitle : colors[theme].main,
          fontSize: 16,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default React.memo(StatisticsValueItem);
