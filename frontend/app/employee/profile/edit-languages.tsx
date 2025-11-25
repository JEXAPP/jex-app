import React, { useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button/Button";
import { ButtonWithIcon } from "@/components/button/ButtonWithIcon";
import { IconButton } from "@/components/button/IconButton";
import { Input } from "@/components/input/Input";
import { DropDown2 } from "@/components/picker/DropDown2";
import { CharCounter } from "@/components/others/CharCounter";
import { ClickWindow } from "@/components/window/ClickWindow";
import { useEditLanguages } from "@/hooks/employee/profile/useEditLanguages";
import { useLanguageOptions } from "@/services/external/sugerencias/useLanguages";
import { editLanguagesStyles as styles } from "@/styles/app/employee/profile/editLanguagesStyles";
import { buttonStyles1 } from "@/styles/components/button/buttonStyles/buttonStyles1";
import { buttonStyles2 } from "@/styles/components/button/buttonStyles/buttonStyles2";
import { buttonWithIconStyles3 } from "@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles3";
import { inputStyles1 } from "@/styles/components/input/inputStyles/inputStyles1";
import { charCounterStyles1 } from "@/styles/components/others/charCounterStyles1";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";

import { Colors } from "@/themes/colors";
import { iconos } from "@/constants/iconos";
import { TempWindow } from "@/components/window/TempWindow";
import { tempWindowStyles1 } from "@/styles/components/window/tempWindowStyles1";
import { dropdown2Styles1 } from "@/styles/components/picker/dropdown2Styles1";

export default function EditLanguagesScreen() {
  const {
    idiomas,
    loading,
    saving,

    languageLevels,
    idiomaModalAbierto,
    abrirModalIdioma,
    cerrarModalIdioma,
    idiomaForm,
    setIdiomaFormField,
    formErrorIdioma,
    guardarIdiomaLocal,
    editarIdioma,
    eliminarIdioma,
    saveAll,
    goBack,
    showSuccess,
    closeSuccess,
  } = useEditLanguages();

  const { languageOptions } = useLanguageOptions();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openError = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const levelOptions = useMemo(
    () =>
      languageLevels.map((lvl) => ({
        id: String(lvl.id),
        name: lvl.name,
      })),
    [languageLevels]
  );

  const handleGuardarIdioma = () => {
    const ok = guardarIdiomaLocal();
    if (!ok && formErrorIdioma) {
      openError(formErrorIdioma);
    }
  };

  const handleSaveAll = async () => {
    const ok = await saveAll();
    if (!ok) {
      openError("No se pudieron guardar los cambios. Intentá nuevamente.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Idiomas</Text>
          <Text style={styles.subtitle}>
            Agregá y actualizá los idiomas que manejás
          </Text>
        </View>

        <View style={styles.actionsColumn}>
          <ButtonWithIcon
            texto="Agregar idioma"
            onPress={abrirModalIdioma}
            icono={iconos.idioma(20, Colors.violet4)}
            styles={buttonWithIconStyles3}
          />
        </View>

        <View style={styles.card}>
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={styles.cardListContent}
            showsVerticalScrollIndicator
          >
            {loading && (
              <View style={styles.cardEmpty}>
                <Text style={styles.cardEmptyText}>Cargando idiomas...</Text>
              </View>
            )}

            {!loading && idiomas.length === 0 && (
              <View style={styles.cardEmpty}>
                <Text style={styles.cardEmptyText}>
                  Todavía no agregaste idiomas.
                </Text>
              </View>
            )}

            {!loading &&
              idiomas.map((l, idx) => (
                <View key={`lang-${idx}`} style={styles.languageItemRow}>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{l.idioma}</Text>
                  </View>

                  <View style={styles.languageLevelBadge}>
                    <Text style={styles.languageLevelText}>{l.nivel}</Text>
                  </View>

                  <View style={styles.languageActions}>
                    <IconButton
                      onPress={() => editarIdioma(idx)}
                      sizeButton={28}
                      backgroundColor="transparent"
                      icon={iconos.edit(18, Colors.violet4)}
                      styles={{
                        button: styles.iconGhost,
                        text: styles.iconGhostTxt,
                      }}
                    />
                    <IconButton
                      onPress={() => eliminarIdioma(idx)}
                      sizeButton={28}
                      backgroundColor="transparent"
                      icon={iconos.trash(18, Colors.violet4)}
                      styles={{
                        button: styles.iconGhost,
                        text: styles.iconGhostTxt,
                      }}
                    />
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Button
            texto={saving ? "Guardando..." : "Guardar cambios"}
            onPress={handleSaveAll}
            disabled={saving}
            styles={{
              ...buttonStyles1,
              boton: {
                ...buttonStyles1.boton,
                width: 180,
                borderRadius: 999,
              },
            }}
          />
        </View>

        {/* MODAL IDIOMA */}
        <Modal
          transparent
          animationType="fade"
          visible={idiomaModalAbierto}
          onRequestClose={cerrarModalIdioma}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                <Text style={styles.modalTitle}>Idioma</Text>

                
                  <DropDown2
                    name="Idioma"
                    placeholder="Elegí un idioma"
                    id={
                      idiomaForm.idioma
                        ? languageOptions.find(
                            (o) => o.name === idiomaForm.idioma
                          )?.id ?? ""
                        : ""
                    }
                    options={languageOptions.map((o) => ({
                      id: o.id,
                      name: o.name,
                    }))}
                    onValueChange={(id) => {
                      const selected = languageOptions.find(
                        (o) => String(o.id) === String(id)
                      );
                      setIdiomaFormField("idioma", selected?.name ?? "");
                    }}
                    styles={dropdown2Styles1}
                  />
                
                  <DropDown2
                    name="Nivel"
                    placeholder="Seleccioná tu nivel"
                    id={
                      idiomaForm.nivelId != null
                        ? String(idiomaForm.nivelId)
                        : ""
                    }
                    options={levelOptions}
                    onValueChange={(id) => {
                      const sel = levelOptions.find((o) => o.id === id);
                      setIdiomaFormField("nivel", sel?.name ?? "");
                      setIdiomaFormField(
                        "nivelId",
                        sel ? Number(sel.id) : null
                      );
                    }}
                    styles={dropdown2Styles1}
                  />

                <View style={styles.fieldWrap}>
                  <Input
                    value={idiomaForm.notas}
                    onChangeText={(v) => setIdiomaFormField("notas", v)}
                    placeholder="Nota (opcional)"
                    multiline
                    maxLength={200}
                    numberOfLines={3}
                    styles={{
                      input: { ...inputStyles1.input },
                      inputContainer: {
                        ...inputStyles1.inputContainer,
                        height: 80,
                        width: 315,
                        alignItems: "flex-start",
                        paddingTop: 5,
                      },
                    }}
                  />
                  <CharCounter
                    current={idiomaForm.notas.length}
                    max={200}
                    styles={charCounterStyles1}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <Button
                    texto="Cancelar"
                    onPress={cerrarModalIdioma}
                    styles={{
                      ...buttonStyles2,
                      boton: {
                        ...buttonStyles2.boton,
                        width: 140,
                        borderRadius: 999,
                      },
                    }}
                  />
                  <Button
                    texto="Guardar"
                    onPress={handleGuardarIdioma}
                    styles={{
                      ...buttonStyles1,
                      boton: {
                        ...buttonStyles1.boton,
                        width: 140,
                        borderRadius: 999,
                      },
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Ventana de error */}
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
