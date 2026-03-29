import {
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language } from '../constants/interfaces/interface';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import { IconName } from '../constants/interfaces/iconInterface';
import SettingsButtonItem from '../components/settings/SettingsButtonItem';
import { getSystemWordPackById } from '../constants/wordPacks/wordPack';
import LearningChapterItem from '../components/learning/LearningChapterItem';

type Props = StackScreenProps<RootStackParamList, 'LearningScreen'>;
const width = Dimensions.get('screen').width;

export default function LearningScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, theme } = useSettings();

  const chapters: {
    title: string;
    description: string;
    icon: IconName;
    onPress: () => void;
  }[] = [
    {
      title: '1. First steps in Wordfull',
      description:
        'Learn how to navigate the app and start your memorization journey',
      icon: 'speedLow',
      onPress: () => {
        navigation.navigate('ChapterScreen', { chapterId: 'Chapter1UK' });
      },
    },
    {
      title: '2. What is a game mode?',
      description:
        'Learn how to select the best game mode for your learning style',
      icon: 'speedHigh',
      onPress: () => {
        navigation.navigate('ChapterScreen', { chapterId: 'Chapter1UK' });
      },
    },
  ];

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: {
        title: string;
        description: string;
        icon: IconName;
        onPress: () => void;
      };
      index: number;
    }) => {
      return (
        <LearningChapterItem
          title={item.title}
          index={index}
          icon={item.icon}
          description={item.description}
          theme={theme}
          language={language}
          onPress={item.onPress}
          width={width}
        />
      );
    },
    [language, theme],
  );

  const header = (
    <View style={[styles.headerBlock, { borderColor: colors[theme].border }]}>
      <Text style={{ fontSize: 16, color: colors[theme].main }}>
        {text[language].LearningScreenDescription}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors[theme].bg },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={text[language].Learning}
        theme={theme}
      />
      <View style={styles.block}>
        <FlatList
          data={chapters}
          renderItem={renderItem}
          ListHeaderComponent={header}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ gap: 4, paddingBottom: 4 }}
        />
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
  header: {
    fontSize: 16,
  },
  headerBlock: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 16,
    borderRadius: 16,
  },
  block: { gap: 8, width: '92%', justifyContent: 'center' },
});
