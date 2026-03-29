import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  CaptureProtection,
  useCaptureProtection,
} from 'react-native-capture-protection';
import Toast from 'react-native-toast-message';
import text from '../constants/languages/text';
import { useSettings } from '../context/SettingsContext';

export default function useCaptureProtectionScreen(isActive: boolean) {
  const isFocused = useIsFocused();
  const { language } = useSettings();

  useEffect(() => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      return;
    }

    const shouldProtect = isFocused && isActive;

    const run = async () => {
      if (shouldProtect) {
        await CaptureProtection.prevent({
          screenshot: true,
          record: true,
          appSwitcher: true,
        });
      } else {
        await CaptureProtection.allow({
          screenshot: true,
          record: true,
          appSwitcher: true,
        });
      }
    };

    run();

    return () => {
      CaptureProtection.allow({
        screenshot: true,
        record: true,
        appSwitcher: true,
      }).catch(() => {});
    };
  }, [isFocused, isActive]);
}
