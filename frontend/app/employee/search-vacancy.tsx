import React from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { searchVacancyStyles as styles } from '@/styles/app/employee/searchVacancyStyles';
import { OrderButton } from '@/components/OrderButton';
import { SelectableTag } from '@/components/SelectableTags';
import { ShowVacancy } from '@/components/ShowVacancy';
import { useSearchVacancy } from '@/hooks/employee/useSearchVacancy';
import { Colors } from '@/themes/colors';

// Tipo de dato para la vacante
interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  image_url?: string | null;
}

export default function SearchVacancyScreen() {
  const {
    search,
    setSearch,
    vacancies,
    selectedFilter,
    selectedOrder,
    handleSubmitSearch,
    handleChangeOrder,
    handleChangeFilter,
    handleLoadMore,
    loading,
  } = useSearchVacancy();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          {/* 🔹 Input de búsqueda */}
          <Input
            styles={inputStyles1}
            placeholder="Buscar"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSubmitSearch}
            returnKeyType="search"
            showIcon
            iconName="search"
          />

          {/* 🔹 Botón de orden */}
          <OrderButton
            options={
              selectedFilter === 'start_date'
                ? ['Mayor pago', 'Menor pago', 'Rol A-Z', 'Rol Z-A']
                : ['Mayor pago', 'Menor pago', 'Fecha más reciente', 'Fecha más lejana']
            }
            defaultOption={selectedOrder} // ✅ opción seleccionada inicialmente
            onSelect={handleChangeOrder}  // ✅ callback cuando seleccionás otra
          />

          {/* 🔹 Botones de filtro */}
          <View style={styles.tagsRow}>
            <SelectableTag
              title="Rol"
              selected={selectedFilter === 'role'}
              onPress={() => handleChangeFilter('role')}
            />
            <SelectableTag
              title="Fecha"
              selected={selectedFilter === 'start_date'}
              onPress={() => handleChangeFilter('start_date')}
            />
            <SelectableTag
              title="Evento"
              selected={selectedFilter === 'event'}
              onPress={() => handleChangeFilter('event')}
            />
          </View>

          {/* 🔹 Lista de resultados con Infinite Scroll */}
          <FlatList
            data={vacancies}
            keyExtractor={(item: Vacancy) => item.vacancy_id.toString()}
            renderItem={({ item }: { item: Vacancy }) => (
              <ShowVacancy
                vacancy={item}            // ✅ pasamos el objeto completo
                orientation="horizontal"  // o "vertical" si querés tarjetas grandes
                onPress={(vacancy) => console.log('Vacancy seleccionada:', vacancy)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            onEndReached={handleLoadMore}       // ✅ carga más al llegar al final
            onEndReachedThreshold={0.5}         // ✅ dispara al 50% del final
            ListFooterComponent={
              loading ? (
                <ActivityIndicator color={Colors.violet3} size="large" />
              ) : null
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
