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
import { UploadImagesGrid } from "@/components/image/UploadImagesGrid";
import { CharCounter } from "@/components/others/CharCounter";
import { ClickWindow } from "@/components/window/ClickWindow";
import { useEditEducation } from "@/hooks/employee/profile/useEditEducation";
import { editEducationStyles as styles } from "@/styles/app/employee/profile/editEducationStyles";
import { buttonStyles1 } from "@/styles/components/button/buttonStyles/buttonStyles1";
import { buttonStyles2 } from "@/styles/components/button/buttonStyles/buttonStyles2";
import { buttonWithIconStyles3 } from "@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles3";
import { inputStyles1 } from "@/styles/components/input/inputStyles/inputStyles1";
import { datePickerStyles1 as dpStyles } from "@/styles/components/picker/datePickerStyles1";
import { charCounterStyles1 } from "@/styles/components/others/charCounterStyles1";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";

import { Colors } from "@/themes/colors";
import { iconos } from "@/constants/iconos";
import { TempWindow } from "@/components/window/TempWindow";
import { tempWindowStyles1 } from "@/styles/components/window/tempWindowStyles1";

export default function EditEducationScreen() {
  const {
    estudios,
    loading,
    saving,

    abrirModalEdu,
    cerrarModalEdu,
    eduModalAbierto,

    eduForm,
    setEduFormField,
    fechaInicioEdu,
    setFechaInicioEdu,
    fechaFinEdu,
    setFechaFinEdu,
    instSug,
    onChangeInst,
    clearInstSug,
    discSug,
    onChangeDisc,
    clearDiscSug,
    guardarEduLocal,
    editarEdu,
    eliminarEdu,
    formErrorEdu,
    saveAll,
    goBack,
    showSuccess,
    closeSuccess,
    editIdxEdu,
  } = useEditEducation();

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

  const handleGuardarEdu = () => {
    const ok = guardarEduLocal();
    if (!ok && formErrorEdu) {
      openError(formErrorEdu);
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
          <Text style={styles.title}>Educación</Text>
          <Text style={styles.subtitle}>
            Revisá y actualizá tus estudios y certificaciones
          </Text>
        </View>

        <View style={styles.actionsColumn}>
          <ButtonWithIcon
            texto="Agregar estudio / certificación"
            onPress={abrirModalEdu}
            icono={iconos.libro_abierto(25, Colors.violet4)}
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
                <Text style={styles.cardEmptyText}>Cargando estudios...</Text>
              </View>
            )}

            {!loading && estudios.length === 0 && (
              <View style={styles.cardEmpty}>
                <Text style={styles.cardEmptyText}>
                  Todavía no agregaste estudios ni certificaciones.
                </Text>
              </View>
            )}

            {!loading &&
              estudios.map((e, idx) => {
                const fechaInicioStr = e.fechaInicio
                  ? e.fechaInicio.toLocaleDateString("es-AR")
                  : "—";
                const fechaFinStr = e.fechaFin
                  ? e.fechaFin.toLocaleDateString("es-AR")
                  : "Prevista / Finalizada";

                return (
                  <View key={`edu-${idx}`} style={styles.timelineRow}>
                    <View style={styles.timelineCol}>
                      <View style={styles.timelineDotEdu} />
                      {idx !== estudios.length - 1 && (
                        <View style={styles.timelineLineEdu} />
                      )}
                    </View>

                    <View style={styles.timelineCardWrapper}>
                      <LinearGradient
                        colors={[Colors.violet1, Colors.white] as const}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.timelineCardInner}
                      >
                        <View style={styles.timelineContentRow}>
                          <View style={styles.timelineTextCol}>
                            <Text style={styles.timelineTitle}>
                              {e.titulo || "Título / Certificación"}
                            </Text>
                            <Text style={styles.timelineSub}>
                              {e.institucion || "Institución"} •{" "}
                              {e.disciplina || "Disciplina"}
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
                              onPress={() => editarEdu(idx)}
                              sizeButton={28}
                              backgroundColor="transparent"
                              icon={iconos.edit(18, Colors.violet4)}
                              styles={{
                                button: styles.iconGhost,
                                text: styles.iconGhostTxt,
                              }}
                            />
                            <IconButton
                              onPress={() => eliminarEdu(idx)}
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

        {/* MODAL EDUCACIÓN */}
        <Modal
          transparent
          animationType="fade"
          visible={eduModalAbierto}
          onRequestClose={cerrarModalEdu}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                <Text style={styles.modalTitle}>Estudio / Certificación</Text>

                {/* Institución */}
                <View style={styles.fieldWrapSuggest}>
                  <Input
                    value={eduForm.institucion}
                    onChangeText={onChangeInst}
                    placeholder="Institución educativa"
                    styles={{
                      input: inputStyles1.input,
                      inputContainer: {
                        ...inputStyles1.inputContainer,
                        width: 315,
                      },
                    }}
                  />
                  <Suggestions
                    sugerencias={instSug}
                    onSeleccionar={(it) => {
                      setEduFormField("institucion", it.descripcion);
                      clearInstSug();
                    }}
                    styles={styles.suggestionsStyles2}
                  />
                </View>

                {/* Título */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={eduForm.titulo}
                    onChangeText={(v) => setEduFormField("titulo", v)}
                    placeholder="Título (Licenciatura, Tecnicatura, etc.)"
                    styles={{
                      input: inputStyles1.input,
                      inputContainer: {
                        ...inputStyles1.inputContainer,
                        width: 315,
                      },
                    }}
                  />
                </View>

                {/* Disciplina */}
                <View style={styles.fieldWrapSuggest}>
                  <Input
                    value={eduForm.disciplina}
                    onChangeText={onChangeDisc}
                    placeholder="Disciplina académica"
                    styles={{
                      input: inputStyles1.input,
                      inputContainer: {
                        ...inputStyles1.inputContainer,
                        width: 315,
                      },
                    }}
                  />
                  <Suggestions
                    sugerencias={discSug}
                    onSeleccionar={(it) => {
                      setEduFormField("disciplina", it.descripcion);
                      clearDiscSug();
                    }}
                    styles={styles.suggestionsStyles2}
                  />
                </View>

                {/* Fechas */}
                <View style={styles.row2}>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      label="Fecha Inicio"
                      date={fechaInicioEdu}
                      setDate={setFechaInicioEdu}
                      styles={{
                        ...dpStyles,
                        selector: { ...dpStyles.selector, width: 150 },
                      }}
                      variant="default"
                    />
                  </View>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      label="Fecha Fin"
                      date={fechaFinEdu}
                      setDate={setFechaFinEdu}
                      styles={{
                        ...dpStyles,
                        selector: { ...dpStyles.selector, width: 150 },
                      }}
                      variant="default"
                    />
                  </View>
                </View>

                {/* Descripción */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={eduForm.descripcion}
                    onChangeText={(v) => setEduFormField("descripcion", v)}
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
                    current={eduForm.descripcion.length}
                    max={200}
                    styles={charCounterStyles1}
                  />
                </View>

                {/* Imágenes de certificados */}
                <UploadImagesGrid
                  key={editIdxEdu !== null ? `edit-${editIdxEdu}` : "new"}
                  max={3}
                  thumbSize={90}
                  shape="square"
                  initialExisting={
                    eduForm.fotosUris.length
                      ? eduForm.fotosUris.map((url, idx) => ({
                          id: eduForm.fotosExistingIds?.[idx] ?? null,
                          url,
                        }))
                      : []
                  }
                  onChange={(files, uris, existingIds) =>
                    setEduFormField("fotos", {
                      files,
                      uris,
                      existingIds: existingIds ?? [],
                    })
                  }
                />

                <View style={styles.modalButtons}>
                  <Button
                    texto="Cancelar"
                    onPress={cerrarModalEdu}
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
                    onPress={handleGuardarEdu}
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
