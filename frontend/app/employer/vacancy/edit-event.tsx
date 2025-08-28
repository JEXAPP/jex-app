import { CharCounter } from '@/components/others/CharCounter';
import { ClickWindow } from '@/components/window/ClickWindow';
import DatePicker3 from '@/components/picker/DatePicker3';
import { Picker } from '@/components/picker/Picker';
import TimePicker from '@/components/picker/TimePicker';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useEditEvent } from '@/hooks/employer/vacancy/useEditEvent';
import { editEventStyles as styles } from '@/styles/app/employer/vacancy/editEventStyles';
import { buttonStyles8 } from '@/styles/components/button/buttonStyles/buttonStyles8';
import { buttonStyles7 } from '@/styles/components/button/buttonStyles/buttonStyles7';
import { buttonStyles6 } from '@/styles/components/button/buttonStyles/buttonStyles6';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import { pickerStyles1 } from '@/styles/components/picker/pickerStyles1';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Input } from '@/components/input/Input';
import {Image,Keyboard,ScrollView,Text,TouchableWithoutFeedback,View,} from 'react-native';
import { Button } from '@/components/button/Button';
import EditEventSkeleton from '@/constants/skeletons/employer/editEventSkeleton';

export default function EditEventScreen() {
  const {
    nombreEvento,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    horaInicio,
    horaFin,
    rubros,
    selectedRubro,
    loading,
    setSelectedRubro,
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    handleEditarEvento,
    handleUbicacion,
    setHoraInicio,
    setHoraFin,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    guardarHabilitado,
    mostrarConfirmEliminar,
    handleEliminarEvento,
    confirmarEliminar,
    cancelarEliminar,
    showSkeleton,
  } = useEditEvent();
  
  if (showSkeleton) {
    return <EditEventSkeleton />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>

        <View style={styles.seccion}></View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.title}>Editar Evento</Text>
          <Image
            source={require('@/assets/images/jex/Jex-Diseñando.png')}
            style={styles.image}
          />
        </View>

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

          <Input
            placeholder="Ubicación"
            value={ubicacionEvento}
            onChangeText={handleUbicacion}
            styles={inputStyles1}
          />

          <View style={styles.row1}>
              <DatePicker3
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
                styles={{
                  ...datePickerStyles1,
                  selector: { ...datePickerStyles1.selector, width: 200 },
                }}
  />
              <TimePicker
                time={horaInicio}
                setTime={setHoraInicio}
                label="Hora Inicio"
                styles={{...timePickerStyles1,selector: {...timePickerStyles1.selector,width: 120,}}}
              />
          </View>

          <View style={styles.row2}>
            <DatePicker3
              label="Fecha de Fin"
              date={fechaFinEvento}
              setDate={setFechaFinEvento}
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
              styles={{
                ...datePickerStyles1,
              selector: { ...datePickerStyles1.selector, width: 200 },
              }}
            />
              <TimePicker
                time={horaFin}
                setTime={setHoraFin}
                label="Hora Fin"
               styles={{...timePickerStyles1,selector: {...timePickerStyles1.selector,width: 120,}}}
              />
          </View>

          </ScrollView>

           <View style={styles.row3}>
            
            <Button
                texto="Eliminar"
                onPress={handleEliminarEvento}
                styles={buttonStyles6}
              />

            <Button
              texto="Guardar"
              onPress={handleEditarEvento}
              styles={guardarHabilitado ? buttonStyles7 : buttonStyles8}
              disabled={!guardarHabilitado}
              loading={loading}
            />

           </View>
          
        <ClickWindow
          visible={mostrarConfirmEliminar}
          title="Eliminar evento"
          message="¿Está seguro que quiere eliminar este evento de forma permanente?"
          buttonText="Eliminar"
          cancelButtonText="Cancelar"
          onClose={confirmarEliminar}     // ACEPTAR -> elimina
          onCancelPress={cancelarEliminar} // CANCELAR -> cierra sin hacer nada
          styles={clickWindowStyles1}   
          icono={iconos.error_outline(30, Colors.white)}    // tu objeto de estilos para ClickWindow
        />

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