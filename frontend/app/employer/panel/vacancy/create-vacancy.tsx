import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { IconButton } from '@/components/button/IconButton';
import { Input } from '@/components/input/Input';
import { CharCounter } from '@/components/others/CharCounter';
import DatePicker from '@/components/picker/DatePicker';
import { DropDown2 } from '@/components/picker/DropDown2';
import TimePicker from '@/components/picker/TimePicker';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useCreateVacancy } from '@/hooks/employer/panel/vacancy/useCreateVacancy';
import { createVacancyStyles as styles } from '@/styles/app/employer/panel/vacancy/createVacancyStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles/buttonStyles2';
import { buttonWithIconStyles1 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles1';
import { iconButtonStyles1 } from '@/styles/components/button/iconButtonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import { dropdown2Styles1 } from '@/styles/components/picker/dropdown2Styles1';
import { timePickerStyles1 } from '@/styles/components/picker/timePickerStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    actualizarRol,
    closeSuccess,
    expandedVacancy,
    expandedShiftByVacancy,
    toggleVacancy,
    toggleShift,
    loading,
    fechaInicioEvento,
    fechaFinEvento,
    confirmPaymentModal,
    feeModalVisible,
    openPaymentModal,
    closePaymentModal,
    sueldoPagar,
    sueldoPublicar,
    handleChangeSueldoPagar,
    handleChangeSueldoPublicar,
    feeLoading,
    feeDetails,
  } = useCreateVacancy();

  const totalFeeLabel =
    feeDetails?.total_fee_percent != null
      ? `${feeDetails.total_fee_percent.toFixed(2).replace(/\.00$/, '')}%`
      : null;

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image
                source={require('@/assets/images/jex/Jex-Creando-Vacantes.webp')}
                style={styles.image}
              />
              <Text style={styles.title}>Registrar Vacantes</Text>
            </View>

            {vacantes.map((vacante, vIndex) => (
              <View key={vIndex} style={styles.vacancyCard}>
                <View style={styles.subtitleRow}>
                  <Text style={styles.subtitulo}> Vacante {vIndex + 1}</Text>

                  <View style={styles.subtitleButtons}>
                    <IconButton
                      styles={iconButtonStyles1}
                      onPress={() => toggleVacancy(vIndex)}
                      icon={
                        expandedVacancy === vIndex
                          ? iconos.carpeta_abierta(25, Colors.violet4)
                          : iconos.carpeta_cerrada(25, Colors.violet4)
                      }
                    />

                    {vacantes.length > 1 && (
                      <Button
                        texto="Eliminar"
                        onPress={() => eliminarVacante(vIndex)}
                        styles={{
                          boton: {
                            ...buttonStyles1.boton,
                            width: 80,
                            backgroundColor: Colors.gray2,
                            height: 30,
                            marginBottom: 0,
                          },
                          texto: { ...buttonStyles1.texto, fontSize: 15 },
                        }}
                      />
                    )}
                  </View>
                </View>

                {expandedVacancy === vIndex && (
                  <>
                    <DropDown2
                      name="Rol:"
                      options={opcionesDropdown}
                      id={vacantes[vIndex].rol || ''}
                      onValueChange={id => {
                        const seleccionado = opcionesDropdown.find(r => r.id.toString() === id);
                        actualizarRol(
                          vIndex,
                          seleccionado?.id.toString() || '',
                          seleccionado?.name || ''
                        );
                      }}
                      placeholder={vacantes[vIndex].rolNombre || 'Elegí un rol'}
                      styles={dropdown2Styles1}
                    />

                    {vacante.rolNombre === 'Otro' && (
                      <Input
                        placeholder="Rol Específico"
                        value={vacante.otrosRol}
                        onChangeText={text => actualizarCampo(vIndex, 'otrosRol', text)}
                        styles={{
                          input: inputStyles1.input,
                          inputContainer: {
                            ...inputStyles1.inputContainer,
                            width: 310,
                            marginBottom: 20,
                          },
                        }}
                      />
                    )}

                    <Input
                      placeholder="Descripción"
                      value={vacante.descripcion}
                      onChangeText={text => actualizarCampo(vIndex, 'descripcion', text)}
                      multiline
                      maxLength={200}
                      styles={{
                        input: inputStyles1.input,
                        inputContainer: {
                          ...inputStyles1.inputContainer,
                          width: 310,
                          height: 120,
                          alignItems: 'flex-start',
                          paddingVertical: 2,
                        },
                      }}
                    />

                    <CharCounter
                      current={vacante.descripcion.length}
                      max={200}
                      styles={charCounterStyles1}
                    />

                    <Button
                      texto="Agregar Requerimiento"
                      onPress={() => agregarRequerimiento(vIndex)}
                      styles={{
                        ...buttonStyles1,
                        boton: {
                          ...buttonStyles1.boton,
                          paddingVertical: 10,
                          width: 240,
                          marginTop: 20,
                          marginBottom: 20,
                        },
                      }}
                    />

                    {vacante.requerimientos.map((req, rIndex) => (
                      <View key={rIndex} style={styles.requerimientoRow}>
                        <Input
                          placeholder="Requerimiento"
                          value={req}
                          onChangeText={text =>
                            actualizarRequerimiento(vIndex, rIndex, text)
                          }
                          styles={{
                            input: { ...inputStyles1.input },
                            inputContainer: {
                              ...inputStyles1.inputContainer,
                              width: 270,
                              paddingVertical: 5,
                            },
                          }}
                        />

                        <IconButton
                          styles={iconButtonStyles1}
                          onPress={() => eliminarRequerimiento(vIndex, rIndex)}
                          icon={iconos.trash(25, Colors.gray2)}
                        />
                      </View>
                    ))}

                    {vacante.turnos.map((turno, tIndex) => (
                      <View key={tIndex} style={styles.turnoContainer}>
                        <View style={styles.shiftTitleRow}>
                          <Text style={styles.turnoTitulo}>{`Turno ${tIndex + 1}`}</Text>

                          <IconButton
                            styles={iconButtonStyles1}
                            onPress={() => toggleShift(vIndex, tIndex)}
                            icon={
                              (expandedShiftByVacancy[vIndex] ?? null) === tIndex
                                ? iconos.carpeta_abierta(25, Colors.white)
                                : iconos.carpeta_cerrada(25, Colors.white)
                            }
                          />
                        </View>

                        {(expandedShiftByVacancy[vIndex] ?? null) === tIndex && (
                          <>
                            <View style={styles.shiftRow}>
                              <DatePicker
                                label="Fecha Inicio"
                                minimumDate={fechaInicioEvento}
                                maximumDate={fechaFinEvento}
                                date={turno.fechaInicio}
                                setDate={date =>
                                  actualizarTurno(vIndex, tIndex, 'fechaInicio', date)
                                }
                                styles={{
                                  ...datePickerStyles1,
                                  selector: {
                                    ...datePickerStyles1.selector,
                                    width: 140,
                                  },
                                }}
                              />

                              <TimePicker
                                time={turno.horaInicio}
                                setTime={time =>
                                  actualizarTurno(vIndex, tIndex, 'horaInicio', time)
                                }
                                label="Hora Inicio"
                                styles={{
                                  ...timePickerStyles1,
                                  selector: {
                                    ...timePickerStyles1.selector,
                                    width: 110,
                                  },
                                }}
                              />
                            </View>

                            <View style={styles.shiftRow}>
                              <DatePicker
                                label="Fecha Fin"
                                minimumDate={fechaInicioEvento}
                                maximumDate={fechaFinEvento}
                                date={turno.fechaFin}
                                setDate={date =>
                                  actualizarTurno(vIndex, tIndex, 'fechaFin', date)
                                }
                                styles={{
                                  ...datePickerStyles1,
                                  selector: {
                                    ...datePickerStyles1.selector,
                                    width: 140,
                                  },
                                }}
                              />

                              <TimePicker
                                time={turno.horaFin}
                                setTime={time =>
                                  actualizarTurno(vIndex, tIndex, 'horaFin', time)
                                }
                                label="Hora Fin"
                                styles={{
                                  ...timePickerStyles1,
                                  selector: {
                                    ...timePickerStyles1.selector,
                                    width: 110,
                                  },
                                }}
                              />
                            </View>

                            <View style={styles.shiftRow}>
                              <Input
                                placeholder="Cantidad Personas"
                                keyboardType="numeric"
                                value={turno.cantidad}
                                onChangeText={value =>
                                  actualizarTurno(vIndex, tIndex, 'cantidad', value)
                                }
                                styles={{
                                  input: inputStyles1.input,
                                  inputContainer: {
                                    ...inputStyles1.inputContainer,
                                    width: 270,
                                  },
                                }}
                              />
                            </View>

                            <View style={styles.shiftRow}>
                              <TouchableOpacity
                                style={styles.paymentButton}
                                activeOpacity={0.8}
                                onPress={() => openPaymentModal(vIndex, tIndex)}
                              >
                                <Text style={styles.paymentButtonValue}>
                                  {turno.pago
                                    ? `${turno.pago} ARS`
                                    : 'Sueldo en ARS'}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            {vacante.turnos.length > 1 && (
                              <ButtonWithIcon
                                icono={iconos.trash(18, Colors.violet4)}
                                texto="Eliminar turno"
                                onPress={() => eliminarTurno(vIndex, tIndex)}
                                styles={{
                                  ...buttonWithIconStyles1,
                                  boton: {
                                    ...buttonWithIconStyles1.boton,
                                    width: 200,
                                    marginBottom: 20,
                                    height: 45,
                                  },
                                  texto: {
                                    ...buttonWithIconStyles1.texto,
                                    marginRight: 0,
                                  },
                                }}
                              />
                            )}
                          </>
                        )}
                      </View>
                    ))}

                    <Button
                      texto="Agregar turno"
                      onPress={() => agregarTurno(vIndex)}
                      styles={{
                        ...buttonStyles1,
                        boton: {
                          ...buttonStyles1.boton,
                          width: 200,
                          backgroundColor: Colors.violet2,
                          height: 40,
                        },
                      }}
                    />
                  </>
                )}
              </View>
            ))}

            <View style={styles.lastButtons}>
              <Button
                texto="Agregar Vacante"
                onPress={agregarVacante}
                styles={{
                  ...buttonStyles2,
                  boton: {
                    ...buttonStyles2.boton,
                    width: 250,
                    paddingVertical: 10,
                  },
                }}
              />

              <Button
                texto="Registrar Vacantes"
                onPress={handleRegistrarTodas}
                styles={buttonStyles1}
                loading={loading}
              />
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

            <TempWindow
              visible={showSuccess}
              icono={iconos.exito(40, Colors.white)}
              onClose={closeSuccess}
              styles={tempWindowStyles1}
              duration={2000}
            />
          </View>

          <Modal
            visible={feeModalVisible}
            transparent
            animationType="fade"
            onRequestClose={closePaymentModal}
          >
            <View style={styles.paymentModalOverlay}>
              <View style={styles.paymentModalCard}>
                <Text style={styles.paymentModalTitle}>Definir sueldo</Text>

                {feeLoading ? (
                  <View style={styles.paymentModalLoadingRow}>
                    <ActivityIndicator size="small" color={Colors.violet4} />
                    <Text style={styles.paymentModalHint}>
                      Obteniendo comisión…
                    </Text>
                  </View>
                ) : (
                  <>
                    {totalFeeLabel && (
                      <Text style={styles.paymentModalHint}>
                        Comisión total: {totalFeeLabel}
                      </Text>
                    )}

                    <Text style={styles.paymentModalHint2}>
                        Lo que pagas realmente
                    </Text>

                    <Input
                      placeholder="Sueldo a pagar (ARS)"
                      keyboardType="numeric"
                      value={sueldoPagar}
                      onChangeText={handleChangeSueldoPagar}
                      styles={{
                        input: inputStyles1.input,
                        inputContainer: {
                          ...inputStyles1.inputContainer,
                          width: 300,
                          marginBottom: 20
                        },
                      }}
                    />

                    <Text style={styles.paymentModalHint2}>
                        Lo que ve el empleado
                    </Text>

                    <Input
                      placeholder="Sueldo a publicar (ARS)"
                      keyboardType="numeric"
                      value={sueldoPublicar}
                      onChangeText={handleChangeSueldoPublicar}
                      styles={{
                        input: inputStyles1.input,
                        inputContainer: {
                          ...inputStyles1.inputContainer,
                          width: 300,
                        },
                      }}
                    />

                    <View style={styles.paymentModalButtonsRow}>
                      <Button
                        texto="Cancelar"
                        onPress={closePaymentModal}
                        styles={{
                          boton: {
                            ...buttonStyles1.boton,
                            backgroundColor: Colors.gray12,
                            width: 120,
                            height: 44,
                          },
                          texto: {
                            ...buttonStyles1.texto,
                            color: Colors.gray3,
                            fontSize: 15,
                          },
                        }}
                      />
                      <Button
                        texto="Aplicar"
                        onPress={confirmPaymentModal}
                        styles={{
                          boton: {
                            ...buttonStyles1.boton,
                            width: 120,
                            height: 44,
                          },
                          texto: {
                            ...buttonStyles1.texto,
                            fontSize: 15,
                          },
                        }}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
