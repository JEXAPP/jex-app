import { StyleSheet } from 'react-native';

export const searchInputStyles1 = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 8,
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 8,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#E1E9EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginVertical: 4,
  },
  chipText: {
    color: '#333',
  },
  chipClose: {
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 8,
  },
  suggestionList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    color: '#333',
  },
});