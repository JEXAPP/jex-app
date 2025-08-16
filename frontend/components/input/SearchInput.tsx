import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchInputProps {
  suggestions: { id: number | string; label: string }[];
  fetchSuggestions: (query: string) => void;
  onSearch: (selectedIds: (number | string)[]) => void;
  placeholder?: string;
  stylesInput: ReturnType<typeof StyleSheet.create>;
}

export default function SearchInput({
  suggestions,
  fetchSuggestions,
  onSearch,
  placeholder = "Buscar...",
  stylesInput,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<(typeof suggestions)[0][]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (text: string) => {
    setInputValue(text);

    if (text.length >= 3) {
      fetchSuggestions(text);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (option: { id: number | string; label: string }) => {
    if (!selected.some((s) => s.id === option.id)) {
      const newSelected = [...selected, option];
      setSelected(newSelected);
      onSearch(newSelected.map((item) => item.id)); // Solo ID al backend
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemove = (id: number | string) => {
    const newSelected = selected.filter((item) => item.id !== id);
    setSelected(newSelected);
    onSearch(newSelected.map((item) => item.id));
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    onSearch(selected.map((item) => item.id));
  };

  return (
    <View style={stylesInput.container}>
      <View style={stylesInput.inputWrapper}>
        <TouchableOpacity onPress={handleSubmit}>
          <Ionicons name="search" size={22} color="#888" style={stylesInput.searchIcon} />
        </TouchableOpacity>

        {selected.map((item) => (
          <View key={item.id} style={stylesInput.chip}>
            <Text style={stylesInput.chipText}>{item.label}</Text>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Ionicons name="close" size={16} color="#555" style={stylesInput.chipClose} />
            </TouchableOpacity>
          </View>
        ))}

        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          style={stylesInput.textInput}
        />
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={stylesInput.suggestionItem}
            >
              <Text style={stylesInput.suggestionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          style={stylesInput.suggestionList}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

