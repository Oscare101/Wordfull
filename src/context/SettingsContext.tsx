import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_SYSTEM_WORD_PACK_KEYS,
  Language,
  SystemWordPackKey,
} from '../constants/interfaces/interface';
import {
  settingsRepository,
  AppSettings,
} from '../db/repositories/settingsRepository';
import { ThemeType } from '../constants/themes/themeType';
import { StatusBar } from 'react-native';
import colors from '../constants/themes/colors';
import { updateHistoryWidgetTheme } from '../utils/updateHistoryWidgetTheme';

interface SettingsContextValue {
  settings: AppSettings | null;
  language: Language;
  theme: ThemeType;
  selectedSystemWordPackKeys: SystemWordPackKey[];
  isLoading: boolean;

  setLanguage: (language: Language) => Promise<void>;
  setTheme: (theme: ThemeType) => Promise<void>;
  setSelectedSystemWordPackKeys: (keys: SystemWordPackKey[]) => Promise<void>;
  toggleSystemWordPackKey: (key: SystemWordPackKey) => Promise<void>;
  reloadSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // for widgets
  useEffect(() => {
    if (!settings?.theme) return;
    updateHistoryWidgetTheme(settings.theme);
  }, [settings?.theme]);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedSettings = await settingsRepository.get();
      setSettings(loadedSettings);
    } catch (error) {
      if (__DEV__) console.error('Failed to load settings from DB:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const setLanguage = useCallback(async (language: Language) => {
    try {
      await settingsRepository.updateLanguage(language);

      setSettings(prev => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          language,
        };
      });
    } catch (error) {
      if (__DEV__) console.error('Failed to update language:', error);
    }
  }, []);

  const setTheme = useCallback(async (theme: ThemeType) => {
    try {
      await settingsRepository.updateTheme(theme);
      // for widgets
      await updateHistoryWidgetTheme(theme);

      setSettings(prev => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          theme,
        };
      });
    } catch (error) {
      if (__DEV__) console.error('Failed to update theme:', error);
    }
  }, []);

  const setSelectedSystemWordPackKeys = useCallback(
    async (keys: SystemWordPackKey[]) => {
      try {
        const nextKeys = Array.from(new Set(keys)).filter(
          Boolean,
        ) as SystemWordPackKey[];

        const safeKeys =
          nextKeys.length > 0 ? nextKeys : DEFAULT_SYSTEM_WORD_PACK_KEYS;

        await settingsRepository.updateSelectedSystemWordPackKeys(safeKeys);

        setSettings(prev => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            selectedSystemWordPackKeys: safeKeys,
          };
        });
      } catch (error) {
        if (__DEV__)
          console.error(
            'Failed to update selected system word pack keys:',
            error,
          );
      }
    },
    [],
  );

  const toggleSystemWordPackKey = useCallback(
    async (key: SystemWordPackKey) => {
      const currentKeys =
        settings?.selectedSystemWordPackKeys ?? DEFAULT_SYSTEM_WORD_PACK_KEYS;

      const hasKey = currentKeys.includes(key);

      const nextKeys = hasKey
        ? currentKeys.filter(currentKey => currentKey !== key)
        : [...currentKeys, key];

      // Do not allow empty selection
      if (nextKeys.length === 0) {
        return;
      }

      await setSelectedSystemWordPackKeys(nextKeys);
    },
    [settings?.selectedSystemWordPackKeys, setSelectedSystemWordPackKeys],
  );

  const value = useMemo<SettingsContextValue>(() => {
    return {
      settings,
      language: settings?.language ?? 'en',
      theme: settings?.theme ?? 'olive',
      selectedSystemWordPackKeys:
        settings?.selectedSystemWordPackKeys ?? DEFAULT_SYSTEM_WORD_PACK_KEYS,
      isLoading,

      setLanguage,
      setTheme,
      setSelectedSystemWordPackKeys,
      toggleSystemWordPackKey,
      reloadSettings: loadSettings,
    };
  }, [
    settings,
    isLoading,
    setLanguage,
    setTheme,
    setSelectedSystemWordPackKeys,
    toggleSystemWordPackKey,
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
