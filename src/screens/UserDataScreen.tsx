import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import { useSettings } from '../context/SettingsContext';
import text from '../constants/languages/text';
import colors from '../constants/themes/colors';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageButtonItem from '../components/settings/LanguageButtonItem';
import { Language } from '../constants/interfaces/interface';
import ButtonBlock from '../components/global/ButtonBlock';

type Props = StackScreenProps<RootStackParamList, 'UserDataScreen'>;
const width = Dimensions.get('screen').width;

export default function UserDataScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme, setLanguage } = useSettings();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].bg, paddingTop: insets.top },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].UserData}
        theme={theme}
      />
      <View style={styles.block}>
        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].ExportDescription}
        </Text>
        <ButtonBlock
          title={text[language].Export}
          action={() => {}}
          theme={theme}
          icon="export"
          styles={{ justifyContent: 'center', marginBottom: 32 }}
        />
        <Text style={[styles.comment, { color: colors[theme].main }]}>
          {text[language].ImportDescription}
        </Text>
        <ButtonBlock
          title={text[language].Import}
          action={() => {}}
          theme={theme}
          icon="import"
          styles={{ justifyContent: 'center', marginBottom: 32 }}
        />
        <View
          style={[styles.dangerBlock, { borderColor: colors[theme].error }]}
        >
          <Text style={[styles.title, { color: colors[theme].error }]}>
            {text[language].DangerZone}
          </Text>
          <Text style={[styles.comment, { color: colors[theme].main }]}>
            {text[language].WipeDataDescription}
          </Text>
          <ButtonBlock
            title={text[language].WipeData}
            action={() => {}}
            theme={theme}
            icon="trash"
            styles={{
              justifyContent: 'center',
              width: '100%',
              borderRadius: 8,
              backgroundColor: colors[theme].error,
            }}
          />
        </View>
      </View>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    width: '92%',
    marginBottom: 16,
  },
  dangerBlock: {
    width: '92%',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
  },
});
