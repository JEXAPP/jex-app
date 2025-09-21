import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { Input } from '@/components/input/Input';
import { CharCounter } from '@/components/others/CharCounter';
import { UploadImage } from '@/components/others/UploadImage';
import DatePicker from '@/components/picker/DatePicker';
import { Picker } from '@/components/picker/Picker';
import Suggestions from '@/components/picker/Suggestions';
import TimePicker from '@/components/picker/TimePicker';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import EditEventSkeleton from '@/constants/skeletons/employer/editEventSkeleton';
import { useEditEvent } from '@/hooks/employer/panel/edit-event/useEditEvent';
import { editEventStyles as styles } from '@/styles/app/employer/panel/edit-event/editEventStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { buttonWithIconStyles1 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles1';
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
import { Keyboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function EditEventScreen() {
  const {
    nombreEvento,
    sugerencias,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    horaInicio,
    horaFin,
    rubros,
    selectedRubro,
    loading,
    imageID,
    imageURL,
    setSelectedRubro,
    seleccionarUbicacion,
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    handleEditarEvento,
    handleUbicacion,
    setHoraInicio,
    setHoraFin,
    setImagenFile,
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

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>

            <Text style={styles.title}>Editar Evento</Text>
            
            <UploadImage
            mode="edit"
            initialImageUrl={imageURL} 
            shape="square"
            size={100}
            defaultImage={require('@/assets/images/jex/Jex-Evento-Default.png')}
            onChange={(file, uri) => {
              setImagenFile(file)
            }}
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
              <DatePicker
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

            <View style={styles.row3}>

              <ButtonWithIcon
                icono={iconos.trash(18, Colors.violet4)}
                texto="Eliminar"
                onPress={handleEliminarEvento}
                styles={{ ...buttonWithIconStyles1, boton: { ...buttonWithIconStyles1.boton, width: 150}, texto: {...buttonWithIconStyles1.texto, marginRight: 0} }}
              />

              <Button
                texto="Guardar"
                onPress={handleEditarEvento}
                styles={guardarHabilitado 
                  ?{ ...buttonStyles1, boton: { ...buttonStyles1.boton, width: 150} } 
                  : { ...buttonStyles4, boton: { ...buttonStyles4.boton, width: 150} }}
                disabled={!guardarHabilitado}
                loading={loading}
              />

            </View>

          </ScrollView>
          
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