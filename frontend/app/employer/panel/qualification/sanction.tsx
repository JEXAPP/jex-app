import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSanction } from "@/hooks/employer/panel/qualification/useSanction";
import { sanctionStyles as styles } from "@/styles/app/employer/panel/qualification/sanctionStyles";
import * as React from "react";
import { Colors } from "@/themes/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ClickWindow } from "@/components/window/ClickWindow";
import { TempWindow } from "@/components/window/TempWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { tempWindowStyles1 } from "@/styles/components/window/tempWindowStyles1";
import { iconos } from "@/constants/iconos";
import { Input } from "@/components/input/Input";
import { inputStyles1 } from "@/styles/components/input/inputStyles/inputStyles1";
import { CharCounter } from "@/components/others/CharCounter";
import { charCounterStyles1 } from "@/styles/components/others/charCounterStyles1";

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

  const handleSelect = (option: any) => {
    if (selectedType?.id === option.id) {
      goBackOption();
      return;
    }
    selectOption(option);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

        {canGoBack && (
          <TouchableOpacity
            style={styles.goBackContainer}
            onPress={goBackOption}
          >
            <Ionicons name="arrow-back" size={18} color={Colors.violet4} />
            <Text style={styles.goBack}>Volver</Text>
          </TouchableOpacity>
        )}

        <View style={styles.optionsContainer}>
          {currentOptions.map((option: any) => {
            const isActive = selectedType?.id === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  isActive && styles.optionButtonActive,
                ]}
                onPress={() => handleSelect(option)}
              >
                <Ionicons
                  name={option.icon || "alert-circle"}
                  size={22}
                  color={isActive ? "#fff" : Colors.violet4}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}
                >
                  {option.name}
                </Text>
                {isActive && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#fff"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedCategory?.id === "otro" && (
          <View style={{ width: "100%", alignSelf: "center" }}>
            <Text
              style={[
                styles.subtitle,
                {
                  color: Colors.violet4,
                  fontFamily: "interSemiBold",
                  fontSize: 17,
                  marginBottom: 10,
                },
              ]}
            >
              Describe la sanción:
            </Text>

            <Input
              value={customComment}
              onChangeText={setCustomComment}
              placeholder="Escribe aquí..."
              multiline
              maxLength={1000}
              numberOfLines={4}
              styles={{
                input: { ...inputStyles1.input },
                inputContainer: {
                  ...inputStyles1.inputContainer,
                  height: 140,
                  alignItems: "flex-start",
                  paddingTop: 5,
                },
              }}
            />

            <CharCounter
              current={customComment.length}
              max={1000}
              styles={charCounterStyles1}
            />
          </View>
        )}
      </ScrollView>

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
              router.back();
            }
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>
              Registrar sanción
            </Text>
          )}
        </TouchableOpacity>
      </View>

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
  );
}