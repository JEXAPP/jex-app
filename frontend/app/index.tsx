import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { Button } from "@/components/button/Button";
import { Colors } from "@/themes/colors";

export default function NoWifiScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRetry = async () => {
  if (loading) return;
  setLoading(true);

  try {
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      setTimeout(() => {
        router.push("/");
      }, 1000); 
    } else {
      setLoading(false);
    }
  } catch (err) {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/jex/Jex-Sin-Wifi.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Sin conexión</Text>
        <Text style={styles.subtitle}>
          Parece que no tenés internet en este momento.{"\n"}
          Verificá tu conexión e intentá de nuevo.
        </Text>

        {loading ? (
          <View style={styles.retryButton}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <Button
            texto="Reintentar"
            onPress={handleRetry}
            styles={{
              boton: styles.retryButton,
              texto: styles.retryText,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.violet4,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: Colors.violet4,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
