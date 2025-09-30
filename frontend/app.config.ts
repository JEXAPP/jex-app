// app.config.ts
import 'dotenv/config';
import type { ExpoConfig } from '@expo/config';

const stripSuffix = (cid: string) => cid.replace(/\.apps\.googleusercontent\.com$/i, '');

export default (): ExpoConfig => {
  const ANDROID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID!;
  const IOS     = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS!;

  const ANDROID_SCHEME = `com.googleusercontent.apps.${stripSuffix(ANDROID)}`;
  const IOS_SCHEME     = `com.googleusercontent.apps.${stripSuffix(IOS)}`;

  return {
    name: "Jex",
    slug: "jex",
    version: "1.0.0",
    orientation: "portrait",
    scheme: ["jex", IOS_SCHEME], // iOS registra también el scheme de Google
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    owner: "jex-app",
    icon: "./assets/images/jex/Jex-Logo.png",
    jsEngine: "hermes",
    splash: {
      image: "./assets/images/jex/Jex-Logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.jexapp",
      googleServicesFile: "./google-services.json",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/jex/Jex-Logo.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      splash: {
        image: "./assets/images/jex/Jex-Logo.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      /** Handler del deep link nativo de Google */
      intentFilters: [
        {
          action: "VIEW",
          category: ["BROWSABLE", "DEFAULT"],
          data: [
            { scheme: ANDROID_SCHEME, host: "oauthredirect" },
            { scheme: ANDROID_SCHEME, host: "oauthredirect", path: "/" },
            { scheme: ANDROID_SCHEME, host: "oauthredirect", pathPrefix: "/" }
          ]
        },
        /** Tu propio scheme (por si lo usás) */
        {
          action: "VIEW",
          category: ["BROWSABLE", "DEFAULT"],
          data: [{ scheme: "jex" }]
        }
      ]
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.jexapp",
      splash: {
        image: "./assets/images/jex/Jex-Logo.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      }
    },
    web: { bundler: "metro", output: "static" },
    plugins: [
      "expo-router",
      ["expo-splash-screen", {
        image: "./assets/images/jex/Jex-Logo.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      }],
      "expo-web-browser",
      "expo-secure-store",
      ["expo-notifications", { mode: "production" }],
      ["expo-camera", {
        cameraPermission: "Usamos la cámara para la verificación de identidad.",
        microphonePermission: "Usamos el micrófono si el proveedor lo requiere durante la verificación."
      }]
      // Importante: **NO** pongas "expo-auth-session" en plugins
    ],
    experiments: { typedRoutes: true },
    extra: {
      router: {},
      eas: { projectId: "2664b647-4200-4d00-b8bc-e47ddb4cda05" }
    }
  };
};
