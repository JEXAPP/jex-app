import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ajustá el path según dónde pusiste el componente:
import Suggestions from '../picker/Suggestions';
import DatePicker from '@/components/picker/DatePicker';
import { Colors } from '@/themes/colors';
import { suggestionsStyles2 } from '@/styles/components/picker/suggestionsStyles/suggestionsStyles2';

type Mode = 'text-suggestions' | 'text' | 'date';
interface Option { id: number | string; label: string; }

interface SearchInputProps {
  mode: Mode;

  suggestions?: Option[];
  fetchSuggestions?: (query: string) => void;

  onChange: (results: string[]) => void;

  placeholder?: string;
  stylesInput: any;

  dropdownPlacement?: 'auto' | 'above' | 'below';
  dropdownVisibleCount?: number;

  // DatePicker
  datePickerStyles: any;
  dateLabel?: string;
  allowRange?: boolean;
}

const formatDMY = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default function SearchInput({
  mode,
  suggestions = [],
  fetchSuggestions,
  onChange,
  placeholder = 'Buscar...',
  stylesInput,
  dropdownPlacement = 'below', // ya no se usa aquí, queda por compatibilidad
  dropdownVisibleCount = 6,    // ya no se usa aquí, queda por compatibilidad
  datePickerStyles,
  dateLabel = 'Seleccioná una fecha',
  allowRange = true,
}: SearchInputProps) {
  const inputRef = useRef<TextInput>(null);
  const anchorRef = useRef<View>(null);

  // textos
  const [inputValue, setInputValue] = useState('');
  const [selectedTexts, setSelectedTexts] = useState<string[]>([]);
  const [openSuggestions, setOpenSuggestions] = useState(false);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (mode === 'text-suggestions') {
      const q = text.trim();
      if (q.length >= 1) {
        fetchSuggestions?.(q);
        setOpenSuggestions(true);
      } else {
        setOpenSuggestions(false);
      }
    }
  };

  const pushTexts = (next: string[]) => {
    setSelectedTexts(next);
    onChange(next);
  };

  const addText = (label: string) => {
    const val = label.trim();
    if (!val) return;
    if (selectedTexts.includes(val)) return;
    const next = [...selectedTexts, val];
    pushTexts(next);
    setInputValue('');
    setOpenSuggestions(false);
    setTimeout(() => inputRef.current?.focus(), 0); // mantener teclado abierto
  };

  const commitCurrentText = () => {
    const q = inputValue.trim();
    if (!q) return;
    addText(q); // sugerencias opcionales
  };

  const removeText = (label: string) => {
    const next = selectedTexts.filter(t => t !== label);
    pushTexts(next);
  };

  // mapear a la forma requerida por tu componente Suggestions
  const mappedSuggestions = useMemo(
    () =>
      (suggestions ?? []).map(s => ({
        descripcion: s.label,
        placeId: String(s.id),
      })),
    [suggestions]
  );

  // fechas
  const today = useMemo(() => { const t = new Date(); t.setHours(0,0,0,0); return t; }, []);
  const maxDate = useMemo(() => new Date(new Date().getFullYear() + 10, 11, 31, 0, 0, 0, 0), []);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  const handleSetDate = (d: Date) => {
    setSingleDate(d);
    setRange({ start: null, end: null });
    onChange([formatDMY(d)]);
    setOpenDateModal(false);
  };

  const handleSetRange = (r: { start: Date | null; end: Date | null }) => {
    setRange(r);
    setSingleDate(null);
    if (r.start && r.end) {
      onChange([formatDMY(r.start), formatDMY(r.end)]);
      setOpenDateModal(false);
    }
  };

  const clearDate = () => {
    setSingleDate(null);
    setRange({ start: null, end: null });
    onChange([]);
  };

  const showChips = mode === 'text' || mode === 'text-suggestions';

  useEffect(() => {
    if (mode !== 'text-suggestions') return;
    const hasQuery = inputValue.trim().length >= 1;
    const hasData = (suggestions?.length ?? 0) > 0;
    setOpenSuggestions(hasQuery && hasData);
  }, [suggestions, mode, inputValue]);

  return (
    <View style={stylesInput.container}>
      <View
        ref={anchorRef}
        style={[
          stylesInput.inputWrapper,
          { position: 'relative', overflow: 'visible', zIndex: 9999 }
        ]}
      >
        {/* Siempre lupa a la izquierda */}
        <TouchableOpacity onPress={commitCurrentText}>
          <Ionicons name="search" size={22} color="#888" style={stylesInput.searchIcon} />
        </TouchableOpacity>

        {/* Modos de texto: chips en una sola fila con scroll horizontal */}
        {showChips ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={stylesInput.chipsRowScroll}
            style={stylesInput.chipsRowScrollContainer}
          >
            {selectedTexts.map(txt => (
              <View key={txt} style={stylesInput.chip}>
                <Text style={stylesInput.chipText}>{txt}</Text>
                <TouchableOpacity onPress={() => removeText(txt)}>
                  <Ionicons name="close" size={16} color="#555" style={stylesInput.chipClose} />
                </TouchableOpacity>
              </View>
            ))}

            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={handleInputChange}
              onSubmitEditing={commitCurrentText}
              placeholder={placeholder}
              cursorColor={Colors.violet3}
              style={stylesInput.textInputInline}
              blurOnSubmit={false}
              returnKeyType="done"
              onFocus={() => {
                if (mode === 'text-suggestions' && inputValue.trim().length >= 1) setOpenSuggestions(true);
              }}
            />
          </ScrollView>
        ) : (
          // Modo fecha: todo el input abre el DatePicker
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpenDateModal(true)}
            style={stylesInput.dateSummaryWrapper}
          >
            {singleDate && (
              <View style={stylesInput.chip}>
                <Text style={stylesInput.chipText}>{formatDMY(singleDate)}</Text>
                <TouchableOpacity onPress={clearDate}>
                  <Ionicons name="close" size={16} color="#555" style={stylesInput.chipClose} />
                </TouchableOpacity>
              </View>
            )}

            {!singleDate && range.start && range.end && (
              <View style={stylesInput.rangeRow}>
                <View style={stylesInput.chip}><Text style={stylesInput.chipText}>{formatDMY(range.start)}</Text></View>
                <Text style={stylesInput.rangeSeparator}>—</Text>
                <View style={stylesInput.chip}><Text style={stylesInput.chipText}>{formatDMY(range.end)}</Text></View>
                <TouchableOpacity onPress={clearDate} style={stylesInput.clearRangeBtn}>
                  <Ionicons name="close" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            )}

            {!singleDate && !range.start && !range.end && (
              <Text style={stylesInput.datePlaceholder}>{dateLabel}</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Panel de sugerencias inline (usa tu componente) */}
        {mode === 'text-suggestions' && openSuggestions && mappedSuggestions.length > 0 && (
          <Suggestions
            sugerencias={mappedSuggestions}
            onSeleccionar={(item) => addText(item.descripcion)}
            styles={suggestionsStyles2}
          />
        )}
      </View>

      {/* DatePicker inline controlado */}
      {mode === 'date' && (
        <DatePicker
          variant="inline"
          open={openDateModal}
          onOpenChange={setOpenDateModal}
          label={dateLabel}
          styles={datePickerStyles}
          minimumDate={today}
          maximumDate={maxDate}
          date={singleDate}
          setDate={handleSetDate}
          allowRange={allowRange}
          allowModeToggle={allowRange}
          dateRange={range}
          setDateRange={handleSetRange}
          defaultDate={today}
          defaultRange={{ start: today }}
        />
      )}
    </View>
  );
}
