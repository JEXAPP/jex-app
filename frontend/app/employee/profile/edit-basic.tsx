// app/employee/profile/edit/EditBasicInfoScreen.tsx
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
import DatePicker from "@/components/picker/DatePicker";
import LocationAddressPicker from "@/components/picker/LocationPicker";
import { ClickWindow } from "@/components/window/ClickWindow";
import { TempWindow } from "@/components/window/TempWindow";

import { useEditBasicInfo } from "@/hooks/employee/profile/useEditBasicInfo";

import { editBasicInfoStyles as styles } from "@/styles/app/employee/profile/editBasicInfoStyles";
import { inputStyles1 } from "@/styles/components/input/inputStyles/inputStyles1";
import { datePickerStyles1 } from "@/styles/components/picker/datePickerStyles1";
import { charCounterStyles1 } from "@/styles/components/others/charCounterStyles1";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { tempWindowStyles1 } from "@/styles/components/window/tempWindowStyles1";

import { buttonStyles1 } from "@/styles/components/button/buttonStyles/buttonStyles1";
import { buttonStyles4 } from "@/styles/components/button/buttonStyles/buttonStyles4";
import { buttonStyles5 } from "@/styles/components/button/buttonStyles/buttonStyles5";

import { iconos } from "@/constants/iconos";
import { Colors } from "@/themes/colors";

export default function EditBasicInfoScreen() {
  const {
    // state
    firstName,
    lastName,
    dni,
    birthDate,
    address,
    aboutMe,
    setFirstName,
    setLastName,
    handleChangeDni,
    setBirthDate,
    handleAddress,
    setAboutMe,
    setProfileImageFile,
    imageUrl,          // 👈 nueva del hook
    loading,
    saving,
    canSave,

    // nav
    goBack,

    // acciones
    saveAll,

    // ventanas
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
  } = useEditBasicInfo();

  const handleGuardar = async () => {
    const ok = await saveAll();
    // el hook se encarga de setShowSuccess(true) si todo salió bien
  };

  const buttonStyles = !canSave || saving || loading ? buttonStyles4 : buttonStyles1;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Editar información básica</Text>
          <Text style={styles.subtitle}>
            Actualizá tus datos personales y tu perfil.
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Foto de perfil */}
          <View style={styles.profileImageWrapper}>
            <UploadImage
              mode="edit"
              initialImageUrl={imageUrl || undefined}
              shape="circle"
              size={120}
              defaultImage={require("@/assets/images/jex/Jex-Postulantes-Default.webp")}
              onChange={(file, uri) => {
                // el componente ya maneja la vista, sólo necesitamos el file
                setProfileImageFile(file);
              }}
              containerStyle={{ alignItems: "center" }}
              imageStyle={styles.profileImage}
            />
          </View>

          {/* Nombre / Apellido / etc... */}
          <View style={styles.form}>
            <Input
              placeholder="Nombre"
              value={firstName}
              onChangeText={setFirstName}
              styles={inputStyles1}
            />

            <Input
              placeholder="Apellido"
              value={lastName}
              onChangeText={setLastName}
              styles={inputStyles1}
            />

            <LocationAddressPicker
              placeholder="Ubicación"
              value={address}
              onChange={(canonical, c) => {
                handleAddress(canonical, c || null);
              }}
            />

            <Input
              placeholder="DNI"
              value={dni}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={handleChangeDni}
              styles={inputStyles1}
            />

            <DatePicker
              label="Fecha de nacimiento"
              date={birthDate}
              setDate={setBirthDate}
              maximumDate={new Date()}
              minimumDate={new Date(1950, 1, 1)}
              styles={datePickerStyles1}
            />
          </View>

          {/* Sobre mí */}
          <View style={styles.aboutWrapper}>
            <Input
              value={aboutMe}
              onChangeText={setAboutMe}
              multiline
              numberOfLines={8}
              maxLength={200}
              placeholder="Escribí una breve descripción tuya"
              styles={{
                input: inputStyles1.input,
                inputContainer: {
                  ...inputStyles1.inputContainer,
                  height: 180,
                  alignItems: "flex-start",
                  paddingTop: 10,
                },
              }}
            />
            <CharCounter
              current={aboutMe.length}
              max={200}
              styles={charCounterStyles1}
            />
          </View>

          {/* Footer */}
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
    </TouchableWithoutFeedback>
  );
}
