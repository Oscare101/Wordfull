import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import { IconName } from '../constants/interfaces/iconInterface';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';
import DeviceInfo from 'react-native-device-info';

type Props = StackScreenProps<RootStackParamList, 'SettingsScreen'>;

export interface SettingsButton {
  title: string;
  icon: IconName;
  onPress?: () => void;
}
export interface SettingsButtonBlock {
  title?: string;
  buttonsArray: SettingsButton[];
}

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();
  const appVersion = DeviceInfo.getVersion();

  const buttons: SettingsButtonBlock[] = [
    {
      title: text[language].InGameSettings,
      buttonsArray: [
        {
          title: text[language].Theme,
          icon: 'palette',
          onPress: useCallback(() => {
            navigation.navigate('ThemeScreen');
          }, [navigation]),
        },
        {
          title: text[language].Language,
          icon: 'language',
          onPress: useCallback(() => {
            navigation.navigate('LanguageScreen');
          }, [navigation]),
        },
        {
          title: text[language].WordPacks,
          icon: 'list',
          onPress: useCallback(() => {
            navigation.navigate('WordPacksScreen');
          }, [navigation]),
        },
      ],
    },
    {
      title: text[language].Other,
      buttonsArray: [
        {
          title: text[language].UserData,
          icon: 'profile',
          onPress: useCallback(() => {
            navigation.navigate('UserDataScreen');
          }, [navigation]),
        },
        {
          title: text[language].PrivacyPolicy,
          icon: 'document',
          onPress: useCallback(() => {
            Linking.openURL(
              'https://sites.google.com/view/wordfull-privacy-policy/%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BD%D0%B0-%D1%81%D1%82%D0%BE%D1%80%D1%96%D0%BD%D0%BA%D0%B0',
            );
          }, [navigation]),
        },
        {
          title: text[language].ReportsAndFeedback,
          icon: 'clipboard',
          onPress: useCallback(() => {
            Linking.openURL(
              'https://docs.google.com/forms/d/e/1FAIpQLSdPjkTHleCTbN1hwfAlOqDMav4ZKt8-ZaKnCTgnW3f3ROoU1Q/viewform?usp=publish-editor',
            );
          }, [navigation]),
        },
      ],
    },
  ];

  const renderSettingsBlockItem = useCallback(
    ({ item }: { item: SettingsButtonBlock }) => (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, color: colors[theme].main }}>
          {item.title}
        </Text>

        <FlatList
          style={{ gap: 8, marginTop: 8 }}
          data={item.buttonsArray}
          renderItem={({ item }: { item: SettingsButton }) => (
            <SettingsButtonItem
              title={item.title}
              icon={item.icon}
              onPress={item.onPress}
              theme={theme}
            />
          )}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    ),
    [theme],
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors[theme].bg,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].Settings}
        theme={theme}
      />
      <FlatList
        data={buttons}
        renderItem={renderSettingsBlockItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 8,
        }}
      />
      <Text style={{ color: colors[theme].main, fontSize: 14, marginTop: 16 }}>
        {text[language].AppVersion}: {appVersion}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 16,
  },
});
