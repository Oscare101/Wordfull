import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import ButtonBlock from '../global/ButtonBlock';
import colors from '../../constants/themes/colors';

interface CheckBlockProps {
  theme: ThemeType;
  language: Language;
  finishAvailable: boolean;
  onCheck: () => void;
  buttonTitle: string;
  comment: string;
}

function CheckBlock({
  theme,
  language,
  finishAvailable,
  onCheck,
  buttonTitle,
  comment,
}: CheckBlockProps) {
  return (
    <View style={styles.block}>
      <ButtonBlock
        title={buttonTitle}
        theme={theme}
        styles={{ borderRadius: 30, width: '60%' }}
        action={onCheck}
        disabled={!finishAvailable}
      />
      <Text
        style={[
          styles.comment,
          {
            color: colors[theme].comment,
            marginTop: 16,
          },
        ]}
      >
        {comment}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  comment: {
    fontSize: 16,
    width: '70%',
    textAlign: 'center',
  },
});

export default React.memo(CheckBlock);
