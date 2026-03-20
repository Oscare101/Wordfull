import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Statistics } from '../constants/interfaces/interface';
import { statisticsRepository } from '../db/repositories/statisticsRepository';

interface StatisticsContextValue {
  statistics: Statistics | null;
  isLoading: boolean;
  reloadStatistics: () => Promise<void>;
}

const StatisticsContext = createContext<StatisticsContextValue | undefined>(
  undefined,
);

export function StatisticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedStatistics = await statisticsRepository.get();
      setStatistics(loadedStatistics);
    } catch (error) {
      console.error('Failed to load statistics from DB:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const value = useMemo<StatisticsContextValue>(() => {
    return {
      statistics,
      isLoading,
      reloadStatistics: loadStatistics,
    };
  }, [statistics, isLoading, loadStatistics]);

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = useContext(StatisticsContext);

  if (!context) {
    throw new Error('useStatistics must be used inside StatisticsProvider');
  }

  return context;
}
