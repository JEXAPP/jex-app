import React, { useRef, useState } from 'react';
import { Modal, ScrollView, Text, View, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/themes/colors';
import ImageOnline from '@/components/others/ImageOnline';
import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import DatePicker from '@/components/picker/DatePicker';
import TimePicker from '@/components/picker/TimePicker';
import { DropDown2 } from '@/components/picker/DropDown2';
import { useCreateOffer, RouteParams } from '@/hooks/employer/candidates/useCreateOffer';
import { createOfferStyles as s } from '@/styles/app/employer/candidates/createOfferStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { dropdown2Styles1 } from '@/styles/components/picker/dropdown2Styles1';
import { iconos } from '@/constants/iconos';
import { CharCounter } from '@/components/others/CharCounter';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles/buttonStyles2';
import { Borders } from '@/themes/borders';

/** Mostrar fechas tipo “Sábado 14 de septiembre 2025” */
const formatFechaLarga = (fechaStr: string): string => {
  if (!fechaStr) return '';
  try {
    let fecha: Date;
    if (fechaStr.includes('/')) {
      const [d, m, y] = fechaStr.split('/').map(Number);
      fecha = new Date(y, m - 1, d);
    } else {
      const [y, m, d] = fechaStr.split('-').map(Number);
      fecha = new Date(y, m - 1, d);
    }
    const out = fecha
      .toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      .replace(',', '');
    return out.charAt(0).toUpperCase() + out.slice(1);
  } catch {
    return fechaStr;
  }
};

/** Helpers para maximumDate del DatePicker */
const parseFecha = (s?: string | null): Date | null => {
  if (!s) return null;
  try {
    if (s.includes('/')) {
      const [d, m, y] = s.split('/').map(Number);
      return new Date(y, m - 1, d);
    }
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  } catch {
    return null;
  }
};
const subDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - n);

