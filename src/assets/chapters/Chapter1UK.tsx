import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import colors from '../../constants/themes/colors';
import Icon from '../icon';
import text from '../../constants/languages/text';
import { Language } from '../../constants/interfaces/interface';
import ChapterSmallCard from '../../components/chapter/ChapterSmallCard';

export default function Chapter1UK({
  theme,
  language,
}: {
  theme: ThemeType;
  language: Language;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 16,
        gap: 5,
      }}
    >
      <Text style={{ fontSize: 18, color: colors[theme].main }}>
        First steps in Wordfull
      </Text>
      <Text style={{ color: colors[theme].main, fontSize: 14 }}>
        The main idea of Wordfull is to help you memorize words in a fun and
        engaging way. You can choose from different game modes, each with its
        own unique mechanics and challenges. The more you play, the more words
        you will learn and remember!
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <ChapterSmallCard
          icon="speedLow"
          title={text[language].Easy}
          theme={theme}
        />
        <ChapterSmallCard
          icon="speedHigh"
          title={text[language].Hard}
          theme={theme}
        />
        <ChapterSmallCard
          icon="fire"
          title={text[language].Stamina}
          theme={theme}
        />
      </View>
      <Text style={{ color: colors[theme].main, fontSize: 14 }}>
        {text[language].GameModeExplanation}
      </Text>
      <Text style={{ color: colors[theme].main, fontSize: 14 }}>
        To get started, simply select a game mode and start playing. You can
        track your progress and see how many words you have learned in the
        statistics section. Remember, consistency is key to effective
        memorization, so try to play a little bit every day!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
