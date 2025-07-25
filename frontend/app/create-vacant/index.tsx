import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';

import DatePicker from '@/components/DatePicker';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ClickWindow } from '@/components/ClickWindow';
import { TempWindow } from '@/components/TempWindow';
import DropDown from '@/components/DropDown';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { turnoInputStyles } from '@/styles/app/create-vacant/turnoInputStyles';

import { iconos } from '@/constants/iconos';

import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { inputStyles3 } from '@/styles/components/input/inputStyles3';
import { tempWindowStyles1 } from '@/styles/components/tempWindowStyles1';
import { datePickerStyles2 } from '@/styles/components/datePickerStyles2';
import { registerVacancyCustomStyles as customStyles } from '@/styles/app/create-vacant/registerVacancyCustomStyles';
import { buttonStyles6 } from '@/styles/components/button/buttonStyles6';


import { Colors } from '@/themes/colors';
import { useRegisterVacancyMulti } from '@/hooks/create-vacant/useRegistrerVacant';
import { registerVacancyStyles as styles } from '@/styles/app/create-vacant/registerVacancyStyles';

const generateHoras = () => {
  const horas = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      horas.push(`${hh}:${mm}`);
    }
  }
  return horas;
};

export default function RegisterVacancyScreen() {
  const {
    vacantes,
    agregarVacante,
    eliminarVacante,
    actualizarCampo,
    actualizarRequerimiento,
    agregarRequerimiento,
    eliminarRequerimiento,
    agregarTurno,
    eliminarTurno,
    actualizarTurno,
    handleRegistrarTodas,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    opcionesDropdown,
    closeSuccess,
  } = useRegisterVacancyMulti();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentPickerInfo, setCurrentPickerInfo] = useState<{
    vacanteIndex: number;
    turnoIndex: number;
    type: 'horaInicio' | 'horaFin';
  } | null>(null);
  const [horaTemporal, setHoraTemporal] = useState<Date>(new Date());

  const mostrarHoraEnModal = (vacanteIndex: number, turnoIndex: number, tipo: 'horaInicio' | 'horaFin') => {
    setCurrentPickerInfo({ vacanteIndex, turnoIndex, type: tipo });
    setShowTimePicker(true);
  };

 

  const formatearHora = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const onTimeChange = (_: any, selectedDate: Date | undefined) => {
    if (selectedDate) setHoraTemporal(selectedDate);
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
              <Text style={styles.title}>Registrar Vacantes</Text>
            </View>

            <Text style={styles.texto}>Completá los datos de las vacantes</Text>

            {vacantes.map((vacante, vIndex) => (
              <View key={vIndex} style={{ marginBottom: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={styles.subtitulo}> Vacante {vIndex + 1}{vacante.rolNombre ? ` - ${vacante.rolNombre}` : ''} </Text>
                  {vacantes.length > 1 && (
                    <TouchableOpacity
                      onPress={() => eliminarVacante(vIndex)}
                      style={{
                        marginLeft: 10,
                        backgroundColor: Colors.gray3,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        marginBottom: -5,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: Colors.white, fontSize: 12, fontWeight: 'bold' }}>Eliminar vacante</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <DropDown
                  label="Rol:"
                  options={opcionesDropdown}
                  value={vacantes[vIndex].rol} // el ID como string
                  
                  onValueChange={(value) => {
                    const seleccionado = opcionesDropdown.find((r) => r.value.toString() === value);
                    actualizarCampo(vIndex, 'rol', value);
                    actualizarCampo(vIndex, 'rolNombre', seleccionado?.label || ''); // solo el ID
                  }}
                  placeholder={vacante.rolNombre ?  vacante.rolNombre  : 'Elegí un rol'}
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
                    onChangeText={(text) => actualizarCampo(vIndex, 'otrosRol', text)}
                    styles={inputStyles1}
                  />
                )}

                <Input
                  placeholder="Descripción:"
                  value={vacante.descripcion}
                  onChangeText={(text) => actualizarCampo(vIndex, 'descripcion', text)}
                  multiline
                  styles={inputStyles1}
                />

                <Text style={styles.texto}>Requerimientos:</Text>
                {vacante.requerimientos.map((req, rIndex) => (
                  <View key={rIndex} style={customStyles.requerimientoRow}>
                    <Text style={customStyles.requerimientoIndex}>{rIndex + 1} -</Text>
                    <TextInput
                      value={req}
                      onChangeText={(text) => actualizarRequerimiento(vIndex, rIndex, text)}
                      style={customStyles.requerimientoInput}
                    />
                    <Button texto="-" onPress={() => eliminarRequerimiento(vIndex, rIndex)} styles={buttonStyles6} />
                  </View>
                ))}
                <Button
                  texto="+ Agregar Requerimiento"
                  onPress={() => agregarRequerimiento(vIndex)}
                  styles={{ ...buttonStyles1, boton: { ...buttonStyles1.boton, paddingVertical: 10, width: 240,  backgroundColor: Colors.violet2, } }}
                />

                {vacante.turnos.map((turno, tIndex) => (
                  <View key={tIndex} style={styles.turnoContainer}>
                    <Text style={styles.turnoTitulo}>{`Turno - ${tIndex + 1}`}</Text>

                    <View style={customStyles.turnoGrid}>
                      <View style={customStyles.halfWidth}>
                        <DatePicker
                          label="Fecha Inicio:"
                          date={turno.fechaInicio}
                          setDate={(date) => actualizarTurno(vIndex, tIndex, 'fechaInicio', date)}
                          styles={datePickerStyles2}
                        />
                      </View>

                      <View style={customStyles.halfWidth}>
                        <DatePicker
                          label="Fecha Fin:"
                          date={turno.fechaFin}
                          setDate={(date) => actualizarTurno(vIndex, tIndex, 'fechaFin', date)}
                          styles={datePickerStyles2}
                        />
                      </View>

                      <View style={customStyles.halfWidth}>
                        <TouchableOpacity onPress={() => mostrarHoraEnModal(vIndex, tIndex, 'horaInicio')}>
                          <View style={turnoInputStyles.timeInput}>
                            <Text style={turnoInputStyles.label}>{turno.horaInicio || 'Hora Inicio: '}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={customStyles.halfWidth}>
                        <TouchableOpacity onPress={() => mostrarHoraEnModal(vIndex, tIndex, 'horaFin')}>
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
                          onChangeText={(value) => actualizarTurno(vIndex, tIndex, 'cantidad', value)}
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
                            onChangeText={(value) => actualizarTurno(vIndex, tIndex, 'pago', value)}
                            style={turnoInputStyles.pagoInput}
                          />
                        </View>
                      </View>
                    </View>

                    {vacante.turnos.length > 1 && (
                      <Button
                        texto="Eliminar turno"
                        onPress={() => eliminarTurno(vIndex, tIndex)}
                        styles={{ ...buttonStyles4, boton: { ...buttonStyles4.boton, paddingVertical: 10, width: 250 } }}
                      />
                    )}

                    {tIndex === vacante.turnos.length - 1 && (
                      <Button
                        texto="+ Agregar turno"
                        onPress={() => agregarTurno(vIndex)}
                        styles={{ ...buttonStyles1, boton: { ...buttonStyles1.boton, paddingVertical: 10, width: 250, backgroundColor: Colors.violet2, } }}
                      />
                    )}
                  </View>
                ))}
              </View>
            ))}

            <Button
              texto="+ Agregar Vacante"
              onPress={agregarVacante}
              styles={{ ...buttonStyles1, boton: { ...buttonStyles1.boton, marginBottom: 20, backgroundColor: Colors.violet3, } }}
            />

            <Button
              texto="Registrar Vacantes"
              onPress={handleRegistrarTodas}
              styles={buttonStyles1}
            />

            {showTimePicker && currentPickerInfo && (
              <Modal
                transparent
                animationType="slide"
                visible={showTimePicker && Platform.OS === 'ios'} // Solo mostrar modal en iOS
              >
                <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                  <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                      <DateTimePicker
                        mode="time"
                        is24Hour
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        value={horaTemporal}
                        onChange={(event, selectedDate) => {
                          if (Platform.OS === 'android') {
                            if (event.type === 'set' && selectedDate) {
                              const hora = formatearHora(selectedDate);
                              actualizarTurno(
                                currentPickerInfo.vacanteIndex,
                                currentPickerInfo.turnoIndex,
                                currentPickerInfo.type,
                                hora
                              );
                            }
                            setShowTimePicker(false); // Cerrar modal en Android (aunque modal no visible)
                          } else {
                            if (selectedDate) setHoraTemporal(selectedDate);
                          }
                        }}
                        themeVariant={Platform.OS === 'ios' ? 'light' : undefined}
                        textColor={Platform.OS === 'ios' ? '#000' : undefined}
                        style={{ width: '100%' }}
                      />

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={() => {
                    const hora = formatearHora(horaTemporal);
                    actualizarTurno(
                      currentPickerInfo.vacanteIndex,
                      currentPickerInfo.turnoIndex,
                      currentPickerInfo.type,
                      hora
                    );
                    setShowTimePicker(false);
                  }}
                  style={{
                    marginTop: 10,
                    backgroundColor: Colors.violet4,
                    borderRadius: 10,
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Confirmar hora</Text>
                </TouchableOpacity>
              )}

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )}

    {Platform.OS === 'android' && showTimePicker && (
      // Abrir DateTimePicker sin modal (modal falso, solo diálogo nativo)
      <DateTimePicker
        mode="time"
        is24Hour
        display="default"
        value={horaTemporal}
        onChange={(event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            const hora = formatearHora(selectedDate);
            actualizarTurno(
              currentPickerInfo!.vacanteIndex,
              currentPickerInfo!.turnoIndex,
              currentPickerInfo!.type,
              hora
            );
          }
          setShowTimePicker(false);
        }}
      />
    )}

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
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
