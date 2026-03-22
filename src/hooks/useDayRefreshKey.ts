import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

function getDayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

export default function useDayRefreshKey() {
  const [dayKey, setDayKey] = useState(getDayKey());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        setDayKey(getDayKey());
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return dayKey;
}
