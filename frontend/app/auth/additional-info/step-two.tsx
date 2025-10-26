import React, { useState } from 'react';
import { Keyboard, Modal, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { IconButton } from '@/components/button/IconButton';
import { Input } from '@/components/input/Input';
import DatePicker from '@/components/picker/DatePicker';
import Suggestions from '@/components/picker/Suggestions';

import { UploadImagesGrid } from '@/components/image/UploadImagesGrid';
import { useOnboardingExperience } from '@/hooks/auth/additional-info/useStepTwo';
import { stepTwoAdditionalInfoStyles as styles } from '@/styles/app/auth/additional-info/stepTwoStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { datePickerStyles1 as dpStyles } from '@/styles/components/picker/datePickerStyles1';
import { suggestionsStyles2 } from '@/styles/components/picker/suggestionsStyles/suggestionsStyles2';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { buttonWithIconStyles3 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles3';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';
import { CharCounter } from '@/components/others/CharCounter';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles/buttonStyles2';
import { Picker } from '@/components/picker/Picker';
import { pickerStyles1 } from '@/styles/components/picker/pickerStyles1';
import { FlatList } from 'react-native-gesture-handler';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { ClickWindow } from '@/components/window/ClickWindow';

export default function OnboardingExperienceScreen() {
  const {
    // nav
    omitir,
    siguiente,

    // lists
    experiencias, estudios,
    editarExp, eliminarExp,
    editarEdu, eliminarEdu,

    // modals
    abrirModalExp, cerrarModalExp, expModalAbierto,
    abrirModalEdu, cerrarModalEdu, eduModalAbierto,

    // forms: experiencia
    expForm, setExpFormField, guardarExp,
    cargoSug, onChangeCargo,
    // fechas exp
    fechaInicioExp, setFechaInicioExp,
    fechaFinExp, setFechaFinExp,

    // forms: educacion
    eduForm, setEduFormField, guardarEdu,
    instSug, onChangeInst,
    discSug, onChangeDisc,
    // fechas edu
    fechaInicioEdu, setFechaInicioEdu,
    fechaFinEdu, setFechaFinEdu,
    tiposTrabajoOptions, tipoTrabajoToOption,

    // nuevos helpers y mensajes de validación
    clearCargoSug, clearInstSug, clearDiscSug,
    formErrorExp, formErrorEdu,
  } = useOnboardingExperience();

  // ClickWindow (errores)
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const closeError = () => setShowError(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

        <View style={styles.header}>
          <Text style={styles.title}>Ingresá tus experiencias</Text>
        </View>

        {/* Botones de acción (con imagen como icono) */}
        <ButtonWithIcon
          texto="Agregar experiencia laboral"
          onPress={abrirModalExp}
          icono={iconos.portfolio(20, Colors.violet4)}
          styles={buttonWithIconStyles3}
        />

        {/* Experiencias */}
        <View style={styles.card}>
          {experiencias.length === 0 ? (
            <></>
          ) : (
            <FlatList
              data={experiencias}
              keyExtractor={(_, i) => `exp-${i}`}
              style={styles.cardList}
              contentContainerStyle={styles.cardListContent}
              showsVerticalScrollIndicator
              renderItem={({ item: e, index: i }) => (
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{e.cargo || 'Cargo sin especificar'}</Text>
                    <Text style={styles.itemSub}>{e.empresa || 'Empresa/Evento'} • {e.tipoTrabajo || 'Tipo'}</Text>
                    <Text style={styles.itemDates}>
                      {e.fechaInicio ? e.fechaInicio.toLocaleDateString('es-AR') : '—'} — {e.fechaFin ? e.fechaFin.toLocaleDateString('es-AR') : 'Actual'}
                    </Text>
                    {!!e.descripcion && <Text style={styles.itemDesc}>{e.descripcion}</Text>}
                  </View>

                  <View style={styles.itemActions}>
                    <View style={styles.actionsInner}>
                      <IconButton
                        onPress={() => editarExp(i)}
                        content="create-outline"
                        sizeContent={18}
                        sizeButton={28}
                        backgroundColor="transparent"
                        contentColor={Colors.violet4}
                        styles={{ button: styles.iconGhost, text: styles.iconGhostTxt }}
                      />
                      <IconButton
                        onPress={() => eliminarExp(i)}
                        content="trash"
                        sizeContent={18}
                        sizeButton={28}
                        backgroundColor="transparent"
                        contentColor={Colors.gray3}
                        styles={{ button: styles.iconGhost, text: styles.iconGhostTxt }}
                      />
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        <ButtonWithIcon
          texto="Agregar estudio/certificación"
          onPress={abrirModalEdu}
          icono={iconos.libro_abierto(25, Colors.violet4)}
          styles={buttonWithIconStyles3}
        />

        {/* Estudios */}
        <View style={styles.card}>
          {estudios.length === 0 ? (
            <></>
          ) : (
            <FlatList
              data={estudios}
              keyExtractor={(_, i) => `edu-${i}`}
              style={styles.cardList}
              contentContainerStyle={styles.cardListContent}
              showsVerticalScrollIndicator
              renderItem={({ item: e, index: i }) => (
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{e.titulo || 'Título / Certificación'}</Text>
                    <Text style={styles.itemSub}>{e.institucion || 'Institución'} • {e.disciplina || 'Disciplina'}</Text>
                    <Text style={styles.itemDates}>
                      {e.fechaInicio ? e.fechaInicio.toLocaleDateString('es-AR') : '—'} — {e.fechaFin ? e.fechaFin.toLocaleDateString('es-AR') : 'Prevista / Actual'}
                    </Text>
                    {!!e.descripcion && <Text style={styles.itemDesc}>{e.descripcion}</Text>}
                  </View>

                  <View style={styles.itemActions}>
                    <View style={styles.actionsInner}>
                      <IconButton
                        onPress={() => editarEdu(i)}
                        content="create-outline"
                        sizeContent={18}
                        sizeButton={28}
                        backgroundColor="transparent"
                        contentColor={Colors.violet4}
                        styles={{ button: styles.iconGhost, text: styles.iconGhostTxt }}
                      />
                      <IconButton
                        onPress={() => eliminarEdu(i)}
                        content="trash"
                        sizeContent={18}
                        sizeButton={28}
                        backgroundColor="transparent"
                        contentColor={Colors.gray3}
                        styles={{ button: styles.iconGhost, text: styles.iconGhostTxt }}
                      />
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* Footer: Siguiente */}
        <View style={styles.footer}>
          <Button
            onPress={omitir}
            styles={{ boton: { ...buttonStyles5.boton, width: 100, alignItems: 'flex-start' }, texto: { ...buttonStyles5.texto, ...styles.skipButton } }}
            texto="Omitir"
          />
          <Button
            texto="Siguiente"
            onPress={siguiente}
            styles={{ boton: { ...buttonStyles5.boton, width: 100 }, texto: { ...buttonStyles5.texto, ...styles.nextButton } }}
          />
        </View>

        {/* -------- MODAL: EXPERIENCIA -------- */}
        <Modal transparent animationType="fade" visible={expModalAbierto} onRequestClose={cerrarModalExp}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                <Text style={styles.modalTitle}>Experiencia Laboral</Text>

                {/* Cargo (ESCO) con sugerencias */}
                <View style={styles.fieldWrapSuggest}>
                  <Input
                    value={expForm.cargo}
                    onChangeText={onChangeCargo}
                    placeholder="Cargo"
                    styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 315 } }}
                  />
                  <Suggestions
                    sugerencias={cargoSug}
                    onSeleccionar={(it) => {
                      setExpFormField('cargo', it.descripcion);
                      clearCargoSug(); // ocultar al usar
                    }}
                    styles={suggestionsStyles2}
                  />
                </View>

                {/* Tipo de trabajo (tags simples) */}
                <View style={styles.tagsRow}>
                  <Picker
                    label="Tipo de trabajo"
                    value={tipoTrabajoToOption(expForm.tipoTrabajo)}
                    setValue={(opt) => setExpFormField('tipoTrabajo', opt?.name ?? '')}
                    options={tiposTrabajoOptions}
                    styles={{ ...pickerStyles1, selector: { ...pickerStyles1.selector, width: 315 } }}
                  />
                </View>

                {/* Empresa / Evento */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={expForm.empresa}
                    onChangeText={(v) => setExpFormField('empresa', v)}
                    placeholder="Empresa o Evento"
                    styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 315 } }}
                  />
                </View>

                {/* Fechas */}
                <View style={styles.row2}>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      date={fechaInicioExp}
                      setDate={setFechaInicioExp}
                      styles={{ ...dpStyles, selector: { ...dpStyles.selector, width: 150 } }}
                      variant="default"
                      label='Fecha Inicio'
                    />
                  </View>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      date={fechaFinExp}
                      setDate={setFechaFinExp}
                      styles={{ ...dpStyles, selector: { ...dpStyles.selector, width: 150 } }}
                      variant="default"
                      label='Fecha Inicio'
                    />
                  </View>
                </View>

                {/* Descripción */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={expForm.descripcion}
                    onChangeText={(v) => setExpFormField('descripcion', v)}
                    placeholder="Descripción"
                    multiline
                    maxLength={200}
                    numberOfLines={4}
                    styles={{
                      input: { ...inputStyles1.input },
                      inputContainer: { ...inputStyles1.inputContainer, height: 100, width: 315, alignItems: 'flex-start', paddingTop: 5 },
                    }}
                  />
                  <CharCounter current={expForm.descripcion.length} max={200} styles={charCounterStyles1} />
                </View>

                {/* Fotos (hasta 3) */}
                <UploadImagesGrid
                  max={3}
                  thumbSize={90}
                  shape="square"
                  onChange={(files, uris) => setExpFormField('fotos', { files, uris })}
                />

                {/* Botonera modal */}
                <View style={styles.modalButtons}>
                  <Button texto="Cancelar" onPress={cerrarModalExp} styles={{ ...buttonStyles2, boton: { ...buttonStyles2.boton, width: 150, borderRadius: 999 } }} />
                  <Button
                    texto="Guardar"
                    onPress={() => {
                      const ok = guardarExp();
                      if (!ok) {
                        setErrorMessage(formErrorExp || 'Revisá los campos obligatorios.');
                        setShowError(true);
                      }
                    }}
                    styles={{ ...buttonStyles1, boton: { ...buttonStyles1.boton, width: 150, borderRadius: 999 } }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* -------- MODAL: EDUCACIÓN -------- */}
        <Modal transparent animationType="fade" visible={eduModalAbierto} onRequestClose={cerrarModalEdu}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                <Text style={styles.modalTitle}>Estudio / Certificación</Text>

                {/* Institución (Hipolabs) */}
                <View style={styles.fieldWrapSuggest}>
                  <Input
                    value={eduForm.institucion}
                    onChangeText={onChangeInst}
                    placeholder="Institución Educativa"
                    styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 315 } }}
                  />
                  <Suggestions
                    sugerencias={instSug}
                    onSeleccionar={(it) => {
                      setEduFormField('institucion', it.descripcion);
                      clearInstSug(); // ocultar al usar
                    }}
                    styles={suggestionsStyles2}
                  />
                </View>

                {/* Título */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={eduForm.titulo}
                    onChangeText={(v) => setEduFormField('titulo', v)}
                    placeholder="Título (Licenciatura, Tecnicatura, etc)"
                    styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 315 } }}
                  />
                </View>

                {/* Disciplina (OpenAlex) */}
                <View style={styles.fieldWrapSuggest}>
                  <Input
                    value={eduForm.disciplina}
                    onChangeText={onChangeDisc}
                    placeholder="Disciplina Académica"
                    styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 315 } }}
                  />
                  <Suggestions
                    sugerencias={discSug}
                    onSeleccionar={(it) => {
                      setEduFormField('disciplina', it.descripcion);
                      clearDiscSug(); // ocultar al usar
                    }}
                    styles={suggestionsStyles2}
                  />
                </View>

                {/* Fechas */}
                <View style={styles.row2}>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      label="Fecha Inicio"
                      date={fechaInicioEdu}
                      setDate={setFechaInicioEdu}
                      styles={{ ...dpStyles, selector: { ...dpStyles.selector, width: 150 } }}
                      variant="default"
                    />
                  </View>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      date={fechaFinEdu}
                      label="Fecha Fin"
                      setDate={setFechaFinEdu}
                      styles={{ ...dpStyles, selector: { ...dpStyles.selector, width: 150 } }}
                      variant="default"
                    />
                  </View>
                </View>

                {/* Descripción */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={eduForm.descripcion}
                    onChangeText={(v) => setEduFormField('descripcion', v)}
                    placeholder="Descripción"
                    multiline
                    maxLength={200}
                    numberOfLines={4}
                    styles={{
                      input: { ...inputStyles1.input },
                      inputContainer: { ...inputStyles1.inputContainer, height: 100, width: 315, alignItems: 'flex-start', paddingTop: 5 },
                    }}
                  />
                  <CharCounter current={eduForm.descripcion.length} max={200} styles={charCounterStyles1} />
                </View>

                {/* Fotos diploma (hasta 3) */}
                <UploadImagesGrid
                  max={3}
                  thumbSize={90}
                  shape="square"
                  onChange={(files, uris) => setEduFormField('fotos', { files, uris })}
                />

                {/* Botonera modal */}
                <View style={styles.modalButtons}>
                  <Button texto="Cancelar" onPress={cerrarModalEdu} styles={{ ...buttonStyles2, boton: { ...buttonStyles2.boton, width: 150, borderRadius: 999 } }} />
                  <Button
                    texto="Guardar"
                    onPress={() => {
                      const ok = guardarEdu();
                      if (!ok) {
                        setErrorMessage(formErrorEdu || 'Revisá los campos obligatorios.');
                        setShowError(true);
                      }
                    }}
                    styles={{ ...buttonStyles1, boton: { ...buttonStyles1.boton, width: 150, borderRadius: 999 } }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ClickWindow de errores */}
        <ClickWindow
          title='Error'
          visible={showError}
          message={errorMessage}
          onClose={closeError}
          styles={clickWindowStyles1}
          icono={iconos.error_outline(30, Colors.white)}
          buttonText='Entendido'
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
