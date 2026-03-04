// app/employer/profile/edit/EditEmployerBasicInfoScreen.tsx
import React from "react";
import {
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button/Button";
import { UploadImage } from "@/components/image/UploadImage";
import { Input } from "@/components/input/Input";
import { CharCounter } from "@/components/others/CharCounter";
import { ClickWindow } from "@/components/window/ClickWindow";
import { TempWindow } from "@/components/window/TempWindow";

import { useEditEmployerBasicInfo } from "@/hooks/employer/profile/useEditEmployerBasicInfo";

import { editEmployerBasicInfoStyles as styles } from "@/styles/app/employer/profile/editEmployerBasicInfoStyles";
import { inputStyles1 } from "@/styles/components/input/inputStyles/inputStyles1";
import { charCounterStyles1 } from "@/styles/components/others/charCounterStyles1";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { tempWindowStyles1 } from "@/styles/components/window/tempWindowStyles1";

import { buttonStyles1 } from "@/styles/components/button/buttonStyles/buttonStyles1";
import { buttonStyles4 } from "@/styles/components/button/buttonStyles/buttonStyles4";
import { buttonStyles5 } from "@/styles/components/button/buttonStyles/buttonStyles5";

import { iconos } from "@/constants/iconos";
import { Colors } from "@/themes/colors";

export default function EditEmployerBasicInfoScreen() {
  const {
    companyName,
    description,
    setCompanyName,
    setDescription,
    imageUrl,
    setProfileImageFile,
    loading,
    saving,
    canSave,

    saveAll,
    goBack,

    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
  } = useEditEmployerBasicInfo();

  const handleGuardar = async () => {
    await saveAll();
    // el hook se encarga de setShowSuccess(true) si todo sale bien
  };

  const buttonStyles =
    !canSave || saving || loading ? buttonStyles4 : buttonStyles1;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Editar perfil de empleador</Text>

        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / imagen */}
          <View style={styles.logoWrapper}>
            <UploadImage
              mode="edit"
              initialImageUrl={imageUrl || undefined}
              shape="square"
              size={120}
              defaultImage={require("@/assets/images/jex/Jex-Evento-Default.webp")}
              onChange={(file, uri) => {
                setProfileImageFile(file);
              }}
              containerStyle={{ alignItems: "center" }}
              imageStyle={styles.logoImage}
            />
          </View>

          {/* Nombre de empresa */}
          <View style={styles.form}>
            <Input
              placeholder="Nombre de la empresa / organización"
              value={companyName}
              onChangeText={setCompanyName}
              styles={inputStyles1}
            />
          </View>

          {/* Descripción */}
          <View style={styles.descriptionWrapper}>
            <Input
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              maxLength={200}
              placeholder="Contanos brevemente qué tipo de eventos organizás"
              styles={{
                input: inputStyles1.input,
                inputContainer: {
                  ...inputStyles1.inputContainer,
                  height: 160,
                  alignItems: "flex-start",
                  paddingTop: 10,
                },
              }}
            />
            <CharCounter
              current={description.length}
              max={200}
              styles={charCounterStyles1}
            />
          </View>

          {/* Footer botones */}
          <View style={styles.footer}>
            
            <Button
              texto={saving ? "Guardando..." : "Guardar cambios"}
              onPress={handleGuardar}
              styles={buttonStyles}
              disabled={!canSave || saving || loading}
              loading={saving}
            />
          </View>
        </ScrollView>

        {/* Error */}
        <ClickWindow
          title="Error"
          visible={showError}
          message={errorMessage}
          onClose={closeError}
          styles={clickWindowStyles1}
          icono={iconos.error_outline(30, Colors.white)}
          buttonText="Entendido"
        />

        {/* Éxito */}
        <TempWindow
          visible={showSuccess}
          icono={iconos.exito(40, Colors.white)}
          onClose={closeSuccess}
          styles={tempWindowStyles1}
          duration={2000}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
