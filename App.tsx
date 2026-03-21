import './gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/navigation/MainNavigation';
import { initDatabase } from './src/db/initDatabase';
import { SettingsProvider } from './src/context/SettingsContext';
import Toast from 'react-native-toast-message';
import { Text, View } from 'react-native';
import { StatisticsProvider } from './src/context/StatisticsContext';
import { HistoryProvider } from './src/context/HistoryContext';

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

  const toastConfig = {
    ToastMessage: ({ props }: any) => (
      <View
        style={{
          width: '92%',
          backgroundColor: '#000',
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 8,
          top: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#fff',
            textAlign: 'left',
          }}
        >
          {props.title}
        </Text>
      </View>
    ),
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SettingsProvider>
          <HistoryProvider>
            <StatisticsProvider>
              <NavigationContainer>
                <MainNavigation />
              </NavigationContainer>
            </StatisticsProvider>
          </HistoryProvider>
        </SettingsProvider>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
