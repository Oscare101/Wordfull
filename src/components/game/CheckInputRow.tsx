import React, { useCallback } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../../constants/themes/colors';
import { ThemeType } from '../../constants/themes/themeType';

type Props = {
  index: number;
  value: string;
  totalCount: number;
  theme: ThemeType;
  onChangeValue: (index: number, value: string) => void;
  onSubmitIndex: (index: number) => void;
  registerInputRef: (index: number, ref: TextInput | null) => void;
};

function CheckInputRow({
  index,
  value,
  totalCount,
  theme,
  onChangeValue,
  onSubmitIndex,
  registerInputRef,
}: Props) {
  const onChangeText = useCallback(
    (nextValue: string) => {
      onChangeValue(index, nextValue);
    },
    [index, onChangeValue],
  );

  const onSubmitEditing = useCallback(() => {
    onSubmitIndex(index);
  }, [index, onSubmitIndex]);

  const onRef = useCallback(
    (ref: TextInput | null) => {
      registerInputRef(index, ref);
    },
    [index, registerInputRef],
  );

  const isLast = index === totalCount - 1;

  return (
    <View style={styles.row}>
      <Text style={[styles.indexText, { color: colors[theme].main }]}>
        {index + 1}
      </Text>

      <TextInput
        ref={onRef}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            color: colors[theme].main,
            borderColor: colors[theme].main,
          },
        ]}
        cursorColor={colors[theme].mainDim}
        selectionColor={colors[theme].mainDim}
        autoCapitalize="words"
        returnKeyType={isLast ? 'done' : 'next'}
        blurOnSubmit={isLast}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

function areEqual(prev: Props, next: Props) {
  return (
    prev.index === next.index &&
    prev.value === next.value &&
    prev.totalCount === next.totalCount &&
    prev.theme === next.theme
  );
}

export default React.memo(CheckInputRow, areEqual);

const styles = StyleSheet.create({
  row: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    alignSelf: 'center',
  },
  indexText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    fontSize: 24,
    padding: 0,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
