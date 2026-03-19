import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const screenOption = {
  headerShown: false,
  headerLeft: () => null,
  animationEnabled: true,
  gestureDirection: 'horizontal' as 'horizontal' | 'vertical',
  gestureEnabled: true,
  // cardStyle: { backgroundColor: colors['black-900'] },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const Stack = createStackNavigator<RootStackParamList>();

function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        gestureEnabled: true, // Enables swipe gesture
        headerShown: false,
        // cardStyle: { backgroundColor: colors['black-900'] },
        // animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        options={screenOption}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="SettingsScreen"
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigation() {
  return <Navigation />;
}
