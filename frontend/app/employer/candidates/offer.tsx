import React, { useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { Input } from '@/components/input/Input';
import DatePicker from '@/components/picker/DatePicker';
import TimePicker from '@/components/picker/TimePicker';
import { DropDown2 } from '@/components/picker/DropDown2';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { dropdown2Styles1 } from '@/styles/components/picker/dropdown2Styles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { useCreateOffer } from '@/hooks/employer/candidates/useCreateOffer';
import { createOfferStyles as s } from '@/styles/app/employer/candidates/createOfferStyles';

export default function CreateOfferScreen() {
  const {
    source, loading, error,
    header,
    selectorOpen, events, vacancies,
    selectedEventId, setSelectedEventId,
    selectedVacancyId, setSelectedVacancyId,
    confirmSelector, onChangeEvent,

    vacancyDetail, availableShifts,
    chosenShiftId, setChosenShiftId,

    expirationDate, setExpirationDate,
    expirationTime, setExpirationTime,
    comments, setComments,
    ddmmyyyyToLong, money,

    submitOffer,
  } = useCreateOffer();

  // estilos locales mínimos (reutilizando los tuyos)
  const inputFull = { inputContainer: { ...inputStyles1.inputContainer, width: '100%' }, input: inputStyles1.input };
  const timeStyles = {
    ...timePickerStyles1,
    selector: { ...timePickerStyles1.selector, width: '100%', borderWidth: 1, borderColor: Colors.gray12, padding: 14 },
  } as any;

  const shiftCards = useMemo(() => {
    return (availableShifts || []).map(sh => ({
      id: sh.id,
      timeLabel: `${sh.start_time}hs - ${sh.end_time}hs`,
      dateLabel: ddmmyyyyToLong(sh.start_date),
      payLabel: money(sh.payment),
    }));
  }, [availableShifts]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.container}>
      <View style={s.headerRow}>
        <Pressable style={s.backBtn} onPress={() => history.back()}>
          {iconos.flechaIzquierdaVolver(24, Colors.violet4)}
        </Pressable>
      </View>

      {/* ===== Modal de selección previa (sólo búsqueda) ===== */}
      <Modal visible={selectorOpen} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Elegí evento y vacante</Text>

            <DropDown2
              name="Evento"
              placeholder="Seleccionar evento"
              options={events.map(e => ({ id: String(e.id), name: e.name }))}
              id={selectedEventId}
              onValueChange={(id) => setSelectedEventId(id)}
              styles={dropdown2Styles1}
            />

            <DropDown2
              name="Vacante"
              placeholder="Seleccionar vacante"
              options={vacancies.map(v => ({ id: String(v.id), name: v.name }))}
              id={selectedVacancyId}
              onValueChange={setSelectedVacancyId}
              styles={dropdown2Styles1}
            />

            <Button
              texto="Continuar"
              onPress={confirmSelector}
              styles={{ boton: s.modalBtn, texto: s.modalBtnText } as any}
            />
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Encabezado (si viene de postulación) */}
        {header && (
          <View style={s.hero}>
            <View style={s.heroAvatar}>{iconos.usuario_validado(18, Colors.white)}</View>
            <Text style={s.heroName}>{header.name}</Text>
          </View>
        )}

        {/* Detalle de la vacante */}
        <View style={s.card}>
          <Text style={s.roleTitle}>{vacancyDetail?.job_type_name || '—'}</Text>
          {!!vacancyDetail?.description && (
            <Text style={s.roleDesc}>{vacancyDetail.description}</Text>
          )}

          {!!(vacancyDetail?.requirements?.length) && (
            <>
              <Text style={s.sectionTitle}>Requerimientos</Text>
              {vacancyDetail!.requirements.map((r, idx) => (
                <Text key={idx} style={s.reqItem}>• {r.description}</Text>
              ))}
            </>
          )}
        </View>

        {/* Turnos disponibles */}
        <Text style={s.sectionTitle}>Seleccioná el Turno</Text>
        {shiftCards.map(card => (
          <Pressable key={card.id} style={[s.shiftItem, chosenShiftId === card.id && s.shiftItemActive]}
            onPress={() => setChosenShiftId(card.id)}>
            <Text style={s.shiftTime}>{card.timeLabel}</Text>
            <Text style={s.shiftPay}>{card.payLabel}</Text>
            <Text style={s.shiftDate}>{card.dateLabel}</Text>
          </Pressable>
        ))}

        {/* Vencimiento */}
        <Text style={s.sectionTitle}>Vencimiento</Text>
        <DatePicker
          variant="inline"
          open={true}
          onOpenChange={() => {}}
          label=""
          date={expirationDate}
          setDate={setExpirationDate as any}
          styles={datePickerStyles1}
          minimumDate={new Date()}
          maximumDate={new Date(new Date().getFullYear() + 1, 11, 31)}
        />
        <View style={{ height: 8 }} />
        <TimePicker
          label="Hora de vencimiento"
          time={expirationTime}
          setTime={setExpirationTime as any}
          styles={timeStyles}
        />

        {/* Comentarios */}
        <Text style={s.sectionTitle}>Comentarios Adicionales</Text>
        <Input
          styles={inputFull as any}
          placeholder="Escribí un comentario (opcional)"
          value={comments}
          onChangeText={setComments}
          multiline
        />

        <View style={{ height: 10 }} />
        <ButtonWithIcon
          texto="Generar Oferta"
          onPress={submitOffer}
          icono={<Ionicons name="document-text-outline" size={20} color={Colors.white} />}
          styles={{ boton: s.ctaBtn, texto: s.ctaText, icono: s.ctaIcon } as any}
        />

        {!!error && <Text style={s.errorText}>{error}</Text>}
        {loading && <Text style={s.loadingText}>Cargando…</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}


