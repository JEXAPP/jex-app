import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "@/components/button/Button";
import { ButtonWithIcon } from "@/components/button/ButtonWithIcon";
import { IconButton } from "@/components/button/IconButton";
import { Input } from "@/components/input/Input";
import DatePicker from "@/components/picker/DatePicker";
import Suggestions from "@/components/picker/Suggestions";
import { Picker } from "@/components/picker/Picker";
import { UploadImagesGrid } from "@/components/image/UploadImagesGrid";
import { CharCounter } from "@/components/others/CharCounter";
import { ClickWindow } from "@/components/window/ClickWindow";

import { useEditExperience } from "@/hooks/employee/profile/useEditExperience";

import { editExperienceStyles as styles } from "@/styles/app/employee/profile/editExperienceStyles";
import { buttonStyles1 } from "@/styles/components/button/buttonStyles/buttonStyles1";
import { buttonStyles2 } from "@/styles/components/button/buttonStyles/buttonStyles2";
import { buttonWithIconStyles3 } from "@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles3";
import { inputStyles1 } from "@/styles/components/input/inputStyles/inputStyles1";
import { datePickerStyles1 as dpStyles } from "@/styles/components/picker/datePickerStyles1";
import { pickerStyles1 } from "@/styles/components/picker/pickerStyles1";
import { charCounterStyles1 } from "@/styles/components/others/charCounterStyles1";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";

import { Colors } from "@/themes/colors";
import { iconos } from "@/constants/iconos";
import { TempWindow } from "@/components/window/TempWindow";
import { tempWindowStyles1 } from "@/styles/components/window/tempWindowStyles1";

