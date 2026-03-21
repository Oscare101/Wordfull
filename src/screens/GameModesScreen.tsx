import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import ButtonBlock from '../components/global/ButtonBlock';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExplanationModal from '../components/global/ExplanationModal';

type Props = StackScreenProps<RootStackParamList, 'GameModesScreen'>;

export default function GameModesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();

  const [explanationModal, setExplanationModal] = useState<boolean>(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].NewGame}
        theme={theme}
        rightIcon="info"
        rightIconAction={() => {
          setExplanationModal(true);
        }}
      />
      <View style={[styles.block, { marginBottom: insets.bottom + 16 }]}>
        <ButtonBlock
          title={text[language].Easy}
          icon={'speedLow'}
          action={() => {
            navigation.navigate('PreGameScreen', { mode: 'easy' });
          }}
          theme={theme}
          titleStyles={{ fontSize: 26 }}
          iconSize={32}
          styles={{ justifyContent: 'center', height: 70 }}
        />
        <Text
          style={{ fontSize: 14, marginBottom: 16, color: colors[theme].main }}
        >
          {text[language].easyDescription}
        </Text>
        <ButtonBlock
          title={text[language].Hard}
          icon={'speedHigh'}
          action={() => {
            navigation.navigate('PreGameScreen', { mode: 'hard' });
          }}
          theme={theme}
          titleStyles={{ fontSize: 26 }}
          iconSize={32}
          styles={{ justifyContent: 'center', height: 70 }}
        />
        <Text
          style={{ fontSize: 14, marginBottom: 16, color: colors[theme].main }}
        >
          {text[language].hardDescription}
        </Text>
        <ButtonBlock
          title={text[language].Stamina}
          icon={'fire'}
          action={() => {
            navigation.navigate('PreGameScreen', { mode: 'stamina' });
          }}
          theme={theme}
          titleStyles={{ fontSize: 26 }}
          iconSize={32}
          styles={{ justifyContent: 'center', height: 70 }}
        />
        <Text style={{ fontSize: 14, color: colors[theme].main }}>
          {text[language].staminaDescription}
        </Text>
      </View>
      <ExplanationModal
        theme={theme}
        language={language}
        type="gameModes"
        visible={explanationModal}
        onClose={() => setExplanationModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  block: {
    gap: 8,
    width: '92%',
    flex: 1,
    justifyContent: 'center',
  },
});
