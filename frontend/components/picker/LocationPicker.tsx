import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

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

type Option = { id: string; name: string };

type LocationAddressPickerProps = {
  placeholder: string;
  value?: string | null;
  onChange: (direccion: string, coords: { lat: number; lng: number } | null) => void;
  buttonLabel?: string;
};

export default function LocationAddressPicker({
  placeholder,
  value,
  onChange,
  buttonLabel,
}: LocationAddressPickerProps) {
  // Modal
  const [open, setOpen] = useState(false);

  // Paso 1: Provincia (DropDown2)
  const [provincias, setProvincias] = useState<Option[]>([]);
  const [provinciaId, setProvinciaId] = useState<string>(''); // DropDown2 guarda el id seleccionado
  const [provinciaName, setProvinciaName] = useState<string>('');

  // Paso 2: Localidad (Input + Suggestions)
  const [queryLocalidad, setQueryLocalidad] = useState('');
  const [localidadesSug, setLocalidadesSug] = useState<{ descripcion: string; placeId: string }[]>([]);
  const [localidadId, setLocalidadId] = useState<string>('');
  const [localidadName, setLocalidadName] = useState<string>('');

  // Paso 3: Calle (Input + Suggestions)
  const [queryCalle, setQueryCalle] = useState('');
  const [callesSug, setCallesSug] = useState<{ descripcion: string; placeId: string }[]>([]);
  const [calleNombre, setCalleNombre] = useState<string>('');

  // Paso 4: Altura
  const [altura, setAltura] = useState<string>('');

  const [confirming, setConfirming] = useState(false);

  const [localidadLocked, setLocalidadLocked] = useState(false);
const [calleLocked, setCalleLocked] = useState(false);

  // Cargar provincias al abrir
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const provs = await listarProvincias();
        const opts = provs.map(p => ({ id: p.id, name: p.nombre }));
        setProvincias(opts);
      } catch {
        setProvincias([]);
      }
    })();
  }, [open]);

  // Localidades
useEffect(() => {
  let cancel = false;
  const run = async () => {
    if (localidadLocked || !provinciaId || queryLocalidad.trim().length < 2) {
      if (!cancel) setLocalidadesSug([]);
      return;
    }
    try {
      const s = await buscarLocalidades(provinciaId, queryLocalidad.trim());
      if (!cancel) setLocalidadesSug(s);
    } catch { if (!cancel) setLocalidadesSug([]); }
  };
  const t = setTimeout(run, 250);
  return () => { cancel = true; clearTimeout(t); };
}, [provinciaId, queryLocalidad, localidadLocked]);

