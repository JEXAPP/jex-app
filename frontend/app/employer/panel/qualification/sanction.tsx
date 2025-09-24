// screens/employer/panel/qualification/sanction.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useSanction } from "@/hooks/employer/panel/qualification/useSanction";
import { sanctionStyles as styles } from "@/styles/app/employer/panel/qualification/sanctionStyles";
import React from "react";
import { Colors } from "@/themes/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SanctionScreen() {
  const router = useRouter();
  const { workerId } = useLocalSearchParams<{ workerId: string }>();

  const {
    worker,
    currentOptions,
    selectedSanction,
    selectOption,
    registerSanction,
    goBackOption,
    canGoBack,
  } = useSanction(workerId);

  if (!worker) {
    return (
      <View style={styles.container}>
        <Text>Empleado no encontrado</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#ffffff", "#f9f9fb"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sanciones</Text>
          <Text style={styles.subtitle}>
            Seleccioná la falta que cometió el trabajador
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card trabajador */}
          <View style={styles.workerCard}>
            <Image source={{ uri: worker.image }} style={styles.workerImage} />
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerRole}>Mozo - Fiesta Nacional</Text>
          </View>

          {/* Botón volver */}
          {canGoBack && (
            <TouchableOpacity
              style={styles.goBackContainer}
              onPress={goBackOption}
            >
              <Ionicons name="arrow-back" size={18} color={Colors.violet4} />
              <Text style={styles.goBack}>Volver</Text>
            </TouchableOpacity>
          )}

          {/* Opciones */}
          <View style={styles.optionsContainer}>
            {currentOptions.map((option: any) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  selectedSanction?.value === option.value &&
                    styles.optionButtonActive,
                ]}
                onPress={() => selectOption(option)}
              >
                <Ionicons
                  name={option.icon || "alert-circle"}
                  size={22}
                  color={
                    selectedSanction?.value === option.value
                      ? "#fff"
                      : Colors.violet4
                  }
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedSanction?.value === option.value &&
                      styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>

                {selectedSanction?.value === option.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#fff"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {!selectedSanction && (
            <Text style={styles.helperText}>
              Selecciona una opción para habilitar el registro
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.registerButton,
              !selectedSanction && styles.registerButtonDisabled,
            ]}
            disabled={!selectedSanction}
            onPress={() => {
              registerSanction();
              router.push("/employer/panel/qualification");
            }}
          >
            <Text
              style={[
                styles.registerButtonText,
                !selectedSanction && styles.registerButtonTextDisabled,
              ]}
            >
              Registrar sanción
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
