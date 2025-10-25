import 'dotenv/config';
import type { ExpoConfig } from '@expo/config';

export default (): ExpoConfig => ({
  name: "Jex",
  slug: "jex",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "jex",
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
      backgroundColor: "#ffffff",
    },
    permissions: [
     "INTERNET",
     "CAMERA",
     "RECORD_AUDIO",
     "READ_MEDIA_IMAGES",
     "POST_NOTIFICATIONS"
   ],
    config: {
      googleMaps: { apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY }
    }
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.jexapp",
    splash: {
      image: "./assets/images/jex/Jex-Logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY 
    },
    infoPlist: {
      NSCameraUsageDescription: "Necesitamos la cámara para escanear el QR y tomar fotos.",
      NSMicrophoneUsageDescription: "Necesitamos el micrófono para grabar mensajes de voz.",
      NSPhotoLibraryUsageDescription: "Necesitamos acceder a tus fotos para adjuntar imágenes.",
      NSPhotoLibraryAddUsageDescription: "Necesitamos guardar imágenes/audios si elegís descargarlos."
    }
  },
  web: {
    bundler: "metro",
    output: "static"
  },
  plugins: [
    "expo-router",
    "expo-video",
    ["expo-splash-screen", {
      image: "./assets/images/jex/Jex-Logo.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    }],
    "expo-web-browser",
    "@react-native-google-signin/google-signin",
    "expo-secure-store",
    ["expo-notifications", { mode: "production" }],
    ["expo-camera", {
      cameraPermission: "Usamos la cámara para la verificación de identidad.",
      microphonePermission: "Usamos el micrófono si el proveedor lo requiere durante la verificación."
    }]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {},
    eas: { projectId: "2664b647-4200-4d00-b8bc-e47ddb4cda05" }
  }
});
