import { useMemo } from 'react';
import { getMergedSystemWordPackByLanguageAndKeys } from './wordPack';
import { useSettings } from '../../context/SettingsContext';

export function useSelectedWordPack() {
  const { selectedSystemWordPackKeys, language } = useSettings();

  return useMemo(() => {
    return getMergedSystemWordPackByLanguageAndKeys(
      language,
      selectedSystemWordPackKeys,
    );
  }, [selectedSystemWordPackKeys, language]);
}
