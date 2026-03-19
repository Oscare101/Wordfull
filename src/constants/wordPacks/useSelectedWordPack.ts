import { useMemo } from 'react';
import {
  getDefaultWordPackByLanguage,
  getSystemWordPackById,
} from './wordPack';
import { useSettings } from '../../context/SettingsContext';

// const wordPack = useSelectedWordPack();

export function useSelectedWordPack() {
  const { selectedWordPackId, language } = useSettings();

  return useMemo(() => {
    return (
      getSystemWordPackById(selectedWordPackId) ??
      getDefaultWordPackByLanguage(language)
    );
  }, [selectedWordPackId, language]);
}
