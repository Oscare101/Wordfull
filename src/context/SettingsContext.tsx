import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Language } from '../constants/interfaces/interface';
import {
  settingsRepository,
  AppSettings,
} from '../db/repositories/settingsRepository';
import { ThemeType } from '../constants/themes/themeType';
import { getDefaultWordPackIdByLanguage } from '../constants/wordPacks/defaultWordPack';
import { StatusBar } from 'react-native';
import colors from '../constants/themes/colors';

interface SettingsContextValue {
  settings: AppSettings | null;
  language: Language;
  theme: ThemeType;
  selectedWordPackId: string;
  isLoading: boolean;

  setLanguage: (language: Language) => Promise<void>;
  setTheme: (theme: ThemeType) => Promise<void>;
  setSelectedWordPackId: (wordPackId: string) => Promise<void>;
  reloadSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedSettings = await settingsRepository.get();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to load settings from DB:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const setLanguage = useCallback(async (language: Language) => {
    try {
      const defaultWordPackId = getDefaultWordPackIdByLanguage(language);

      await settingsRepository.updateLanguage(language);
      await settingsRepository.updateSelectedWordPack(defaultWordPackId);

      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          language,
          selectedWordPackId: defaultWordPackId,
        };
      });
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  }, []);

  const setTheme = useCallback(async (theme: ThemeType) => {
    try {
      await settingsRepository.updateTheme(theme);

      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          theme,
        };
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  }, []);

  const setSelectedWordPackId = useCallback(async (wordPackId: string) => {
    try {
      await settingsRepository.updateSelectedWordPack(wordPackId);

      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          selectedWordPackId: wordPackId,
        };
      });
    } catch (error) {
      console.error('Failed to update selected word pack:', error);
    }
  }, []);

  const value = useMemo<SettingsContextValue>(() => {
    return {
      settings,
      language: settings?.language ?? 'en',
      theme: settings?.theme ?? 'olive',
      selectedWordPackId:
        settings?.selectedWordPackId ?? getDefaultWordPackIdByLanguage('en'),
      isLoading,

      setLanguage,
      setTheme,
      setSelectedWordPackId,
      reloadSettings: loadSettings,
    };
  }, [
    settings,
    isLoading,
    setLanguage,
    setTheme,
    setSelectedWordPackId,
    loadSettings,
  ]);

  return (
    <SettingsContext.Provider value={value}>
      <StatusBar
        barStyle={colors[value.theme].barStyle}
        backgroundColor={colors[value.theme].bg}
      />
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }

  return context;
}
