import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';

type Props = StackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: Props) {
  const { language, theme } = useSettings();
  return (
    <View style={[styles.container, { backgroundColor: colors[theme].bg }]}>
      <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
        <Text>{text[language].Settings}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
