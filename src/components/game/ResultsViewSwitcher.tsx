import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../constants/themes/colors';
import { ThemeType } from '../../constants/themes/themeType';

function ResultsViewSwitcher({
  theme,
  language,
  value,
  onSwitch,
}: {
  theme: ThemeType;
  language: string;
  value: 'inputs' | 'words';
  onSwitch: (value: 'inputs' | 'words') => void;
}) {
  return (
    <View style={[styles.container, { backgroundColor: colors[theme].card }]}>
      <TouchableOpacity
        onPress={() => onSwitch('inputs')}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            backgroundColor:
              value === 'inputs' ? colors[theme].bg : 'transparent',
          },
        ]}
      >
        <Text
          style={{
            fontSize: 16,
            color:
              value === 'inputs' ? colors[theme].main : colors[theme].comment,
          }}
        >
          Inputs
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSwitch('words')}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            backgroundColor:
              value === 'words' ? colors[theme].bg : 'transparent',
          },
        ]}
      >
        <Text
          style={{
            fontSize: 16,
            color:
              value === 'words' ? colors[theme].main : colors[theme].comment,
          }}
        >
          Words
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 12,
    width: '92%',
    height: 40,
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: '50%',
    height: '100%',
    borderRadius: 8,
    flex: 1,
  },
});

export default React.memo(ResultsViewSwitcher);
