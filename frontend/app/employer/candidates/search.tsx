import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { Input } from '@/components/input/Input';
import { DropDown2 } from '@/components/picker/DropDown2';
import Suggestions from '@/components/picker/Suggestions';
import DatePicker from '@/components/picker/DatePicker';
import TimePicker from '@/components/picker/TimePicker';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { IconButton } from '@/components/button/IconButton';
import { ClickWindow } from '@/components/window/ClickWindow';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { dropdown2Styles1 } from '@/styles/components/picker/dropdown2Styles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { buttonWithIconStyles1 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles1';
import { iconButtonStyles1 } from '@/styles/components/button/iconButtonStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { useSearchEmployees } from '@/hooks/employer/candidates/useSearchEmployees';
import { searchEmpScreenStyles as s } from '@/styles/app/employer/candidates/searchEmployeesStyles';
import { suggestionsStyles2 } from '@/styles/components/picker/suggestionsStyles/suggestionsStyles2';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';
import { Button } from '@/components/button/Button';
import { useRouter } from 'expo-router';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';

type Sug = { descripcion: string; placeId: string };

const SWIPE_THRESHOLD = 60;

const fmt = (d: Date | null) => {
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
};

export default function SearchEmployeesScreen() {
  const {
    // UI
    activeBubble, toggleBubble,
    showError, errorMessage, closeError,

    // ubicación
    provinciaOptions,
    localidadInput, localidadSug,
    selectedProvincia,
    onProvinciaPick, onLocalidadChange, onLocalidadPick,

    // disponibilidad
    startDate, endDate, isRange,
    setSingleDate, applyDateSelection,
    startTime, endTime, setStartTime, setEndTime,
    showTimePickers, normalizeSingleDayTimes,

    // historial
    ratingMin, jobsMin, setJobsMin, decRating, incRating,

    // acciones
    validarParaBuscar, limpiarTodo, onBuscar,
  } = useSearchEmployees();

  const provinciaOpts = useMemo(
    () => provinciaOptions.map(p => ({ id: p, name: p })),
    [provinciaOptions]
  );

  // Abre el DatePicker desde cualquiera de los campos
  const [openDate, setOpenDate] = useState(false);

  // ===== Overrides locales (TS/ESLint-safe) =====
  const inputFullBorder = StyleSheet.create({
    inputContainer: {
      ...StyleSheet.flatten(inputStyles1.inputContainer),
      width: '100%',
      borderWidth: 1,
      borderColor: Colors.gray12,
    },
    input: { ...StyleSheet.flatten(inputStyles1.input) },
  });

  const dd2FullBorder = StyleSheet.create({
    input: {
      ...StyleSheet.flatten(dropdown2Styles1.input),
      width: '100%',
      borderWidth: 1,
      borderColor: Colors.gray12,
      marginBottom: 12,
      fontSize: 16,
      fontFamily: 'interMedium',
      color: Colors.black,
    },
    modalOverlay: { ...StyleSheet.flatten(dropdown2Styles1.modalOverlay) },
    modalContent: { ...StyleSheet.flatten(dropdown2Styles1.modalContent) },
    optionText: { ...StyleSheet.flatten(dropdown2Styles1.optionText) },
    option: { ...StyleSheet.flatten(dropdown2Styles1.option) },
    label: { ...StyleSheet.flatten(dropdown2Styles1.label) },
    placeholder: { ...StyleSheet.flatten(dropdown2Styles1.placeholder) },
  });

  const timeFullBorder = StyleSheet.create({
    ...Object.fromEntries(
      Object.entries(timePickerStyles1).map(([k]) => [k, StyleSheet.flatten((timePickerStyles1 as any)[k])])
    ) as any,
    selector: {
      ...StyleSheet.flatten(timePickerStyles1.selector),
      width: '100%',
      borderWidth: 1,
      borderColor: Colors.gray12,
      padding: 15,
    },
  });

  const btnBuscarFull = StyleSheet.create({
    boton: {
      ...StyleSheet.flatten(buttonWithIconStyles1.boton),
      width: 180,
      height: 50,
      borderRadius: 20,
      backgroundColor: Colors.violet4,
      borderWidth: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    icono: { ...StyleSheet.flatten(buttonWithIconStyles1.icono) },
    texto: {
      ...StyleSheet.flatten(buttonWithIconStyles1.texto),
      color: Colors.white,
      fontSize: 16,
      fontFamily: 'interBold',
      marginLeft: 15,
    },
  });

  const router = useRouter();

  const onSwipe = (e: PanGestureHandlerStateChangeEvent) => {
    const { oldState, translationX } = e.nativeEvent as any;
    if (oldState === 4 || oldState === 5 || oldState === 2) {
      if (translationX <= -SWIPE_THRESHOLD) {
        router.replace('/employer/candidates');
      }
    }
  };

  return (
    <PanGestureHandler
      onHandlerStateChange={onSwipe}
      activeOffsetY={[-12, 12]}
      >
      <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
        <View style={s.pagePadding}>
          <Text style={s.h1}>Criterios</Text>

          {/* ===== Globo: Ubicación ===== */}
          <Pressable
            style={[s.bubbleCard, { overflow: 'visible' }]}
            onPress={() => activeBubble !== 'location' && toggleBubble('location')}
            disabled={activeBubble === 'location'}
          >
            {activeBubble !== 'location' ? (
              <Text style={s.bubbleHeaderText}>Ubicación</Text>
            ) : (
              <>
                <View style={s.heroRow}> 
                  <Image source={require('@/assets/images/jex/Jex-Busqueda-Ubicacion.png')} style={s.heroImg}/> 
                  <Text style={s.heroTitleViolet}>Ubicación del Empleado</Text> 
                </View>

                <View style={{ gap: 12 }}>
                  {/* Provincia (DropDown2) igual que antes */}
                  <DropDown2
                    name="Provincia"
                    placeholder="Provincia"
                    options={provinciaOpts}
                    id={selectedProvincia ? selectedProvincia.placeId : ''}
                    onValueChange={(id) => {
                      const opt = provinciaOpts.find(o => String(o.id) === String(id));
                      if (opt) onProvinciaPick({ descripcion: opt.name, placeId: String(opt.id) });
                    }}
                    styles={dd2FullBorder}
                  />

                  {/* ⬇️ Localidad recién cuando hay provincia, con ANCLA relativo */}
                  {!!selectedProvincia && (
                    <View style={{ position: 'relative', zIndex: 10 /* asegura que salga arriba */ }}>
                      <Input
                        styles={inputFullBorder}
                        placeholder="Localidad"
                        value={localidadInput}
                        onChangeText={onLocalidadChange}
                        showIcon={false}
                      />

                      {localidadSug.length > 0 && (
                        <Suggestions
                          sugerencias={localidadSug}
                          onSeleccionar={(item: Sug) => onLocalidadPick(item)}
                          styles={suggestionsStyles2}
                        />
                      )}
                    </View>
                  )}
                </View>
              </>
            )}
          </Pressable>

          {/* ===== Globo: Disponibilidad ===== */}
          <Pressable
            style={s.bubbleCard}
            onPress={() => activeBubble !== 'availability' && toggleBubble('availability')}
            disabled={activeBubble === 'availability'}
          >
            {activeBubble !== 'availability' ? (
              <Text style={s.bubbleHeaderText}>Disponibilidad</Text>
            ) : (
              <View style={s.splitRow}>
                {/* Izquierda: campos de fecha + horas */}
                <View style={s.splitLeft}>
                  {/* Campo Fecha Inicio */}
                  <Pressable onPress={() => setOpenDate(true)}>
                    <View style={inputFullBorder.inputContainer as any}>
                      <Text style={{ ...(inputFullBorder.input as any), color: startDate ? Colors.black : Colors.gray3 }}>
                        {startDate ? fmt(startDate) : 'Fecha'}
                      </Text>
                    </View>
                  </Pressable>

                  {/* Campo Fecha Fin (solo si hay rango) */}
                  {isRange && (
                    <Pressable onPress={() => setOpenDate(true)}>
                      <View style={inputFullBorder.inputContainer as any}>
                        <Text style={{ ...(inputFullBorder.input as any), color: endDate ? Colors.black : Colors.gray3 }}>
                          {endDate ? fmt(endDate) : 'Fecha Fin'}
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {/* DatePicker inline con modo único/rango */}
                  <DatePicker
                    variant="inline"
                    open={openDate}
                    onOpenChange={setOpenDate}
                    label=""
                    date={startDate}
                    setDate={(d) => setSingleDate(d)}
                    allowRange
                    allowModeToggle
                    dateRange={{ start: startDate, end: endDate }}
                    setDateRange={({ start, end }) => applyDateSelection(start ?? null, end ?? null)}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 2, 11, 31)}
                    styles={datePickerStyles1}
                  />

                  {/* Horas solo si hay fecha */}
                  {showTimePickers && (
                    <>
                      <TimePicker
                        label="Hora Inicio"
                        time={startTime}
                        setTime={(t) => { setStartTime(t); normalizeSingleDayTimes(); }}
                        styles={timeFullBorder}
                      />
                      <TimePicker
                        label="Hora Fin"
                        time={endTime}
                        setTime={(t) => { setEndTime(t); normalizeSingleDayTimes(); }}
                        styles={timeFullBorder}
                      />
                    </>
                  )}
                </View>

                {/* Derecha: imagen + título */}
                <View style={s.splitRight}>
                  <Image source={require('@/assets/images/jex/Jex-Busqueda-Disponibilidad.png')} style={s.heroImg2}/>
                  <Text style={s.heroTitleVioletRight}>Disponibilidad del Empleado</Text>
                </View>
              </View>
            )}
          </Pressable>

          {/* ===== Globo: Historial ===== */}
          <Pressable
            style={s.bubbleCard}
            onPress={() => activeBubble !== 'history' && toggleBubble('history')}
            disabled={activeBubble === 'history'}
          >
            {activeBubble !== 'history' ? (
              <Text style={s.bubbleHeaderText}>Historial</Text>
            ) : (
              <>
                <View style={s.heroRow}>
                  <View>
                    <Text style={s.heroTitleViolet}>Historial de Trabajo</Text>
                    <Text style={s.heroSubtitle}>(mínimo)</Text>
                  </View>
                  <Image source={require('@/assets/images/jex/Jex-Busqueda-Historial.png')} style={s.heroImg3}/>
                </View>

                <View style={s.ratingControlRow}>
                  {ratingMin > 0 && (
                    <IconButton
                      content="−"
                      contentColor={Colors.violet4}
                      sizeContent={22}
                      onPress={decRating}
                      styles={iconButtonStyles1}
                      backgroundColor={Colors.gray12}
                    />
                  )}

                  <Text style={s.ratingNumber}>
                    {Number.isInteger(ratingMin) ? String(ratingMin) : ratingMin.toFixed(1)}
                  </Text>

                  {ratingMin < 5 && (
                    <IconButton
                      content="+"
                      contentColor={Colors.violet4}
                      sizeContent={22}
                      onPress={incRating}
                      styles={iconButtonStyles1}
                      backgroundColor={Colors.gray12}
                    />
                  )}

                  <View style={s.starsRight}>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const fullUntil = Math.floor(ratingMin);
                      const isHalf = ratingMin - fullUntil === 0.5 && i === fullUntil;
                      if (i < fullUntil) return iconos.full_star(22, Colors.violet4, i);
                      if (isHalf)       return iconos.half_star(22, Colors.violet4, i);
                      return              iconos.empty_star(22, Colors.gray3, i);
                    })}
                  </View>
                </View>

                <Input
                  styles={inputFullBorder}
                  placeholder="Cantidad Trabajos"
                  keyboardType="numeric"
                  value={jobsMin != null ? String(jobsMin) : ''}
                  onChangeText={(t) => setJobsMin(t === '' ? null : Number(t.replace(/[^0-9]/g, '')))}
                  showIcon={false}
                />
              </>
            )}
          </Pressable>

          {/* ===== Footer acciones ===== */}
          <View style={s.actionsRow}>

            <Button
              texto="Eliminar Criterios"
              onPress={limpiarTodo}
              styles={{...buttonStyles5, boton:{...buttonStyles5.boton, alignItems: 'center', width: 140}}}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <ButtonWithIcon
                texto="Buscar"
                onPress={() => { if (validarParaBuscar()) onBuscar(); }}
                icono={<Ionicons name="search" size={22} color={Colors.white} />}
                styles={btnBuscarFull}
              />
            </View>
          </View>

          {/* ===== Modal de error (ClickWindow) ===== */}
          <ClickWindow
            title="Error"
            visible={showError}
            message={errorMessage}
            onClose={closeError}
            styles={clickWindowStyles1}
            icono={iconos.error_outline(30, Colors.white)}
            buttonText="Entendido"
          />
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
}
