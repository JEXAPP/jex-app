import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const registerVacancyCustomStyles = StyleSheet.create({
  requerimientoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  requerimientoIndex: {
    marginRight: 6,
    fontWeight: 'bold',
  },
  requerimientoInput: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray2,
    marginRight: 6,
    minHeight: 38,         // <-- NUEVO: alto del campo
    fontSize: 16,       // <-- NUEVO: tamaño del texto
    paddingVertical: 10 // <-- Opcional: para más espacio vertical interno
  },

  turnoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  halfWidth: {
    width: '48%',
    marginBottom: 12,
  },

  pickerInput: {
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    height: 44,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});