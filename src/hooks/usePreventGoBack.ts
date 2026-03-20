import { useEffect } from 'react';
import {
  EventArg,
  NavigationAction,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';

type BeforeRemoveEvent = EventArg<
  'beforeRemove',
  true,
  {
    action: NavigationAction;
  }
>;

interface UsePreventGoBackParams {
  enabled?: boolean;
  onBlockedGoBack: (event: BeforeRemoveEvent) => void;
}

export function usePreventGoBack({
  enabled = true,
  onBlockedGoBack,
}: UsePreventGoBackParams) {
  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const unsubscribe = navigation.addListener('beforeRemove', event => {
      event.preventDefault();
      onBlockedGoBack(event);
    });

    return unsubscribe;
  }, [enabled, navigation, onBlockedGoBack]);
}
