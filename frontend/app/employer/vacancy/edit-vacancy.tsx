import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import DatePicker from '@/components/picker/DatePicker';
import DropDown from '@/components/picker/DropDown2';
import TimePicker from '@/components/picker/TimePicker';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useEditVacancy } from '@/hooks/employer/vacancy/useEditVacancy';
import { registerVacancyCustomStyles as customStyles } from '@/styles/app/employer/vacancy/edit-vacancy/registerVacancyCustomStyles';
import { registerVacancyStyles as styles } from '@/styles/app/employer/vacancy/edit-vacancy/registerVacancyStyles';
import { turnoInputStyles } from '@/styles/app/employer/vacancy/edit-vacancy/turnoInputStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { datePickerStyles2 } from '@/styles/components/picker/datePickerStyles/datePickerStyles2';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';


export default function EditVacancyScreen() {
  const {
    vacante,
    loading,
    showSuccess,
    showError,
    errorMessage,
    closeError,
    closeSuccess,
    rolesDisponibles,
    actualizarCampo,
    actualizarTurno,
    actualizarRequerimiento,
    handleEditarVacante,
  } = useEditVacancy();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentPickerInfo, setCurrentPickerInfo] = useState<{
    turnoIndex: number;
    type: 'horaInicio' | 'horaFin';
  } | null>(null);
  const [horaTemporal, setHoraTemporal] = useState<Date>(new Date());

  if (loading || !vacante) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const mostrarHoraEnModal = (turnoIndex: number, tipo: 'horaInicio' | 'horaFin') => {
    setCurrentPickerInfo({ turnoIndex, type: tipo });
    setShowTimePicker(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image
                source={require('@/assets/images/jex/Jex-Registrandose.png')}
                style={styles.image}
              />
              <Text style={styles.title}>Editar Vacante</Text>
            </View>

            <DropDown
              label="Rol:"
              options={[...rolesDisponibles.map((r) => ({ label: r.name, value: r.id.toString() })), { label: 'Otro', value: 'otro' }]}
              value={vacante.rol}
              onValueChange={(value) => {
                const seleccionado = rolesDisponibles.find((r) => r.id.toString() === value);
                actualizarCampo('rol', value);
                actualizarCampo('rolNombre', seleccionado?.name || 'Otro');
              }}
              placeholder={vacante.rolNombre || 'Elegí un rol'}
              styles={{
                input: inputStyles1.input,
                label: { color: '#000', fontSize: 16, fontFamily: 'interMedium' },
                placeholder: { color: '#999', fontStyle: 'italic', fontSize: 16 },
              }}
            />

            {vacante.rolNombre === 'Otro' && (
              <Input
                placeholder="Especificar Rol:"
                value={vacante.otrosRol}
                onChangeText={(text) => actualizarCampo('otrosRol', text)}
                styles={inputStyles1}
              />
            )}

            <Input
              placeholder="Descripción:"
              value={vacante.descripcion}
              onChangeText={(text) => actualizarCampo('descripcion', text)}
              multiline
              styles={inputStyles1}
            />

            <Text style={styles.texto}>Requerimientos:</Text>
            {vacante.requerimientos.map((req, index) => (
              <View key={index} style={customStyles.requerimientoRow}>
                <Text style={customStyles.requerimientoIndex}>{index + 1} -</Text>
                <TextInput
                  value={req}
                  onChangeText={(text) => actualizarRequerimiento(index, text)}
                  style={customStyles.requerimientoInput}
                  multiline
                />
              </View>
            ))}

            {vacante.turnos.map((turno, tIndex) => (
              <View key={tIndex} style={styles.turnoContainer}>
                <Text style={styles.turnoTitulo}>{`Turno - ${tIndex + 1}`}</Text>

                <View style={customStyles.turnoGrid}>
                  <View style={customStyles.halfWidth}>
                    <DatePicker
                      label="Fecha Inicio:"
                      date= {turno.fechaInicio}
                      setDate={(date) => actualizarTurno(tIndex, 'fechaInicio', date)}
                      styles={datePickerStyles2}
                    />
                  </View>

                  <View style={customStyles.halfWidth}>
                    <DatePicker
                      label="Fecha Fin:"
                      date= {turno.fechaInicio}
                      setDate={(date) => actualizarTurno(tIndex, 'fechaFin', date)}
                      styles={datePickerStyles2}
                    />
                  </View>

                  <View style={customStyles.halfWidth}>
                    <TouchableOpacity onPress={() => mostrarHoraEnModal(tIndex, 'horaInicio')}>
                      <View style={turnoInputStyles.timeInput}>
                        <Text style={turnoInputStyles.label}>{turno.horaInicio || 'Hora Inicio: '}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={customStyles.halfWidth}>
                    <TouchableOpacity onPress={() => mostrarHoraEnModal(tIndex, 'horaFin')}>
                      <View style={turnoInputStyles.timeInput}>
                        <Text style={turnoInputStyles.label}>{turno.horaFin || 'Hora Fin: '}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={customStyles.halfWidth}>
                    <Text style={turnoInputStyles.label}>Cantidad Personal:</Text>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="0"
                      value={turno.cantidad}
                      onChangeText={(value) => actualizarTurno(tIndex, 'cantidad', value)}
                      style={turnoInputStyles.numericInput}
                    />
                  </View>

                  <View style={customStyles.halfWidth}>
                    <Text style={turnoInputStyles.label}>Pago:</Text>
                    <View style={turnoInputStyles.pagoContainer}>
                      <Text style={turnoInputStyles.currency}>$</Text>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="0"
                        value={turno.pago}
                        onChangeText={(value) => actualizarTurno(tIndex, 'pago', value)}
                        style={turnoInputStyles.pagoInput}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <Button
              texto="Guardar Cambios"
              onPress={handleEditarVacante}
              styles={buttonStyles1}
            />

            {/* Time Picker modal */}
            {Platform.OS === 'android' && showTimePicker && currentPickerInfo && (
              <Modal transparent animationType="fade" visible>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  </TouchableWithoutFeedback>

                  <TimePicker
                    time={vacante.turnos[currentPickerInfo.turnoIndex][currentPickerInfo.type]}
                    setTime={(hora) => {
                      actualizarTurno(currentPickerInfo.turnoIndex, currentPickerInfo.type, hora);
                      setShowTimePicker(false);
                    }}
                    styles={timePickerStyles1}
                  />
                </View>
              </Modal>
            )}

            <ClickWindow
              title="Error"
              visible={showError}
              message={errorMessage}
              onClose={closeError}
              styles={clickWindowStyles1}
              icono={iconos.error(24, '#8E44AD')}
              buttonText="Entendido"
            />

            <TempWindow
              visible={showSuccess}
              icono={iconos.exito(40, '#FFF')}
              onClose={closeSuccess}
              styles={tempWindowStyles1}
              duration={2000}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