export default function CreateOfferScreen() {
  // ahora puede venir también: vacancyId, personName, photoUrl (SOLO en search)
  const { source, id, vacancyId, personName, photoUrl } =
    useLocalSearchParams<RouteParams>() as RouteParams;
  const router = useRouter();

  const {
    employeeName, employeeImage,
    vacancyDetail, selectedShiftIds, setSelectedShiftIds, moneyARS, hhmmLabel,
    expDate, setExpDate, expTime, setExpTime, comment, setComment,
    modalVisible, setModalVisible,
    events, selectedEventId, vacancyOptions, selectedVacancyId,
    onSelectEvent, onSelectVacancy, handleCancel, loading,
    submitOffer,
  } = useCreateOffer({ source, id, vacancyId, personName, photoUrl });

  // ======= Animación de éxito embebida en esta pantalla =======
  const [showSuccess, setShowSuccess] = useState(false);
  const coverY = useRef(new Animated.Value(-320)).current;
  const contentX = useRef(new Animated.Value(-40)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const runSuccessAnim = () => {
    setShowSuccess(true);
    coverY.setValue(-320);
    contentX.setValue(-40);
    contentOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(coverY, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentX, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => router.replace('/employer/candidates'), 900);
    });
  };

  const onSubmit = async () => {
    try {
      await submitOffer();
      runSuccessAnim();
    } catch (e) {
      // si falla no mostramos animación
      console.log('submitOffer error', e);
    }
  };

  const shiftCount = vacancyDetail?.shifts?.length ?? 0;
  const isSingleShift = shiftCount === 1;
  const shiftsTitle = isSingleShift ? 'Turno disponible' : 'Seleccioná el turno';

  // maximumDate = 2 días antes del turno seleccionado (o del único turno)
  let maxExpireDate: Date | undefined;
  if (isSingleShift && vacancyDetail?.shifts?.[0]?.start_date) {
    const d = parseFecha(vacancyDetail.shifts[0].start_date);
    if (d) maxExpireDate = subDias(d, 2);
  } else if (!isSingleShift && selectedShiftIds.length > 0) {
    const selectedDates = vacancyDetail!.shifts
      .filter(sh => selectedShiftIds.includes(sh.id))
      .map(sh => parseFecha(sh.start_date))
      .filter((d): d is Date => !!d)
      .sort((a, b) => +a - +b);
    if (selectedDates[0]) maxExpireDate = subDias(selectedDates[0], 2);
  }

  return (
    <SafeAreaView edges={['top']} style={s.container}>
      {/* HEADER */}
      <View style={s.headerCard}>
        <ImageOnline
          imageUrl={employeeImage}
          size={56}
          shape="circle"
          fallback={require('@/assets/images/jex/Jex-Postulantes-Default.png')}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.headerName}>{employeeName}</Text>
          <View style={s.linkedRow}>
            {iconos.usuario_validado(16, Colors.white)}
            <Text style={s.linkedText}>Usuario Vinculado</Text>
          </View>
        </View>
      </View>

      {/* MODAL SELECCIÓN (solo si no vino vacancyId por params) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Elegí tu evento y vacante</Text>

            <DropDown2
              name="Evento"
              placeholder="Evento"
              id={selectedEventId ? String(selectedEventId) : ''}
              options={events.map(e => ({ id: String(e.event_id), name: e.event_name }))}
              onValueChange={(id) => onSelectEvent(Number(id))}
              styles={dropdown2Styles1}
            />

            {selectedEventId ? (
              <DropDown2
                name="Vacante"
                placeholder="Elegí una vacante"
                id={selectedVacancyId ? String(selectedVacancyId) : ''}
                options={vacancyOptions.map(v => ({ id: String(v.id), name: v.name }))}
                onValueChange={(id) => onSelectVacancy(Number(id))}
                styles={dropdown2Styles1}
              />
            ) : (
              <></>
            )}

            <Button
              texto="Cancelar"
              onPress={() => router.back()}
              styles={{
                ...buttonStyles1,
                boton: { ...buttonStyles1.boton, backgroundColor: Colors.gray12, width: 100, borderRadius: Borders.rounded },
                texto: { ...buttonStyles1.texto, color: Colors.black },
              }}
            />
          </View>
        </View>
      </Modal>

      {/* CONTENIDO */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {!!vacancyDetail && (
          <View>
            <Text style={s.detailTitle}>{vacancyDetail.job_type_name}</Text>
            {!!vacancyDetail.description && <Text style={s.detailDesc}>{vacancyDetail.description}</Text>}
            {!!(vacancyDetail.requirements?.length) && (
              <View style={{ marginTop: 6 }}>
                <Text style={s.detailReqTitle}>Requerimientos:</Text>
                {vacancyDetail.requirements.map((r: any, idx: number) => (
                  <Text key={idx} style={s.detailReqItem}>
                    {`${idx + 1}. ${typeof r === 'string' ? r : r?.description ?? ''}`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Turnos */}
        {shiftCount > 0 ? (
          <>
            <Text style={s.sectionTitle}>{shiftsTitle}</Text>

            {vacancyDetail!.shifts.map((sh) => {
              const left = `${hhmmLabel(sh.start_time)} - ${hhmmLabel(sh.end_time)}`;
              const right = moneyARS(sh.payment);
              const dateLabel = formatFechaLarga(sh.start_date);
              const selected = selectedShiftIds.includes(sh.id);

              return (
                <TouchableOpacity
                  key={sh.id}
                  disabled={isSingleShift}
                  onPress={() =>
                    setSelectedShiftIds(prev =>
                      prev.includes(sh.id) ? prev.filter(id => id !== sh.id) : [...prev, sh.id]
                    )
                  }
                  activeOpacity={0.9}
                  style={[
                    buttonStyles1.boton,
                    s.shiftBlock,
                    (selected || isSingleShift) && s.shiftBlockSelected,
                  ]}
                >
                  <View style={s.shiftRow}>
                    <Text style={[buttonStyles1.texto, s.shiftTime, (selected || isSingleShift) && s.shiftTimeSelected]}>
                      {left}
                    </Text>
                    <Text style={[buttonStyles1.texto, s.shiftPay, (selected || isSingleShift) && s.shiftPaySelected]}>
                      {right}
                    </Text>
                  </View>
                  <Text style={[s.shiftDateLine, (selected || isSingleShift) && s.shiftDateLineSelected]}>
                    {dateLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </>
        ) : null}

        {/* Comentarios */}
        <Text style={s.sectionTitle}>Escribí un comentario</Text>
        <Input
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={5}
          maxLength={200}
          placeholder="Comentario adicional"
          styles={{
            input: inputStyles1.input,
            inputContainer: { ...inputStyles1.inputContainer, height: 120, alignItems: 'flex-start' },
          }}
        />
        <CharCounter current={comment.length} max={200} styles={charCounterStyles1} />

        {/* Vencimiento */}
        <Text style={s.sectionTitle}>Ingresá vencimiento de oferta</Text>
        <View style={s.shiftRow}>
          <DatePicker
            label="Fecha"
            date={expDate}
            setDate={setExpDate}
            minimumDate={new Date()}
            maximumDate={maxExpireDate}
            styles={{ ...datePickerStyles1, selector: { ...datePickerStyles1.selector, width: 200 } }}
          />
          <TimePicker
            label="Hora"
            time={expTime}
            setTime={setExpTime}
            styles={{ ...timePickerStyles1, selector: { ...timePickerStyles1.selector, width: 140 } }}
          />
        </View>

        {/* Botones */}
        <View style={s.buttonRow}>
          <Button
            texto="Cancelar"
            onPress={handleCancel}
            styles={{ texto: buttonStyles2.texto, boton: { ...buttonStyles2.boton, width: 140 } }}
          />
          <Button
            onPress={onSubmit}
            styles={{ texto: buttonStyles1.texto, boton: { ...buttonStyles1.boton, width: 200 } }}
            texto="Generar Oferta"
            loading={loading}
          />
        </View>
      </ScrollView>

      {/* ===== Overlay de confirmación (misma página) ===== */}
      {showSuccess && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
            backgroundColor: Colors.violet4, alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Animated.View
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
              backgroundColor: Colors.violet4, borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
              transform: [{ translateY: coverY }],
            }}
          />
          <Animated.View style={{ alignItems: 'center', opacity: contentOpacity, transform: [{ translateX: contentX }] }}>
            <Image
              source={require('@/assets/images/jex/Jex-Oferta-Generada.png')}
              style={{ width: 280, height: 280, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 32, fontFamily: 'interBold', color: 'white', marginTop: 6 }}>
              Oferta Enviada
            </Text>
            <Text style={{ fontSize: 18, fontFamily: 'interLightItalic', color: 'white', opacity: 0.85, marginTop: 6 }}>
              Te avisaremos su respuesta
            </Text>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}
