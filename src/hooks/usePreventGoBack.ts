import { useEffect } from 'react';
import {
  EventArg,
  NavigationAction,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';

export type BeforeRemoveEvent = EventArg<
  'beforeRemove',
  true,
  {
    action: NavigationAction;
  }
>;

interface UsePreventGoBackParams {
  enabled?: boolean;
  onBlockedGoBack: (event: BeforeRemoveEvent) => void;
  shouldPrevent?: (event: BeforeRemoveEvent) => boolean;
}

export function usePreventGoBack({
  enabled = true,
  onBlockedGoBack,
  shouldPrevent,
}: UsePreventGoBackParams) {
  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (shouldPrevent && !shouldPrevent(event)) {
        return;
      }

      event.preventDefault();
      onBlockedGoBack(event);
    });

    return unsubscribe;
  }, [enabled, navigation, onBlockedGoBack, shouldPrevent]);
}