export default function EditExperienceScreen() {
  const {
    experiencias,
    loading,
    saving,
    abrirModalExp,
    cerrarModalExp,
    expModalAbierto,
    expForm,
    setExpFormField,
    fechaInicioExp,
    setFechaInicioExp,
    fechaFinExp,
    setFechaFinExp,
    cargoSug,
    onChangeCargo,
    clearCargoSug,
    tiposTrabajoOptions,
    tipoTrabajoToOption,
    guardarExpLocal,
    editarExp,
    eliminarExp,
    formErrorExp,
    saveAll,
    goBack,
    showSuccess,
    closeSuccess,
    empresaWrapStyleZ,
    editIdxExp,
  } = useEditExperience();

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

  const handleGuardarExp = () => {
    const ok = guardarExpLocal();
    if (!ok && formErrorExp) {
      openError(formErrorExp);
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
          <Text style={styles.title}>Experiencia laboral</Text>
          <Text style={styles.subtitle}>
            Revisá y actualizá tu historial de trabajo
          </Text>
        </View>

        <View style={styles.actionsColumn}>
          <ButtonWithIcon
            texto="Agregar experiencia laboral"
            onPress={abrirModalExp}
            icono={iconos.portfolio(20, Colors.violet4)}
            styles={buttonWithIconStyles3}
          />
        </View>

        <View style={styles.card}>
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={[
              styles.cardListContent,
              { flexGrow: 1 }
            ]}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {loading && (
              <View style={styles.cardEmpty}>
                <Text style={styles.cardEmptyText}>
                  Cargando experiencias...
                </Text>
              </View>
            )}

            {!loading && experiencias.length === 0 && (
              <View style={styles.cardEmpty}>
                <Text style={styles.cardEmptyText}>
                  Todavía no agregaste experiencias laborales.
                </Text>
              </View>
            )}

            {!loading &&
              experiencias.map((e, idx) => {
                const fechaInicioStr = e.fechaInicio
                  ? e.fechaInicio.toLocaleDateString("es-AR")
                  : "—";
                const fechaFinStr = e.fechaFin
                  ? e.fechaFin.toLocaleDateString("es-AR")
                  : "Actual";

                return (
                  <View key={`exp-${idx}`} style={styles.timelineRow}>
                    <View style={styles.timelineCol}>
                      <View style={styles.timelineDot} />
                      {idx !== experiencias.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>

                    <View style={styles.timelineCardWrapper}>
                      <LinearGradient
                        colors={[Colors.gray1, Colors.white] as const}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.timelineCardInner}
                      >
                        <View style={styles.timelineContentRow}>
                          <View style={styles.timelineTextCol}>
                            <Text style={styles.timelineTitle}>
                              {e.cargo || "Cargo sin especificar"}
                            </Text>
                            <Text style={styles.timelineSub}>
                              {e.empresa || "Empresa/Evento"} •{" "}
                              {e.tipoTrabajo || "Tipo de trabajo"}
                            </Text>
                            <Text style={styles.timelineDates}>
                              {fechaInicioStr} — {fechaFinStr}
                            </Text>
                            {!!e.descripcion && (
                              <Text style={styles.timelineDesc}>
                                {e.descripcion}
                              </Text>
                            )}
                          </View>

                          <View style={styles.timelineActionsRow}>
                            <IconButton
                              onPress={() => editarExp(idx)}
                              sizeButton={28}
                              backgroundColor="transparent"
                              icon={iconos.edit(18, Colors.violet4)}
                              styles={{
                                button: styles.iconGhost,
                                text: styles.iconGhostTxt,
                              }}
                            />
                            <IconButton
                              onPress={() => eliminarExp(idx)}
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
                      </LinearGradient>
                    </View>
                  </View>
                );
              })}
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

        {/* MODAL EXPERIENCIA */}
        <Modal
          transparent
          animationType="fade"
          visible={expModalAbierto}
          onRequestClose={cerrarModalExp}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                <Text style={styles.modalTitle}>Experiencia laboral</Text>

                {/* Cargo + sugerencias ESCO */}
                <View style={styles.fieldWrapSuggest}>
                  <Input
                    value={expForm.cargo}
                    onChangeText={onChangeCargo}
                    placeholder="Cargo"
                    styles={{
                      input: inputStyles1.input,
                      inputContainer: {
                        ...inputStyles1.inputContainer,
                        width: 315,
                      },
                    }}
                  />
                  <Suggestions
                    sugerencias={cargoSug}
                    onSeleccionar={(it) => {
                      setExpFormField("cargo", it.descripcion);
                      clearCargoSug();
                    }}
                    styles={styles.suggestionsStyles2}
                  />
                </View>

                {/* Tipo de trabajo */}
                <View style={styles.tagsRow}>
                  <Picker
                    label="Tipo de trabajo"
                    value={tipoTrabajoToOption(expForm.tipoTrabajo)}
                    setValue={(opt) =>
                      setExpFormField("tipoTrabajo", opt?.name ?? "")
                    }
                    options={tiposTrabajoOptions}
                    styles={{
                      ...pickerStyles1,
                      selector: { ...pickerStyles1.selector, width: 315 },
                    }}
                  />
                </View>

                {/* Empresa/Evento */}
                <View style={[styles.fieldWrap, empresaWrapStyleZ]}>
                  <Input
                    value={expForm.empresa}
                    onChangeText={(v) => setExpFormField("empresa", v)}
                    placeholder="Empresa o Evento"
                    styles={{
                      input: inputStyles1.input,
                      inputContainer: {
                        ...inputStyles1.inputContainer,
                        width: 315,
                      },
                    }}
                  />
                </View>

                {/* Fechas */}
                <View style={styles.row2}>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      date={fechaInicioExp}
                      setDate={setFechaInicioExp}
                      styles={{
                        ...dpStyles,
                        selector: { ...dpStyles.selector, width: 150 },
                      }}
                      variant="default"
                      label="Fecha Inicio"
                    />
                  </View>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      date={fechaFinExp}
                      setDate={setFechaFinExp}
                      styles={{
                        ...dpStyles,
                        selector: { ...dpStyles.selector, width: 150 },
                      }}
                      variant="default"
                      label="Fecha Fin"
                    />
                  </View>
                </View>

                {/* Descripción */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={expForm.descripcion}
                    onChangeText={(v) => setExpFormField("descripcion", v)}
                    placeholder="Descripción (opcional)"
                    multiline
                    maxLength={200}
                    numberOfLines={4}
                    styles={{
                      input: { ...inputStyles1.input },
                      inputContainer: {
                        ...inputStyles1.inputContainer,
                        height: 100,
                        width: 315,
                        alignItems: "flex-start",
                        paddingTop: 5,
                      },
                    }}
                  />
                  <CharCounter
                    current={expForm.descripcion.length}
                    max={200}
                    styles={charCounterStyles1}
                  />
                </View>

                {/* Imágenes */}
                <UploadImagesGrid
                  key={editIdxExp !== null ? `edit-${editIdxExp}` : "new"}
                  max={3}
                  thumbSize={90}
                  shape="square"
                  initialExisting={
                    expForm.fotosUris.length
                      ? expForm.fotosUris.map((url, idx) => ({
                          id: expForm.fotosExistingIds?.[idx] ?? null,
                          url,
                        }))
                      : []
                  }
                  onChange={(files, uris, existingIds) =>
                    setExpFormField("fotos", {
                      files,
                      uris,
                      existingIds: existingIds ?? [],
                    })
                  }
                />

                <View style={styles.modalButtons}>
                  <Button
                    texto="Cancelar"
                    onPress={cerrarModalExp}
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
                    onPress={handleGuardarExp}
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