// Calles
useEffect(() => {
  let cancel = false;
  const run = async () => {
    if (calleLocked || !provinciaId || !localidadId || queryCalle.trim().length < 2) {
      if (!cancel) setCallesSug([]);
      return;
    }
    try {
      const s = await buscarCalles({ provinciaId, localidadId, localidadName, q: queryCalle.trim() });
      if (!cancel) setCallesSug(s);
    } catch { if (!cancel) setCallesSug([]); }
  };
  const t = setTimeout(run, 250);
  return () => { cancel = true; clearTimeout(t); };
}, [provinciaId, localidadId, localidadName, queryCalle, calleLocked]);

  // Selección desde Suggestions (Localidad)
  const handleSelectLocalidad = (it: { descripcion: string; placeId: string }) => {
  const parts = Object.fromEntries(it.placeId.split('|').map(kv => { const [k, ...r] = kv.split(':'); return [k, r.join(':')]; }));
  const locId = parts['loc'] || '';
  const locName = parts['locName'] || it.descripcion.split(',')[0]?.trim() || '';
  setLocalidadId(locId);
  setLocalidadName(locName);
  setQueryLocalidad(locName);
  setLocalidadesSug([]);
  setLocalidadLocked(true);   // 🔒 bloquea re-fetch
  Keyboard.dismiss();         // quita foco
};

  // Selección desde Suggestions (Calle)
  const handleSelectCalle = (it: { descripcion: string; placeId: string }) => {
  const parts = Object.fromEntries(it.placeId.split('|').map(kv => { const [k, ...r] = kv.split(':'); return [k, r.join(':')]; }));
  const cName = parts['calleName'] || it.descripcion.split(',')[0]?.trim() || '';
  setCalleNombre(cName);
  setQueryCalle(cName);
  setCallesSug([]);
  setCalleLocked(true);       // 🔒 bloquea re-fetch
  Keyboard.dismiss();         // quita foco
};

  // habilitar guardar
  const canConfirm = useMemo(() => {
    return Boolean(provinciaName && localidadName && calleNombre && Number(altura) > 0);
  }, [provinciaName, localidadName, calleNombre, altura]);

  const handleConfirm = async () => {
    if (!canConfirm) return;
    try {
      setConfirming(true);
      const res = await normalizarDireccion({
        calleNombre,
        altura,
        provinciaNombre: provinciaName,
        localidadNombre: localidadName,
      });
      const canonical =
        res?.canonical ??
        `${calleNombre} ${altura}, ${localidadName}, ${provinciaName}, Argentina`;
      const coords = res?.lat && res?.lon ? { lat: res.lat, lng: res.lon } : null;

      onChange(canonical, coords);
      setOpen(false);
    } finally {
      setConfirming(false);
    }
  };

  // Reset al cambiar provincia
  const handleProvinciaChange = (id: string) => {
  setProvinciaId(id);
  const provName = provincias.find(p => String(p.id) === String(id))?.name ?? '';
  setProvinciaName(provName);

  // reset pasos y locks
  setLocalidadId(''); setLocalidadName(''); setQueryLocalidad(''); setLocalidadesSug([]); setLocalidadLocked(false);
  setCalleNombre(''); setQueryCalle(''); setCallesSug([]); setCalleLocked(false);
  setAltura('');
};

  const handleClose = () => setOpen(false);

  // Texto del trigger (placeholder visible si no hay valor)
  const triggerText =
    (buttonLabel && buttonLabel.trim().length > 0)
      ? buttonLabel
      : (value && value.trim().length > 0)
        ? value
        : placeholder;

  return (
    <>
      {/* Trigger que simula input */}
      <Button
        texto={triggerText}
        onPress={() => setOpen(true)}
        styles={buttonStyles3}
      />

      {/* Modal progresivo */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.overlay}
        >
          <TouchableOpacity activeOpacity={1} onPress={handleClose} style={styles.backdrop} />

          <View style={styles.modal}>
            <Text style={styles.title}>Seleccioná la ubicación</Text>

            {/* 1) Provincia (DropDown2) */}
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

            {/* 2) Localidad (solo si hay provincia) */}
            {provinciaId ? (
              <View style={styles.block}>
                <View style={styles.suggestWrapper}>
                  <Input
                    placeholder="Localidad"
                    value={queryLocalidad}
                    onChangeText={(txt) => { setLocalidadLocked(false); setQueryLocalidad(txt); }}
                    styles={{...inputStyles1, inputContainer: {...inputStyles1.inputContainer, width: 310}}}
                  />
                  {!!localidadesSug.length && (
                    <Suggestions
                      sugerencias={localidadesSug}
                      onSeleccionar={handleSelectLocalidad}
                      styles={suggestionsStyles2}
                    />
                  )}
                </View>

              </View>
            ) : null}

            {/* 3) Calle + Altura juntos (solo si hay localidad) */}
            {localidadId ? (
              <View style={styles.block}>
                <View style={styles.rowCalleAltura}>
                  <View style={[styles.suggestWrapper, styles.colGrow]}>
                    <Input
                      placeholder="Calle"
                      value={queryCalle}
                      onChangeText={(txt) => { setCalleLocked(false); setQueryCalle(txt); }}
                      styles={{...inputStyles1, inputContainer: {...inputStyles1.inputContainer, width: 200}}}
                    />
                    {!!callesSug.length && (
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
                      styles={{...inputStyles1, inputContainer: {...inputStyles1.inputContainer, width: 100}}}
                    />
                  </View>
                </View>
              </View>
            ) : null}

            {/* Acciones */}
            <View style={styles.actions}>
              <Button
                texto="Cancelar"
                onPress={handleClose}
                styles={{boton: {...buttonStyles1.boton, width: 150, borderRadius: 999, backgroundColor: Colors.gray12, height: 45}, texto: {...buttonStyles1.texto, color: Colors.black, fontSize: 15, fontFamily: 'interMedium'}}}
              />
              <Button
                texto={confirming ? 'Guardando…' : 'Guardar'}
                onPress={handleConfirm}
                styles={{texto:{...buttonStyles1.texto, fontSize: 15}, boton: {...buttonStyles1.boton, width: 150, borderRadius: 999, height: 45}}}
                disabled={!canConfirm || confirming}
                loading={confirming}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
