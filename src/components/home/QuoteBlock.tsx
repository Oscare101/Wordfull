import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Language } from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';
import text from '../../constants/languages/text';
import colors from '../../constants/themes/colors';

export default function QuoteBlock({
  theme,
  language,
}: {
  theme: ThemeType;
  language: Language;
}) {
  return (
    <View style={styles.quoteBlock}>
      <Text style={[styles.quote, { color: colors[theme].main }]}>
        {text[language].WordfullTitleDescription}
      </Text>
      {/* <Text style={[styles.author, { color: colors[theme].main }]}>
        {text[language].quote1Author}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  quoteBlock: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '92%',
    gap: 8,
    alignSelf: 'center',
  },
  quote: {
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
    fontStyle: 'italic',
  },
  author: {
    fontSize: 16,
    textAlign: 'right',
    fontStyle: 'italic',
    fontWeight: 300,
  },
});
