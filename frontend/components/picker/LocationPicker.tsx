import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, KeyboardAvoidingView,
  Platform, TextInput
} from 'react-native';

import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import Suggestions from '@/components/picker/Suggestions';
import { DropDown2 } from '@/components/picker/DropDown2';
import { dropdown2Styles1 } from '@/styles/components/picker/dropdown2Styles1';
import { buttonStyles3 } from '@/styles/components/button/buttonStyles/buttonStyles3';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { suggestionsStyles2 } from '@/styles/components/picker/suggestionsStyles/suggestionsStyles2';
import { styles } from '@/styles/components/picker/locationPickerStyles1';
import {
  listarProvincias,
  buscarLocalidades,
  buscarCalles,
  normalizarDireccion,
} from '@/services/external/sugerencias/useGeoRefAr';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { Colors } from '@/themes/colors';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { ClickWindow } from '@/components/window/ClickWindow';

interface Option {
  id: string;
  name: string;
}

interface LocationAddressPickerProps {
  placeholder: string;
  value?: string | null;
  onChange: (direccion: string, coords: { lat: number; lng: number } | null) => void;
  buttonLabel?: string;
}

function useDebounced<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function genSessionToken() {
  return 'xxxxxxxxyxxxxxxx'.replace(/[xy]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

export default function LocationAddressPicker({
  placeholder,
  value,
  onChange,
  buttonLabel,
}: LocationAddressPickerProps) {
  const [open, setOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>(genSessionToken());

  const [provincias, setProvincias] = useState<Option[]>([]);
  const [provinciaId, setProvinciaId] = useState('');
  const [provinciaName, setProvinciaName] = useState('');

  const [localidadQuery, setLocalidadQuery] = useState('');
  const debouncedLocalidad = useDebounced(localidadQuery);
  const [localidadesSug, setLocalidadesSug] = useState<{ descripcion: string; placeId: string }[]>([]);
  const [localidadId, setLocalidadId] = useState<string | null>(null);
  const [localidadNombre, setLocalidadNombre] = useState('');
  const [localidadConfirmada, setLocalidadConfirmada] = useState(false);

  const [calleQuery, setCalleQuery] = useState('');
  const debouncedCalle = useDebounced(calleQuery);
  const [callesSug, setCallesSug] = useState<{ descripcion: string; placeId: string }[]>([]);
  const [calleNombre, setCalleNombre] = useState('');
  const [altura, setAltura] = useState('');

  const [confirming, setConfirming] = useState(false);
  const [cwVisible, setCwVisible] = useState(false);
  const [cwTitle, setCwTitle] = useState('');
  const [cwMsg, setCwMsg] = useState('');

  const locRef = useRef<TextInput>(null);
  const calleRef = useRef<TextInput>(null);
  const alturaRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!open) return;
    listarProvincias()
      .then(provs => setProvincias(provs.map(p => ({ id: p.id, name: p.nombre }))))
      .catch(() => setProvincias([]));
  }, [open]);

  useEffect(() => {
    if (!provinciaId || debouncedLocalidad.trim().length < 2) {
      setLocalidadesSug([]);
      return;
    }
    buscarLocalidades(provinciaId, debouncedLocalidad.trim(), sessionToken)
      .then(s => setLocalidadesSug(s))
      .catch(() => setLocalidadesSug([]));
  }, [provinciaId, debouncedLocalidad, sessionToken]);

  useEffect(() => {
    const calleValida = debouncedCalle.trim().length >= 2;
    const localidadValida = localidadConfirmada && localidadId;
    if (!provinciaId || !localidadValida || !calleValida) {
      if (callesSug.length > 0) setCallesSug([]);
      return;
    }
    let cancelado = false;
    buscarCalles({ provinciaId, localidadId: localidadId ?? undefined, localidadNombre, q: debouncedCalle.trim(), sessionToken })
      .then(s => { if (!cancelado) setCallesSug(s); })
      .catch(() => { if (!cancelado) setCallesSug([]); });
    return () => { cancelado = true; };
  }, [provinciaId, localidadId, localidadNombre, debouncedCalle, localidadConfirmada, sessionToken]);

  const handleSelectLocalidad = (item: { descripcion: string; placeId: string }) => {
    const parts = Object.fromEntries(item.placeId.split('|').map(kv => kv.split(':')));
    const locId = parts['loc'] || parts['gpid'] || '';
    const locName = parts['locName'] || item.descripcion.split(',')[0]?.trim() || '';

    setLocalidadId(locId);
    setLocalidadNombre(locName);
    setLocalidadQuery(locName);
    setLocalidadConfirmada(true);
    setCalleNombre('');
    setCalleQuery('');
    setAltura('');
    setCallesSug([]);

    setTimeout(() => calleRef.current?.focus(), 60);
  };

  const handleSelectCalle = (item: { descripcion: string; placeId: string }) => {
    const parts = Object.fromEntries(item.placeId.split('|').map(kv => kv.split(':')));
    const cName = parts['calleName'] || item.descripcion.split(',')[0]?.trim() || '';
    setCalleNombre(cName);
    setCalleQuery(cName);
    setCallesSug([]);
    setTimeout(() => alturaRef.current?.focus(), 60);
  };

  const canConfirm = useMemo(() => (
    provinciaName && localidadId && localidadConfirmada && localidadNombre && calleNombre && Number(altura) > 0
  ), [provinciaName, localidadId, localidadNombre, localidadConfirmada, calleNombre, altura]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const direccion = normalizarDireccion({
        provinciaNombre: provinciaName,
        localidadNombre,
        calleNombre,
        altura,
      });
      onChange(direccion.canonical, null);
      setOpen(false);
    } catch {
      setCwTitle('Dirección no válida');
      setCwMsg('Revisá los datos ingresados.');
      setCwVisible(true);
    } finally {
      setConfirming(false);
    }
  };

  const handleProvinciaChange = (id: string) => {
    setProvinciaId(id);
    const provName = provincias.find(p => String(p.id) === String(id))?.name ?? '';
    setProvinciaName(provName);
    setLocalidadId(null);
    setLocalidadNombre('');
    setLocalidadQuery('');
    setLocalidadesSug([]);
    setLocalidadConfirmada(false);
    setCalleNombre('');
    setCalleQuery('');
    setCallesSug([]);
    setAltura('');
    setSessionToken(genSessionToken());
  };

  const handleClose = () => {
    setOpen(false);
    setLocalidadesSug([]);
    setCallesSug([]);
    setLocalidadConfirmada(false);
  };

  const handleOpen = () => {
    setSessionToken(genSessionToken());
    setOpen(true);
  };

  // 🔸 Botón: texto negro si hay valor, gris si está vacío
  const triggerText = buttonLabel?.trim() || value?.trim() || placeholder;
  const triggerColor = value?.trim() ? Colors.black : Colors.gray3;

  return (
    <>
      <Button
        texto={triggerText}
        onPress={handleOpen}
        styles={{
          ...buttonStyles3,
          texto: { ...buttonStyles3.texto, color: triggerColor },
        }}
      />

      <Modal visible={open} transparent animationType="fade" onRequestClose={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.overlay}
        >
          <TouchableOpacity activeOpacity={1} onPress={handleClose} style={styles.backdrop} />

          <View style={styles.modal}>
            <Text style={styles.title}>Seleccioná la ubicación</Text>

            <View style={styles.block}>
              <DropDown2
                name="Provincia"
                options={provincias}
                id={provinciaId}
                onValueChange={handleProvinciaChange}
                placeholder="Provincia"
                styles={dropdown2Styles1}
              />
            </View>

            {!!provinciaId && (
              <View style={styles.block}>
                <View style={styles.suggestWrapper} collapsable={false}>
                  <Input
                    placeholder="Localidad"
                    value={localidadQuery}
                    onChangeText={(t) => {
                      setLocalidadQuery(t);
                      if (localidadConfirmada) {
                        setLocalidadConfirmada(false);
                        setLocalidadId(null);
                        setCallesSug([]);
                        setCalleQuery('');
                        setCalleNombre('');
                        setAltura('');
                      }
                    }}
                    ref={locRef}
                    styles={{
                      ...inputStyles1,
                      inputContainer: { ...inputStyles1.inputContainer, width: 310 },
                    }}
                  />
                  {!!localidadesSug.length && !localidadConfirmada && (
                    <Suggestions
                      sugerencias={localidadesSug}
                      onSeleccionar={handleSelectLocalidad}
                      styles={suggestionsStyles2}
                    />
                  )}
                  {/* 🔸 Eliminado el texto "No se encontraron localidades." */}
                </View>
              </View>
            )}

            {!!localidadId && localidadConfirmada && (
              <View style={styles.block}>
                <View style={styles.rowCalleAltura}>
                  <View style={styles.suggestWrapper} collapsable={false}>
                    <Input
                      placeholder="Calle"
                      value={calleQuery}
                      onChangeText={setCalleQuery}
                      ref={calleRef}
                      editable={localidadConfirmada}
                      styles={{
                        ...inputStyles1,
                        inputContainer: { ...inputStyles1.inputContainer, width: 200 },
                      }}
                    />
                    {!!callesSug.length && calleNombre !== calleQuery && debouncedCalle.length >= 2 && (
                      <Suggestions
                        sugerencias={callesSug}
                        onSeleccionar={handleSelectCalle}
                        styles={suggestionsStyles2}
                      />
                    )}
                  </View>

                  <View style={styles.colAltura}>
                    <Input
                      placeholder="Altura"
                      value={altura}
                      onChangeText={setAltura}
                      keyboardType="numeric"
                      ref={alturaRef}
                      styles={{
                        ...inputStyles1,
                        inputContainer: { ...inputStyles1.inputContainer, width: 100 },
                      }}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.actions}>
              <Button
                texto="Cancelar"
                onPress={handleClose}
                styles={{
                  boton: {
                    ...buttonStyles1.boton,
                    width: 150,
                    borderRadius: 999,
                    backgroundColor: Colors.gray12,
                    height: 45,
                  },
                  texto: {
                    ...buttonStyles1.texto,
                    color: Colors.black,
                    fontSize: 15,
                    fontFamily: 'interMedium',
                  },
                }}
              />
              <Button
                texto={confirming ? 'Guardando…' : 'Guardar'}
                onPress={handleConfirm}
                styles={{
                  texto: { ...buttonStyles1.texto, fontSize: 15 },
                  boton: { ...buttonStyles1.boton, width: 150, borderRadius: 999, height: 45 },
                }}
                disabled={!canConfirm || confirming}
                loading={confirming}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ClickWindow
        visible={cwVisible}
        title={cwTitle}
        message={cwMsg}
        buttonText="Entendido"
        onClose={() => setCwVisible(false)}
        styles={clickWindowStyles1}
      />
    </>
  );
}
