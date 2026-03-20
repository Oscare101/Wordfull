import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { History } from '../constants/interfaces/interface';
import { historyRepository } from '../db/repositories/historyRepository';

interface HistoryContextValue {
  history: History[];
  isLoading: boolean;
  reloadHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined,
);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedHistory = await historyRepository.getAll();
      setHistory(loadedHistory);
    } catch (error) {
      console.error('Failed to load history from DB:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const value = useMemo<HistoryContextValue>(() => {
    return {
      history,
      isLoading,
      reloadHistory: loadHistory,
    };
  }, [history, isLoading, loadHistory]);

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error('useHistory must be used inside HistoryProvider');
  }

  return context;
}
