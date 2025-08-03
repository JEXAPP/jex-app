import { iconos } from '@/constants/iconos';
import { useCreateEvent } from '@/hooks/create-event/useCreateEvent';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { tempWindowStyles1 } from '@/styles/components/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import {
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { Button } from '../../components/Button';
import { ClickWindow } from '../../components/ClickWindow';
import { Input } from '../../components/Input';
import { TempWindow } from '../../components/TempWindow';
import { createEventStyles as styles } from '../../styles/app/create-event/createEventStyles';
import DatePicker from '@/components/DatePicker';
import { datePickerStyles1 } from '@/styles/components/datePickerStyles1';
import PlaceSuggestions from '@/components/PlaceSuggestions';
import { placeSuggestionsStyles1 } from '@/styles/components/placeSuggestionsStyles1';
import { timePickerStyles1 } from '@/styles/components/timePickerStyles1';
import TimePicker from '@/components/TimePicker';
import { Picker } from '@/components/Picker';
import { pickerStyles1 } from '@/styles/components/pickerStyles1';
import { CharCounter } from '@/components/CharCounter';
import { charCounterStyles1 } from '@/styles/components/charCounterStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';

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
                  height: 120,
                  textAlignVertical: 'top',
                },
                inputContainer: inputStyles1.inputContainer
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

          <PlaceSuggestions
            sugerencias={sugerencias}
            onSeleccionar={seleccionarUbicacion}
            styles={placeSuggestionsStyles1}
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
          icono={iconos.error(24, Colors.violet4)}
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
