import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, KeyboardAvoidingView,
  Platform, Keyboard, TextInput
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
} from '@/services/external/sugerencias/useGeoRefAr';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { Colors } from '@/themes/colors';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { ClickWindow } from '@/components/window/ClickWindow';

type Option = { id: string; name: string };

type LocationAddressPickerProps = {
  placeholder: string;
  value?: string | null;
  onChange: (direccion: string, coords: { lat: number; lng: number } | null) => void;
  buttonLabel?: string;
};

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function round10(n: number) { return parseFloat(n.toFixed(10)); }
function avg(nums: number[]) { if (!nums.length) return NaN; return nums.reduce((a, b) => a + b, 0) / nums.length; }

export default function LocationAddressPicker({
  placeholder,
  value,
  onChange,
  buttonLabel,
}: LocationAddressPickerProps) {
  const [open, setOpen] = useState(false);

  const [provincias, setProvincias] = useState<Option[]>([]);
  const [provinciaId, setProvinciaId] = useState('');
  const [provinciaName, setProvinciaName] = useState('');

  const [localidadQuery, setLocalidadQuery] = useState('');
  const debouncedLocalidad = useDebounced(localidadQuery, 250);
  const [localidadesSug, setLocalidadesSug] = useState<{ descripcion: string; placeId: string }[]>([]);
  const [localidadId, setLocalidadId] = useState('');
  const [localidadName, setLocalidadName] = useState('');

  const [calleQuery, setCalleQuery] = useState('');
  const debouncedCalle = useDebounced(calleQuery, 250);
  const [callesSug, setCallesSug] = useState<{ descripcion: string; placeId: string }[]>([]);
  const [calleNombre, setCalleNombre] = useState('');
  const [altura, setAltura] = useState('');

  const [confirming, setConfirming] = useState(false);
  const [cwVisible, setCwVisible] = useState(false);
  const [cwTitle, setCwTitle] = useState('Ubicación sin coordenadas');
  const [cwMsg, setCwMsg] = useState('');

  // Refs
  const locRef = useRef<TextInput>(null);
  const calleRef = useRef<TextInput>(null);
  const alturaRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const provs = await listarProvincias();
        setProvincias(provs.map(p => ({ id: p.id, name: p.nombre })));
      } catch {
        setProvincias([]);
      }
    })();
  }, [open]);

  // Si se edita manualmente la localidad, limpiar dependencias
  useEffect(() => {
    if (localidadId && localidadQuery.trim() !== localidadName.trim()) {
      setLocalidadId('');
      setLocalidadName('');
      setCalleNombre('');
      setCalleQuery('');
      setAltura('');
      setCallesSug([]);
    }
  }, [localidadQuery, localidadId, localidadName]);

  // Si se edita manualmente la calle, des-seleccionar si ya no coincide
  useEffect(() => {
    if (calleNombre && calleQuery.trim() !== calleNombre.trim()) {
      setCalleNombre('');
    }
  }, [calleQuery, calleNombre]);

  // Sugerencias de localidades
  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!provinciaId || debouncedLocalidad.trim().length < 2) {
        if (!cancel) setLocalidadesSug([]);
        return;
      }
      try {
        const s = await buscarLocalidades(provinciaId, debouncedLocalidad.trim());
        if (!cancel) setLocalidadesSug(s);
      } catch {
        if (!cancel) setLocalidadesSug([]);
      }
    })();
    return () => { cancel = true; };
  }, [provinciaId, debouncedLocalidad]);

  // Sugerencias de calles
  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!provinciaId || !localidadId || debouncedCalle.trim().length < 2) {
        if (!cancel) setCallesSug([]);
        return;
      }
      try {
        const s = await buscarCalles({ provinciaId, localidadId, localidadName, q: debouncedCalle.trim() });
        if (!cancel) setCallesSug(s);
      } catch {
        if (!cancel) setCallesSug([]);
      }
    })();
    return () => { cancel = true; };
  }, [provinciaId, localidadId, localidadName, debouncedCalle]);

  // ---------- Handlers de selección (inmediatos) ----------
  const handleSelectLocalidad = (it: { descripcion: string; placeId: string }) => {
    // 1) parse
    const parts = Object.fromEntries(it.placeId.split('|').map(kv => {
      const [k, ...r] = kv.split(':'); return [k, r.join(':')];
    }));
    const locId = parts['loc'] || '';
    const locName = parts['locName'] || it.descripcion.split(',')[0]?.trim() || '';

    // 2) set estado primero (sin delays)
    setLocalidadId(locId);
    setLocalidadName(locName);
    setLocalidadQuery(locName);

    // 3) reset dependientes y ocultar sugerencias
    setCalleNombre('');
    setCalleQuery('');
    setAltura('');
    setCallesSug([]);
    setLocalidadesSug([]); // ocultar lista

    // 4) cerrar teclado y pasar foco al siguiente (pequeño delay para evitar carrera)
    setTimeout(() => {
      Keyboard.dismiss();
      calleRef.current?.focus();
    }, 50);
  };

  const handleSelectCalle = (it: { descripcion: string; placeId: string }) => {
    const parts = Object.fromEntries(it.placeId.split('|').map(kv => {
      const [k, ...r] = kv.split(':'); return [k, r.join(':')];
    }));
    const cName = parts['calleName'] || it.descripcion.split(',')[0]?.trim() || '';

    setCalleNombre(cName);
    setCalleQuery(cName);
    setCallesSug([]); // ocultar lista

    setTimeout(() => {
      Keyboard.dismiss();
      alturaRef.current?.focus();
    }, 50);
  };
  // -------------------------------------------------------

  const canConfirm = useMemo(() =>
    Boolean(provinciaName && localidadId && localidadName && calleNombre && Number(altura) > 0),
    [provinciaName, localidadId, localidadName, calleNombre, altura]
  );

  async function fetchDirecciones({
    direccion, provincia, localidad_censal, max = 1,
  }: { direccion: string; provincia: string; localidad_censal: string; max?: number; }) {
    const base = 'https://apis.datos.gob.ar/georef/api/direcciones';
    const params = new URLSearchParams({
      direccion, provincia, localidad_censal, aplanar: 'true', max: String(max),
    });
    const url = `${base}?${params.toString()}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  const handleConfirm = async () => {
    if (!canConfirm) return;
    try {
      setConfirming(true);

      const direccionConAltura = `${calleNombre} ${altura}`;
      const prov = provinciaName;
      const loc = localidadName;

      // 1) Buscar con altura
      let data = await fetchDirecciones({ direccion: direccionConAltura, provincia: prov, localidad_censal: loc, max: 1 });
      if (data?.total > 0 && Array.isArray(data.direcciones) && data.direcciones.length > 0) {
        const d = data.direcciones[0];
        const lat = d?.ubicacion_lat, lon = d?.ubicacion_lon;
        if (typeof lat === 'number' && typeof lon === 'number') {
          const canonical = d?.nomenclatura ?? `${direccionConAltura}, ${loc}, ${prov}`;
          onChange(canonical, { lat: round10(lat), lng: round10(lon) });
          setOpen(false);
          return;
        }
      }

      // 2) Fallback: sin altura → promedio
      data = await fetchDirecciones({ direccion: calleNombre, provincia: prov, localidad_censal: loc, max: 10 });
      if (data?.total > 0 && Array.isArray(data.direcciones) && data.direcciones.length > 0) {
        const lats = data.direcciones.map((d: any) => d?.ubicacion_lat).filter((n: any) => typeof n === 'number') as number[];
        const lons = data.direcciones.map((d: any) => d?.ubicacion_lon).filter((n: any) => typeof n === 'number') as number[];
        if (lats.length && lons.length) {
          const latAvg = round10(avg(lats));
          const lonAvg = round10(avg(lons));
          const canonical = (data.direcciones[0]?.nomenclatura as string) ?? `${calleNombre}, ${loc}, ${prov}`;
          onChange(canonical, { lat: latAvg, lng: lonAvg });
          setCwTitle('Altura no encontrada con coordenadas');
          setCwMsg(`No se hallaron coordenadas para "${direccionConAltura}". Se usó la ubicación promedio de "${calleNombre}" en "${loc}".`);
          setCwVisible(true);
          setOpen(false);
          return;
        }
      }

      // 3) Sin coords
      const canonical = `${calleNombre} ${altura}, ${loc}, ${prov}`;
      onChange(canonical, null);
      setCwTitle('No se encontraron coordenadas');
      setCwMsg(`No fue posible obtener coordenadas para "${direccionConAltura}" ni para la calle sin altura en "${loc}". Verificá calle, altura y localidad.`);
      setCwVisible(true);
      setOpen(false);
    } catch {
      const canonical = `${calleNombre} ${altura}, ${localidadName}, ${provinciaName}`;
      onChange(canonical, null);
      setCwTitle('Error consultando la dirección');
      setCwMsg('No pudimos validar la dirección en este momento. Intentá nuevamente.');
      setCwVisible(true);
    } finally {
      setConfirming(false);
    }
  };

  const handleProvinciaChange = (id: string) => {
    setProvinciaId(id);
    const provName = provincias.find(p => String(p.id) === String(id))?.name ?? '';
    setProvinciaName(provName);

    setLocalidadId(''); setLocalidadName(''); setLocalidadQuery(''); setLocalidadesSug([]);
    setCalleNombre(''); setCalleQuery(''); setCallesSug([]);
    setAltura('');
  };

  const handleClose = () => {
    setOpen(false);
    setLocalidadesSug([]);
    setCallesSug([]);
  };

  const triggerText =
    (buttonLabel && buttonLabel.trim().length > 0) ? buttonLabel
      : (value && value.trim().length > 0) ? value
      : placeholder;

  return (
    <>
      <Button texto={triggerText} onPress={() => setOpen(true)} styles={buttonStyles3} />

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

            {/* LOCALIDAD */}
            {!!provinciaId && (
              <View style={styles.block}>
                <View
                  style={styles.suggestWrapper}
                  onStartShouldSetResponderCapture={() => { Keyboard.dismiss(); return false; }}
                  collapsable={false}
                >
                  <Input
                    placeholder="Localidad"
                    value={localidadQuery}
                    onChangeText={setLocalidadQuery}
                    inputRef={locRef}
                    styles={{ ...inputStyles1, inputContainer: { ...inputStyles1.inputContainer, width: 310 } }}
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
            )}

            {/* CALLE + ALTURA */}
            {!!localidadId && (
              <View style={styles.block}>
                <View style={styles.rowCalleAltura}>
                  <View
                    style={styles.suggestWrapper}
                    pointerEvents="box-none"
                    onStartShouldSetResponderCapture={() => { Keyboard.dismiss(); return false; }}
                    collapsable={false}
                  >
                    <Input
                      placeholder="Calle"
                      value={calleQuery}
                      onChangeText={setCalleQuery}
                      inputRef={calleRef}
                      styles={{ ...inputStyles1, inputContainer: { ...inputStyles1.inputContainer, width: 200 } }}
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
                      inputRef={alturaRef}
                      styles={{ ...inputStyles1, inputContainer: { ...inputStyles1.inputContainer, width: 100 } }}
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
                  boton: { ...buttonStyles1.boton, width: 150, borderRadius: 999, backgroundColor: Colors.gray12, height: 45 },
                  texto: { ...buttonStyles1.texto, color: Colors.black, fontSize: 15, fontFamily: 'interMedium' }
                }}
              />
              <Button
                texto={confirming ? 'Guardando…' : 'Guardar'}
                onPress={handleConfirm}
                styles={{ texto: { ...buttonStyles1.texto, fontSize: 15 }, boton: { ...buttonStyles1.boton, width: 150, borderRadius: 999, height: 45 } }}
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
