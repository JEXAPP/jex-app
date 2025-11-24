import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { IconButton } from '@/components/button/IconButton';
import { Input } from '@/components/input/Input';
import DatePicker from '@/components/picker/DatePicker';
import Suggestions from '@/components/picker/Suggestions';
import { Picker } from '@/components/picker/Picker';
import { DropDown2 } from '@/components/picker/DropDown2';
import { UploadImagesGrid } from '@/components/image/UploadImagesGrid';

import {
  useOnboardingExperience,
  Experiencia,
  Educacion,
} from '@/hooks/auth/additional-info/useStepTwo';
import { useLanguageOptions } from '@/services/external/sugerencias/useLanguages';

import { stepTwoAdditionalInfoStyles as styles } from '@/styles/app/auth/additional-info/stepTwoStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles/buttonStyles2';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';
import { buttonWithIconStyles3 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles3';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { datePickerStyles1 as dpStyles } from '@/styles/components/picker/datePickerStyles1';
import { pickerStyles1 } from '@/styles/components/picker/pickerStyles1';
import { dropdown2Styles1 } from '@/styles/components/picker/dropdown2Styles1';
import { suggestionsStyles2 } from '@/styles/components/picker/suggestionsStyles/suggestionsStyles2';
import { CharCounter } from '@/components/others/CharCounter';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { ClickWindow } from '@/components/window/ClickWindow';

import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';

type TimelineItem =
  | { kind: 'exp'; index: number; data: Experiencia }
  | { kind: 'edu'; index: number; data: Educacion };

export default function OnboardingExperienceScreen() {
  const {
    // nav
    omitir,
    siguiente,

    // lists
    experiencias,
    estudios,
    idiomas,

    // acciones
    editarExp,
    eliminarExp,
    editarEdu,
    eliminarEdu,
    eliminarIdioma,

    // modals
    abrirModalExp,
    cerrarModalExp,
    expModalAbierto,
    abrirModalEdu,
    cerrarModalEdu,
    eduModalAbierto,
    abrirModalIdioma,
    cerrarModalIdioma,
    idiomaModalAbierto,

    // forms exp
    expForm,
    setExpFormField,
    guardarExp,
    cargoSug,
    onChangeCargo,
    fechaInicioExp,
    setFechaInicioExp,
    fechaFinExp,
    setFechaFinExp,
    formErrorExp,
    tiposTrabajoOptions,

    // forms edu
    eduForm,
    setEduFormField,
    guardarEdu,
    instSug,
    onChangeInst,
    discSug,
    onChangeDisc,
    fechaInicioEdu,
    setFechaInicioEdu,
    fechaFinEdu,
    setFechaFinEdu,
    tipoTrabajoToOption,
    formErrorEdu,

    // helpers sugerencias
    clearCargoSug,
    clearInstSug,
    clearDiscSug,

    // idioma
    idiomaForm,
    setIdiomaFormField,
    guardarIdioma,
    formErrorIdioma,

    // niveles de idioma
    languageLevels,
  } = useOnboardingExperience();

  const { languageOptions } = useLanguageOptions();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const closeError = () => setShowError(false);

  // Opciones de nivel desde backend
  const levelOptions = useMemo(
    () =>
      languageLevels.map((lvl) => ({
        id: String(lvl.id),
        name: lvl.name,
      })),
    [languageLevels]
  );

  const nivelToOption = (nivel: string | undefined | null) =>
    levelOptions.find((o) => o.name === (nivel || '')) ?? null;

  const timelineItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];

    experiencias.forEach((e, idx) => items.push({ kind: 'exp', index: idx, data: e }));
    estudios.forEach((e, idx) => items.push({ kind: 'edu', index: idx, data: e }));

    const getStartTime = (d: Date | null) =>
      d instanceof Date && !isNaN(d.getTime()) ? d.getTime() : 0;

    items.sort((a, b) => {
      const ta = getStartTime(a.data.fechaInicio);
      const tb = getStartTime(b.data.fechaInicio);
      return tb - ta;
    });

    return items;
  }, [experiencias, estudios]);

  const hasLanguages = idiomas.length > 0;
  const hasTimeline = timelineItems.length > 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Text style={styles.title}>Ingresá tu historial </Text>
        </View>

        {/* Botones de acción con espacio entre sí */}
        <View style={styles.actionsColumn}>
          <ButtonWithIcon
            texto="Agregar experiencia laboral"
            onPress={abrirModalExp}
            icono={iconos.portfolio(20, Colors.violet4)}
            styles={buttonWithIconStyles3}
          />

          <ButtonWithIcon
            texto="Agregar estudio/certificación"
            onPress={abrirModalEdu}
            icono={iconos.libro_abierto(25, Colors.violet4)}
            styles={buttonWithIconStyles3}
          />

          <ButtonWithIcon
            texto="Agregar idioma"
            onPress={abrirModalIdioma}
            icono={iconos.idioma(20, Colors.violet4)}
            styles={buttonWithIconStyles3}
          />
        </View>

        {/* Card blanca con scroll interno (idiomas + timeline) */}
        <View style={styles.card}>
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={styles.cardListContent}
            showsVerticalScrollIndicator
          >
            {/* Idiomas (sin título) */}
            {hasLanguages &&
              idiomas.map((l, idx) => (
                <View key={`lang-${idx}`} style={styles.languageItemRow}>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{l.idioma}</Text>
                  </View>

                  <View style={styles.languageLevelBadge}>
                    <Text style={styles.languageLevelText}>{l.nivel}</Text>
                  </View>

                  <IconButton
                    onPress={() => eliminarIdioma(idx)}
                    sizeButton={28}
                    backgroundColor="transparent"
                    icon={iconos.trash(18, Colors.violet4)}
                    styles={{ button: styles.iconGhost, text: styles.iconGhostTxt }}
                  />
                </View>
              ))}

            {hasLanguages && hasTimeline && <View style={styles.separatorDotted} />}

            {/* Timeline (experiencias + estudios) */}
            {hasTimeline &&
              timelineItems.map((item, index) => {
                const isLast = index === timelineItems.length - 1;
                const isExp = item.kind === 'exp';
                const d: any = item.data;

                const fechaInicio: Date | null = d.fechaInicio;
                const fechaFin: Date | null = d.fechaFin;
                const fechaInicioStr = fechaInicio
                  ? fechaInicio.toLocaleDateString('es-AR')
                  : '—';
                const fechaFinStr = fechaFin
                  ? fechaFin.toLocaleDateString('es-AR')
                  : isExp
                  ? 'Actual'
                  : 'Prevista / Actual';

                const title = isExp
                  ? d.cargo || 'Cargo sin especificar'
                  : d.titulo || 'Título / Certificación';

                const sub = isExp
                  ? `${d.empresa || 'Empresa/Evento'} • ${d.tipoTrabajo || 'Tipo'}`
                  : `${d.institucion || 'Institución'} • ${d.disciplina || 'Disciplina'}`;

                const desc = d.descripcion;

                const onEdit = () => {
                  if (isExp) editarExp(item.index);
                  else editarEdu(item.index);
                };

                const onDelete = () => {
                  if (isExp) eliminarExp(item.index);
                  else eliminarEdu(item.index);
                };

                return (
                  <View key={`tl-${index}`} style={styles.timelineRow}>
                    <View style={styles.timelineCol}>
                      <View style={styles.timelineDot} />
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>

                    <View style={styles.timelineCardWrapper}>
                      <LinearGradient
                        colors={
                          isExp
                            ? ([Colors.gray1, Colors.white] as const)
                            : ([Colors.violet1, Colors.white] as const)
                        }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.timelineCardInner}
                      >
                        <View style={styles.timelineContentRow}>
                          <View style={styles.timelineTextCol}>
                            <Text style={styles.timelineTitle}>{title}</Text>
                            <Text style={styles.timelineSub}>{sub}</Text>
                            <Text style={styles.timelineDates}>
                              {fechaInicioStr} — {fechaFinStr}
                            </Text>
                            {!!desc && <Text style={styles.timelineDesc}>{desc}</Text>}
                          </View>

                          <View style={styles.timelineActionsRow}>
                            <IconButton
                              onPress={onEdit}
                              sizeButton={28}
                              backgroundColor="transparent"
                              icon={iconos.edit(18, Colors.violet4)}
                              styles={{ button: styles.iconGhost, text: styles.iconGhostTxt }}
                            />
                            <IconButton
                              onPress={onDelete}
                              sizeButton={28}
                              backgroundColor="transparent"
                              icon={iconos.trash(18, Colors.violet4)}
                              styles={{ button: styles.iconGhost, text: styles.iconGhostTxt }}
                            />
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                );
              })}

            {!hasLanguages && !hasTimeline && (
              <View style={styles.cardEmpty}>
                <Text style={styles.cardEmptyText}>
                  Todavía no agregaste experiencias, estudios ni idiomas.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Footer: Siguiente / Omitir */}
        <View style={styles.footer}>
          <Button
            onPress={omitir}
            styles={{
              boton: { ...buttonStyles5.boton, width: 100, alignItems: 'flex-start' },
              texto: { ...buttonStyles5.texto, ...styles.skipButton },
            }}
            texto="Omitir"
          />
          <Button
            texto="Siguiente"
            onPress={siguiente}
            styles={{
              boton: { ...buttonStyles5.boton, width: 100 },
              texto: { ...buttonStyles5.texto, ...styles.nextButton },
            }}
          />
        </View>

        {/* -------- MODAL: EXPERIENCIA -------- */}
        <Modal
          transparent
          animationType="fade"
          visible={expModalAbierto}
          onRequestClose={cerrarModalExp}
        >
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
                      setExpFormField('cargo', it.descripcion);
                      clearCargoSug();
                    }}
                    styles={suggestionsStyles2}
                  />
                </View>

                {/* Tipo de trabajo */}
                <View style={styles.tagsRow}>
                  <Picker
                    label="Tipo de trabajo"
                    value={tipoTrabajoToOption(expForm.tipoTrabajo)}
                    setValue={(opt) => setExpFormField('tipoTrabajo', opt?.name ?? '')}
                    options={tiposTrabajoOptions}
                    styles={{
                      ...pickerStyles1,
                      selector: { ...pickerStyles1.selector, width: 315 },
                    }}
                  />
                </View>

                {/* Empresa / Evento */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={expForm.empresa}
                    onChangeText={(v) => setExpFormField('empresa', v)}
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

                {/* Descripción (opcional) */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={expForm.descripcion}
                    onChangeText={(v) => setExpFormField('descripcion', v)}
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
                        alignItems: 'flex-start',
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

                {/* Fotos (opcionales) */}
                <UploadImagesGrid
                  max={3}
                  thumbSize={90}
                  shape="square"
                  onChange={(files, uris) =>
                    setExpFormField('fotos', { files, uris })
                  }
                />

                {/* Botonera modal */}
                <View style={styles.modalButtons}>
                  <Button
                    texto="Cancelar"
                    onPress={cerrarModalExp}
                    styles={{
                      ...buttonStyles2,
                      boton: {
                        ...buttonStyles2.boton,
                        width: 150,
                        borderRadius: 999,
                      },
                    }}
                  />
                  <Button
                    texto="Guardar"
                    onPress={() => {
                      const ok = guardarExp();
                      if (!ok) {
                        setErrorMessage(
                          formErrorExp || 'Revisá los campos obligatorios.'
                        );
                        setShowError(true);
                      }
                    }}
                    styles={{
                      ...buttonStyles1,
                      boton: {
                        ...buttonStyles1.boton,
                        width: 150,
                        borderRadius: 999,
                      },
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* -------- MODAL: EDUCACIÓN -------- */}
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
                    placeholder="Institución Educativa"
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
                      setEduFormField('institucion', it.descripcion);
                      clearInstSug();
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
                    placeholder="Disciplina Académica"
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
                      setEduFormField('disciplina', it.descripcion);
                      clearDiscSug();
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
                      styles={{
                        ...dpStyles,
                        selector: { ...dpStyles.selector, width: 150 },
                      }}
                      variant="default"
                    />
                  </View>
                  <View style={styles.fieldWrap}>
                    <DatePicker
                      date={fechaFinEdu}
                      label="Fecha Fin"
                      setDate={setFechaFinEdu}
                      styles={{
                        ...dpStyles,
                        selector: { ...dpStyles.selector, width: 150 },
                      }}
                      variant="default"
                    />
                  </View>
                </View>

                {/* Descripción (opcional) */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={eduForm.descripcion}
                    onChangeText={(v) => setEduFormField('descripcion', v)}
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
                        alignItems: 'flex-start',
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

                {/* Fotos diploma (opcionales) */}
                <UploadImagesGrid
                  max={3}
                  thumbSize={90}
                  shape="square"
                  onChange={(files, uris) =>
                    setEduFormField('fotos', { files, uris })
                  }
                />

                {/* Botonera modal */}
                <View style={styles.modalButtons}>
                  <Button
                    texto="Cancelar"
                    onPress={cerrarModalEdu}
                    styles={{
                      ...buttonStyles2,
                      boton: {
                        ...buttonStyles2.boton,
                        width: 150,
                        borderRadius: 999,
                      },
                    }}
                  />
                  <Button
                    texto="Guardar"
                    onPress={() => {
                      const ok = guardarEdu();
                      if (!ok) {
                        setErrorMessage(
                          formErrorEdu || 'Revisá los campos obligatorios.'
                        );
                        setShowError(true);
                      }
                    }}
                    styles={{
                      ...buttonStyles1,
                      boton: {
                        ...buttonStyles1.boton,
                        width: 150,
                        borderRadius: 999,
                      },
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* -------- MODAL: IDIOMA -------- */}
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

                <View>
                  <DropDown2
                    name="Idioma"
                    placeholder="Elegí un idioma"
                    id={
                      idiomaForm.idioma
                        ? languageOptions.find((o) => o.name === idiomaForm.idioma)?.id ?? ''
                        : ''
                    }
                    options={languageOptions.map((o) => ({
                      id: o.id,
                      name: o.name,
                    }))}
                    onValueChange={(id) => {
                      const selected = languageOptions.find(
                        (o) => String(o.id) === String(id)
                      );
                      setIdiomaFormField('idioma', selected?.name ?? '');
                    }}
                    styles={dropdown2Styles1}
                  />
                </View>

                <View>
                  <DropDown2
                    name="Nivel"
                    placeholder="Seleccioná tu nivel"
                    id={idiomaForm.nivelId != null ? String(idiomaForm.nivelId) : ''}
                    options={levelOptions}
                    onValueChange={(id) => {
                      const sel = levelOptions.find((o) => o.id === id);
                      setIdiomaFormField('nivel', sel?.name ?? '');
                      setIdiomaFormField('nivelId', sel ? Number(sel.id) : null);
                    }}
                    styles={dropdown2Styles1}
                  />
                </View>

                {/* Nota opcional */}
                <View style={styles.fieldWrap}>
                  <Input
                    value={idiomaForm.notas}
                    onChangeText={(v) => setIdiomaFormField('notas', v)}
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
                        alignItems: 'flex-start',
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

                <View style={styles.modalButtons2}>
                  <Button
                    texto="Cancelar"
                    onPress={cerrarModalIdioma}
                    styles={{
                      ...buttonStyles2,
                      boton: {
                        ...buttonStyles2.boton,
                        width: 150,
                        borderRadius: 999,
                      },
                    }}
                  />
                  <Button
                    texto="Guardar"
                    onPress={() => {
                      const ok = guardarIdioma();
                      if (!ok) {
                        setErrorMessage(
                          formErrorIdioma || 'Revisá los campos obligatorios.'
                        );
                        setShowError(true);
                      }
                    }}
                    styles={{
                      ...buttonStyles1,
                      boton: {
                        ...buttonStyles1.boton,
                        width: 150,
                        borderRadius: 999,
                      },
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ClickWindow de errores */}
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
    </TouchableWithoutFeedback>
  );
}
