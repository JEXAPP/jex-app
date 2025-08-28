import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { IconButton } from '@/components/button/IconButton';
import { Input } from '@/components/input/Input';
import { CharCounter } from '@/components/others/CharCounter';
import DatePicker3 from '@/components/picker/DatePicker3';
import { DropDown2 } from '@/components/picker/DropDown2';
import TimePicker from '@/components/picker/TimePicker';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useEditVacancy } from '@/hooks/employer/vacancy/useEditVacancy';
import { editVacancyStyles as styles } from '@/styles/app/employer/vacancy/editVacancyStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonWithIconStyles1 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles1';
import { iconButtonStyles1 } from '@/styles/components/button/iconButtonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import EditVacancySkeleton from '../../../constants/skeletons/employer/editVacancySkeleton';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { dropdown2Styles1 } from '@/styles/components/picker/dropdown2Styles1';

export default function EditVacancyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    vacante,
    actualizarCampo,
    actualizarRequerimiento,
    agregarRequerimiento,
    eliminarRequerimiento,
    agregarTurno,
    eliminarTurno,
    actualizarTurno,
    handleGuardarCambios,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    opcionesDropdown,
    actualizarRol,
    closeSuccess,
    expandedVacancy,
    expandedShift,
    toggleVacancy,
    toggleShift,
    loading,
    fechaInicioEvento,
    fechaFinEvento,
  } = useEditVacancy(id!);

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {loading ? (
      <EditVacancySkeleton />
    ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image source={require('@/assets/images/jex/Jex-Creando-Vacantes.png')} style={styles.image} />
              <Text style={styles.title}>Editar Vacante</Text>
            </View>

            <View style={styles.vacancyCard}>
              <View style={styles.subtitleRow}>
                <Text style={styles.subtitulo}> Vacante </Text>
                <View style={styles.subtitleButtons}>
                  <IconButton
                    sizeContent={25}
                    styles={iconButtonStyles1}
                    onPress={toggleVacancy}
                    content={expandedVacancy ? 'folder-open' : 'folder'}
                    contentColor={Colors.violet4}
                  />
                </View>
              </View>

              {expandedVacancy && (
                <>
                  <DropDown2
                    name="Rol:"
                    options={opcionesDropdown}
                    id={vacante.rol || ''}
                    onValueChange={(idSeleccionado) => {
                      const seleccionado = opcionesDropdown.find((r) => r.id === idSeleccionado);
                      actualizarRol(seleccionado?.id ?? '', seleccionado?.name ?? '');
                    }}
                    placeholder={vacante.rolNombre || 'Elegí un rol'}
                    styles={dropdown2Styles1}
                  />

                  {vacante.rolNombre === 'Otro' && (
                    <Input
                      placeholder="Rol Específico"
                      value={vacante.otrosRol}
                      onChangeText={(text) => actualizarCampo('otrosRol', text)}
                      styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 310, marginBottom: 20 } }}
                    />
                  )}

                  <Input
                    placeholder="Descripción"
                    value={vacante.descripcion}
                    onChangeText={(text) => actualizarCampo('descripcion', text)}
                    multiline
                    maxLength={200}
                    styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 310, minHeight: 60, alignItems: 'center' } }}
                  />

                  <CharCounter current={vacante.descripcion.length} max={200} styles={charCounterStyles1} />

                  <Button
                    texto="Agregar Requerimiento"
                    onPress={agregarRequerimiento}
                    styles={{ ...buttonStyles1, boton: { ...buttonStyles1.boton, paddingVertical: 10, width: 240, marginTop: 20, marginBottom: 20 } }}
                  />

                  {vacante.requerimientos.map((requirement, requirementIndex) => (
                    <View key={requirementIndex} style={styles.requerimientoRow}>
                      <Input
                        placeholder="Requerimiento"
                        value={requirement}
                        onChangeText={(text) => actualizarRequerimiento(requirementIndex, text)}
                        styles={{ input: { ...inputStyles1.input }, inputContainer: { ...inputStyles1.inputContainer, width: 270, paddingVertical: 5 } }}
                      />
                      <IconButton
                        sizeContent={25}
                        styles={iconButtonStyles1}
                        onPress={() => eliminarRequerimiento(requirementIndex)}
                        content="trash"
                        contentColor={Colors.gray2}
                      />
                    </View>
                  ))}

                  {vacante.turnos.map((turno, turnoIndex) => (
                    <View key={turnoIndex} style={styles.turnoContainer}>
                      <View style={styles.shiftTitleRow}>
                        <Text style={styles.turnoTitulo}>{`Turno ${turnoIndex + 1}`}</Text>
                        <IconButton
                          sizeContent={25}
                          styles={iconButtonStyles1}
                          onPress={() => toggleShift(turnoIndex)}
                          content={expandedShift === turnoIndex ? 'folder-open' : 'folder'}
                          contentColor={Colors.white}
                        />
                      </View>

                      {expandedShift === turnoIndex && (
                        <>
                          <View style={styles.shiftRow}>
                            <DatePicker3
                              label="Fecha Inicio"
                              minimumDate={fechaInicioEvento}
                              maximumDate={fechaFinEvento}
                              date={turno.fechaInicio}                               // Date | null
                              setDate={(d) => actualizarTurno(turnoIndex, 'fechaInicio', d)}
                              styles={{ ...datePickerStyles1, selector: { ...datePickerStyles1.selector, width: 140 } }}
                            />
                            <TimePicker
                              time={turno.horaInicio}
                              setTime={(time) => actualizarTurno(turnoIndex, 'horaInicio', time)}
                              label="Hora Inicio"
                              styles={{ ...timePickerStyles1, selector: { ...timePickerStyles1.selector, width: 110 } }}
                            />
                          </View>

                          <View style={styles.shiftRow}>
                            <DatePicker3
                              label="Fecha Fin"
                              minimumDate={fechaInicioEvento}
                              maximumDate={fechaFinEvento}
                              date={turno.fechaFin}
                              setDate={(d) => actualizarTurno(turnoIndex, 'fechaFin', d)}
                              styles={{ ...datePickerStyles1, selector: { ...datePickerStyles1.selector, width: 140 } }}
                                                        />
                            <TimePicker
                              time={turno.horaFin}
                              setTime={(time) => actualizarTurno(turnoIndex, 'horaFin', time)}
                              label="Hora Fin"
                              styles={{ ...timePickerStyles1, selector: { ...timePickerStyles1.selector, width: 110 } }}
                            />
                          </View>

                          <View style={styles.shiftRow}>
                            <Input
                              placeholder="Cantidad Personas"
                              keyboardType="numeric"
                              value={turno.cantidad}
                              onChangeText={(value) => actualizarTurno(turnoIndex, 'cantidad', value)}
                              styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 270 } }}
                            />
                          </View>

                          <View style={styles.shiftRow}>
                            <Input
                              placeholder="Pago en ARS"
                              keyboardType="numeric"
                              value={turno.pago}
                              onChangeText={(value) => actualizarTurno(turnoIndex, 'pago', value)}
                              styles={{ input: inputStyles1.input, inputContainer: { ...inputStyles1.inputContainer, width: 270 } }}
                            />
                          </View>

                          {vacante.turnos.length > 1 && (
                            <ButtonWithIcon
                              icono={iconos.trash(24, Colors.violet4)}
                              texto="Eliminar turno"
                              onPress={() => eliminarTurno(turnoIndex)}
                              styles={{ ...buttonWithIconStyles1, boton: { ...buttonWithIconStyles1.boton, width: 200, marginBottom: 20 }, texto: { ...buttonWithIconStyles1.texto, marginRight: 0 } }}
                            />
                          )}
                        </>
                      )}
                    </View>
                  ))}

                  <Button
                    texto="Agregar turno"
                    onPress={agregarTurno}
                    styles={{ ...buttonStyles1, boton: { ...buttonStyles1.boton, paddingVertical: 10, width: 250, backgroundColor: Colors.violet2 } }}
                  />
                </>
              )}
            </View>

            <View style={styles.lastButtons}>
              <Button texto="Guardar cambios" onPress={handleGuardarCambios} styles={buttonStyles1} loading={loading} />
            </View>

            <ClickWindow
              title="Error"
              visible={showError}
              message={errorMessage}
              onClose={closeError}
              styles={clickWindowStyles1}
              icono={iconos.error_outline(30, Colors.white)}
              buttonText="Entendido"
            />

            <TempWindow visible={showSuccess} icono={iconos.exito(40, Colors.white)} onClose={closeSuccess} styles={tempWindowStyles1} duration={2000} />
          </View>
        </ScrollView>
         )}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
