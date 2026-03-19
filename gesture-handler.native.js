// Only load react-native-gesture-handler in actual React Native runtime (avoid Jest/Node ESM issues)
try {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    require('react-native-gesture-handler');
  }
} catch (_) {}
