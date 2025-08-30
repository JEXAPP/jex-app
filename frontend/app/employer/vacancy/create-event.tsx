import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { CharCounter } from '@/components/others/CharCounter';
import DatePicker from '@/components/picker/DatePicker';
import { Picker } from '@/components/picker/Picker';
import Suggestions from '@/components/picker/Suggestions';
import TimePicker from '@/components/picker/TimePicker';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useCreateEvent } from '@/hooks/employer/vacancy/useCreateEvent';
import { createEventStyles as styles } from '@/styles/app/employer/vacancy/createEventStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import { pickerStyles1 } from '@/styles/components/picker/pickerStyles1';
import { suggestionsStyles1 } from '@/styles/components/picker/suggestionsStyles/suggestionsStyles1';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, ScrollView, Text, TouchableWithoutFeedback, View, } from 'react-native';

export default function CreateEventScreen() {
  const {
    nombreEvento,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    sugerencias,
    horaInicio,
    horaFin,
    rubros,
    selectedRubro,
    loading,
    setSelectedRubro,
    seleccionarUbicacion,
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    handleCrearEvento,
    handleUbicacion,
    setHoraInicio,
    setHoraFin,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    continuarHabilitado
  } = useCreateEvent();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Evento</Text>
          <Image
            source={require('@/assets/images/jex/Jex-Diseñando.png')}
            style={styles.image}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          <Input
            placeholder="Nombre del evento"
            value={nombreEvento}
            onChangeText={setNombreEvento}
            styles={inputStyles1}
          />

          <View style={styles.description}>

            <Input
              placeholder="Descripción del evento"
              value={descripcionEvento}
              onChangeText={setDescripcionEvento}
              styles={{
                input: {
                  ...inputStyles1.input,
                  marginTop: 8,
                },
                inputContainer: {...inputStyles1.inputContainer, height: 125, alignItems: 'flex-start'}
              }}
              multiline
              maxLength={200}
            />

            <CharCounter 
                current={descripcionEvento.length} 
                max={200} 
                styles={charCounterStyles1}
            />

          </View>

          <Picker
            label="Rubro del Evento"
            options={rubros}
            value={selectedRubro}
            setValue={setSelectedRubro}
            styles={pickerStyles1}
          />

          <Suggestions
            sugerencias={sugerencias}
            onSeleccionar={seleccionarUbicacion}
            styles={suggestionsStyles1}
          />

          <Input
            placeholder="Ubicación"
            value={ubicacionEvento}
            onChangeText={handleUbicacion}
            styles={inputStyles1}
          />

          <View style={styles.row1}>
              <DatePicker
                label="Fecha de Inicio"
                date={fechaInicioEvento}
                setDate={setFechaInicioEvento}
                minimumDate={(() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  return d;
                })()}
                maximumDate={(() => {
                  const d = new Date();
                  d.setFullYear(d.getFullYear() + 1);
                  d.setMonth(11);
                  d.setDate(31);
                  return d;
                })()}
                styles={{...datePickerStyles1,selector: {...datePickerStyles1.selector, width: 200,}}}
              />
              <TimePicker
                time={horaInicio}
                setTime={setHoraInicio}
                label="Hora Inicio"
                styles={{...timePickerStyles1,selector: {...timePickerStyles1.selector,width: 120,}}}
              />
          </View>

          <View style={styles.row2}>
              <DatePicker
                label="Fecha de Fin"
                date={fechaFinEvento}
                setDate={setFechaFinEvento}
                styles={{...datePickerStyles1,selector: {...datePickerStyles1.selector,width: 200,}}}
                minimumDate={(() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  return d;
                })()}
                maximumDate={(() => {
                  const d = new Date();
                  d.setFullYear(d.getFullYear() + 1);
                  d.setMonth(11);
                  d.setDate(31);
                  return d;
                })()}
              />
              <TimePicker
                time={horaFin}
                setTime={setHoraFin}
                label="Hora Fin"
               styles={{...timePickerStyles1,selector: {...timePickerStyles1.selector,width: 120,}}}
              />
          </View>

          <View style={styles.button}>

            <Button
              texto="Validar"
              onPress={handleCrearEvento}
              styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
              disabled={!continuarHabilitado}
              loading={loading}
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
      </View>
    </TouchableWithoutFeedback>
  );
}
