import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootStackParamList } from '../navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import SimpleHeader from '../components/global/SimpleHeader';
import { useSettings } from '../context/SettingsContext';
import colors from '../constants/themes/colors';
import text from '../constants/languages/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chapter1UK from '../assets/chapters/Chapter1UK';

type Props = StackScreenProps<RootStackParamList, 'ChapterScreen'>;

export default function ChapterScreen({ navigation, route }: Props) {
  const { chapterId } = route.params;
  const { theme, language } = useSettings();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors[theme].bg },
      ]}
    >
      <SimpleHeader
        onBack={() => navigation.goBack()}
        title={''}
        theme={theme}
      />
      <ScrollView>
        {chapterId === 'Chapter1UK' && (
          <Chapter1UK theme={theme} language={'en'} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
