import * as Linking from 'expo-linking';
import { useEffect } from 'react';

export function useDeepLinkDebug() {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link capturado =>', url);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
