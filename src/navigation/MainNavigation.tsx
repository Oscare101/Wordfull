import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LanguageScreen from '../screens/LanguageScreen';
import ThemeScreen from '../screens/ThemeScreen';
import GameModesScreen from '../screens/GameModesScreen';
import PreGameScreen from '../screens/PreGameScreen';
import GameScreen from '../screens/GameScreen';
import CheckScreen from '../screens/CheckScreen';
import GameResultsScreen from '../screens/GameResultsScreen';
import UserDataScreen from '../screens/UserDataScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import WordsAmountScreen from '../screens/WordsAmountScreen';
import AccuracyScreen from '../screens/AccuracyScreen';
import PersonalBestsScreen from '../screens/PersonalBestsScreen';

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
      <Stack.Screen
        options={screenOption}
        name="LanguageScreen"
        component={LanguageScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="ThemeScreen"
        component={ThemeScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="UserDataScreen"
        component={UserDataScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="GameModesScreen"
        component={GameModesScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="PreGameScreen"
        component={PreGameScreen}
      />
      <Stack.Screen
        options={{
          ...screenOption,
          gestureEnabled: false, // Disables swipe gesture on GameScreen
        }}
        name="GameScreen"
        component={GameScreen}
      />
      <Stack.Screen
        options={{
          ...screenOption,
          gestureEnabled: false, // Disables swipe gesture on CheckScreen
        }}
        name="CheckScreen"
        component={CheckScreen}
      />
      <Stack.Screen
        options={{
          ...screenOption,
          gestureEnabled: false, // Disables swipe gesture on GameResultsScreen
        }}
        name="GameResultsScreen"
        component={GameResultsScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="StatisticsScreen"
        component={StatisticsScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="WordsAmountScreen"
        component={WordsAmountScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="PersonalBestsScreen"
        component={PersonalBestsScreen}
      />
      <Stack.Screen
        options={screenOption}
        name="AccuracyScreen"
        component={AccuracyScreen}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigation() {
  return <Navigation />;
}
