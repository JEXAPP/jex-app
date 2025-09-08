import NetInfo from "@react-native-community/netinfo";

export async function checkInternet(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && state.isInternetReachable);
  } catch (error) {
    console.error("Error verificando conexión", error);
    return false;
  }
}