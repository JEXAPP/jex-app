import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSanction } from "@/hooks/employer/panel/qualification/useSanction";
import { sanctionStyles as styles } from "@/styles/app/employer/panel/qualification/sanctionStyles";
import * as React from "react";
import { Colors } from "@/themes/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ClickWindow } from "@/components/window/ClickWindow";
import { TempWindow } from "@/components/window/TempWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { tempWindowStyles1 } from "@/styles/components/window/tempWindowStyles1";
import { iconos } from "@/constants/iconos";

export default function SanctionScreen() {
  const router = useRouter();
  const { workerId, eventId } =
    useLocalSearchParams<{ workerId: string; eventId: string }>();

  const {
    worker,
    currentOptions,
    selectedCategory,
    selectedType,
    selectOption,
    goBackOption,
    canGoBack,
    registerSanction,
    customComment,
    setCustomComment,
    loading,

    // modales
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
  } = useSanction(workerId, eventId);

  if (!worker) {
    return (
      <View style={styles.container}>
        <Text>Empleado no encontrado</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#ffffff", "#f9f9fb"]} style={{ flex: 1 }}>
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
            <Image
              source={
                worker.image
                  ? { uri: worker.image }
                  : require("@/assets/images/jex/Jex-FotoPerfil.webp")
              }
              style={styles.workerImage}
            />

            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerRole}>{worker.role}</Text>
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
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedType?.id === option.id && styles.optionButtonActive,
                ]}
                onPress={() => selectOption(option)}
              >
                <Ionicons
                  name={option.icon || "alert-circle"}
                  size={22}
                  color={
                    selectedType?.id === option.id ? "#fff" : Colors.violet4
                  }
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedType?.id === option.id &&
                      styles.optionTextActive,
                  ]}
                >
                  {option.name}
                </Text>
                {selectedType?.id === option.id && (
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

          {/* Campo texto libre para "Otro" */}
          {selectedCategory?.id === "otro" && (
            <View style={{ marginTop: 20, width: "90%", alignSelf: "center" }}>
              <Text
                style={[
                  styles.subtitle,
                  { color: Colors.violet4, fontWeight: "600" },
                ]}
              >
                Describe la sanción:
              </Text>
              <TextInput
                value={customComment}
                onChangeText={setCustomComment}
                style={styles.commentInput}
                placeholder="Escribe aquí..."
                placeholderTextColor={Colors.gray2}
                multiline
              />
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.registerButton,
              !selectedType && selectedCategory?.id !== "otro"
                ? styles.registerButtonDisabled
                : null,
            ]}
            disabled={
              loading || (!selectedType && selectedCategory?.id !== "otro")
            }
            onPress={async () => {
              const ok = await registerSanction();
              if (ok) {
                // Podés dejar el back o no, según prefieras
                router.back();
              }
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Registrar sanción</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Modales de error / éxito */}
        <ClickWindow
          title="Error"
          visible={showError}
          message={errorMessage}
          onClose={closeError}
          styles={clickWindowStyles1}
          icono={iconos.error_outline(30, Colors.white)}
          buttonText="Entendido"
        />

        <TempWindow
          visible={showSuccess}
          icono={iconos.exito(40, Colors.white)}
          onClose={closeSuccess}
          styles={tempWindowStyles1}
          duration={2000}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
