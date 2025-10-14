import { useEffect } from 'react';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

export default function OAuthRedirect() {
  useEffect(() => {
    // Completa la sesión (por si el root aún no lo hizo) y volvé a donde estabas
    WebBrowser.maybeCompleteAuthSession();
    // Opcional: podés ir a una pantalla concreta si querés:
    // router.replace('/'); 
    // Si preferís simplemente cerrar y volver atrás:
    setTimeout(() => {
      if (router.canGoBack()) router.back();
      else router.replace('/');
    }, 0);
  }, []);

  return null; // pantalla invisible
}
