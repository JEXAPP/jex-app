// src/app/employee/profile/edit-interests.tsx
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/themes/colors";
import { SelectableTag } from "@/components/button/SelectableTags";
import { selectableTagStyles2 } from "@/styles/components/button/selectableTagsStyles/selectableTagsStyles2";
import { Button } from "@/components/button/Button";
import { buttonStyles5 } from "@/styles/components/button/buttonStyles/buttonStyles5";
import { ClickWindow } from "@/components/window/ClickWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { iconos } from "@/constants/iconos";
import { editInterestsStyles as styles } from "@/styles/app/employee/profile/settings/editInterestsStyles";
import { useEditInterests } from "@/hooks/employee/profile/settings/useEditInterests";
import { DotsLoader } from "@/components/others/DotsLoader";
import { buttonStyles2 } from "@/styles/components/button/buttonStyles/buttonStyles2";

const EditInterestsScreen: React.FC = () => {
  const {
    intereses,
    interesesSeleccionados,
    handleToggleIntereses,
    loading,
    saving,
    hasChanges,
    registrarCambios,
    showError,
    errorMessage,
    closeError,
  } = useEditInterests();

  const disabled = !hasChanges || saving;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Modificá tus intereses</Text>
        <Text style={styles.subtitle}>
          Elegí hasta 3 intereses para mejorar tus coincidencias
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <DotsLoader/>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tagsContainer}>
            {intereses.map((interes) => (
              <SelectableTag
                key={interes.id}
                title={interes.name}
                selected={interesesSeleccionados.includes(interes.id)}
                onPress={() => handleToggleIntereses(interes.id)}
                styles={selectableTagStyles2}
              />
            ))}
          </View>
          <View style={styles.footer}>
            <Button
            texto={saving ? "Guardando..." : "Registrar cambios"}
            onPress={registrarCambios}
            styles={{
                boton: {
                ...buttonStyles2.boton,
                flex: 1,
                opacity: disabled ? 0.4 : 1,
                width: 200
                },
                texto: {
                ...buttonStyles2.texto,
                },
            }}
            />
        </View>
        </ScrollView>
      )}

      <ClickWindow
        title="Error"
        visible={showError}
        message={errorMessage}
        onClose={closeError}
        styles={clickWindowStyles1}
        icono={iconos.error_outline(30, Colors.white)}
        buttonText="Entendido"
      />
    </SafeAreaView>
  );
};

export default EditInterestsScreen;
