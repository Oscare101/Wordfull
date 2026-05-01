import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { History, Language } from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';
import text from '../../constants/languages/text';
import colors from '../../constants/themes/colors';
import HistoryActivityChart from '../charts/HistoryActivityChart';
import { usePeriodStats } from '../../hooks/usePeriodStats';
import Icon from '../../assets/icon';
import { NumberFormat, WordsTitleFromAmount } from '../../functions/functions';

function HistoryChartBlock({
  history,
  language,
  theme,
  type,
  height = 150,
  onOpen,
  interactive,
}: {
  history: History[];
  language: Language;
  theme: ThemeType;
  type: 'month' | 'week';
  height?: number;
  onOpen?: () => void;
  interactive?: boolean;
}) {
  const { wordsLearnedToday, wordsLearnedWeek, wordsLearnedMonth } =
    usePeriodStats();
  const ignoreNextOpenRef = useRef(false);
  const clearIgnoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const wordsAmount = type === 'month' ? wordsLearnedMonth : wordsLearnedWeek;

  const wordsTitle = WordsTitleFromAmount(wordsAmount, language);

  const handleChartInteractionStateChange = useCallback(
    (isInteracting: boolean) => {
      if (type !== 'month' || !onOpen) {
        return;
      }

      if (clearIgnoreTimeoutRef.current) {
        clearTimeout(clearIgnoreTimeoutRef.current);
        clearIgnoreTimeoutRef.current = null;
      }

      if (isInteracting) {
        ignoreNextOpenRef.current = true;
        return;
      }

      clearIgnoreTimeoutRef.current = setTimeout(() => {
        ignoreNextOpenRef.current = false;
      }, 150);
    },
    [onOpen, type],
  );

  const handleOpen = useCallback(() => {
    if (!onOpen) {
      return;
    }

    if (ignoreNextOpenRef.current) {
      ignoreNextOpenRef.current = false;
      return;
    }

    onOpen();
  }, [onOpen]);

  useEffect(() => {
    return () => {
      if (clearIgnoreTimeoutRef.current) {
        clearTimeout(clearIgnoreTimeoutRef.current);
      }
    };
  }, []);

  const container = (
    <View
      style={[
        styles.container,
        { borderColor: colors[theme].border, height: height },
      ]}
    >
      {onOpen && (
        <View style={{ position: 'absolute', top: 16, right: 16 }}>
          <Icon name="open" size={16} color={colors[theme].main} />
        </View>
      )}
      <Text style={{ fontSize: 14, color: colors[theme].main }}>
        {text[language].TotalWordsMemorized}{' '}
        {type === 'month'
          ? text[language].inPast30Days
          : text[language].inPastWeek}
      </Text>
      <Text
        style={{ fontSize: 16, color: colors[theme].main, fontWeight: 'bold' }}
      >
        {NumberFormat(wordsAmount, language)} {wordsTitle}
      </Text>
      <HistoryActivityChart
        history={history}
        height={height - 65}
        days={type === 'month' ? 30 : 7}
        onInteractionStateChange={handleChartInteractionStateChange}
        interactive={interactive}
      />
    </View>
  );

  if (onOpen) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={handleOpen}>
        {container}
      </TouchableOpacity>
    );
  }

  return container;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
});

export default React.memo(HistoryChartBlock);
