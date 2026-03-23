import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';
import { Line, Svg } from 'react-native-svg';

function StatisticsMultipleValueItem({
  theme,
  title1,
  value1,
  title2,
  value2,
  title3,
  value3,
  title4,
  value4,
  width,
}: {
  theme: ThemeType;
  title1: string;
  value1: string | number;
  title2: string;
  value2: string | number;
  title3: string;
  value3: string | number;
  title4: string;
  value4: string | number;
  width: number;
}) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors[theme].bg,
          borderColor: colors[theme].border,
        },
      ]}
    >
      <View style={[styles.row, { backgroundColor: colors[theme].main }]}>
        <Text
          style={{
            color: colors[theme].cardTitle,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {title1}
        </Text>
        <Text
          style={{
            color: colors[theme].cardTitle,
            fontSize: 16,
          }}
        >
          {value1}
        </Text>
      </View>

      <View style={[styles.row, { backgroundColor: colors[theme].bg }]}>
        <Text
          style={{
            color: colors[theme].main,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {title2}
        </Text>
        <Text
          style={{
            color: colors[theme].main,
            fontSize: 16,
          }}
        >
          {value2}
        </Text>
      </View>
      <Svg width={width - 64} height={1} viewBox={`0 0 ${width - 64} 1`}>
        <Line
          x1={0}
          y1={0}
          x2={width - 64}
          y2={0}
          stroke={colors[theme].main}
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={0.6}
        />
      </Svg>
      <View style={[styles.row, { backgroundColor: colors[theme].bg }]}>
        <Text
          style={{
            color: colors[theme].main,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {title3}
        </Text>
        <Text
          style={{
            color: colors[theme].main,
            fontSize: 16,
          }}
        >
          {value3}
        </Text>
      </View>
      <Svg width={width - 64} height={1} viewBox={`0 0 ${width - 64} 1`}>
        <Line
          x1={0}
          y1={0}
          x2={width - 64}
          y2={0}
          stroke={colors[theme].main}
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={0.6}
        />
      </Svg>
      <View style={[styles.row, { backgroundColor: colors[theme].bg }]}>
        <Text
          style={{
            color: colors[theme].main,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {title4}
        </Text>
        <Text
          style={{
            color: colors[theme].main,
            fontSize: 16,
          }}
        >
          {value4}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
});

export default React.memo(StatisticsMultipleValueItem);
