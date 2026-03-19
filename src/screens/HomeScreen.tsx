import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import ButtonBlock from '../components/global/ButtonBlock';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';

type Props = StackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: Props) {
  const { language, theme } = useSettings();
  return (
    <View style={[styles.container, { backgroundColor: colors[theme].bg }]}>
      <View style={styles.block}>
        <SettingsButtonItem
          title={text[language].Settings}
          icon={'list'}
          onPress={() => {
            navigation.navigate('SettingsScreen');
          }}
          theme={theme}
        />
        <ButtonBlock
          title="Go to Game"
          icon={'play'}
          action={() => {}}
          theme={theme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    gap: 8,
    width: '92%',
  },
});
