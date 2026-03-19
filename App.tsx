import './gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/navigation/MainNavigation';
import { initDatabase } from './src/db/initDatabase';
import { SettingsProvider } from './src/context/SettingsContext';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error('Database init error:', error);
      }
    };

    bootstrap();
  }, []);

  if (!isDbReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SettingsProvider>
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
        </SettingsProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
