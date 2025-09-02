import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/button/Button"; // tu botón reutilizable

export default function NoWifiScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/jex/Jex-Sin-Wifi.png")} // 👈 tu imagen
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Sin conexión</Text>
        <Text style={styles.subtitle}>
          Parece que no tenés internet en este momento.{"\n"}Verificá tu conexión e intentá de nuevo.
        </Text>

        <Button
          texto="Reintentar"
          onPress={onRetry}
          styles={{
            boton: styles.retryButton,
            texto: styles.retryText,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // limpio
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
    color: "#4B0082", // tu violeta
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
    backgroundColor: "#4B0082",
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
