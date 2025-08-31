import { OrderButton } from '@/components/button/OrderButton';
import { SelectableTag } from '@/components/button/SelectableTags';
import SearchInput from '@/components/input/SearchInput';
import { ShowVacancy } from '@/components/specifics/ShowVacancy';
import { Vacancy } from '@/constants/interfaces';
import SearchVacancySkeleton from '@/constants/skeletons/employee/vacancy/searchVacancySkeleton';
import { useSearchVacancy } from '@/hooks/employee/vacancy/useSearchVacancy';
import { searchVacancyStyles as styles } from '@/styles/app/employee/vacancy/searchVacancyStyles';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { searchInputStyles1 } from '@/styles/components/input/searchInputStyles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles1';
import React, { useMemo } from 'react';
import { FlatList, Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchVacancyScreen() {
  const {
    opciones,
    suggestions,
    fetchSuggestions,
    vacancies,
    selectedFilter,
    selectedOrder,
    handleSubmitSearch,
    handleChangeOrder,
    handleChangeFilter,
    handleLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
    goToVacancyDetails,
    hasSearched
  } = useSearchVacancy();

  const inputMode = useMemo<'text-suggestions' | 'text' | 'date'>(() => {
    if (selectedFilter === 'role') return 'text-suggestions';
    if (selectedFilter === 'date') return 'date';
    return 'text'; // event
  }, [selectedFilter]);

  const placeholder = useMemo(() => {
    if (selectedFilter === 'role') return 'Buscar rol';
    if (selectedFilter === 'date') return 'Seleccioná una fecha';
    return 'Buscar evento';
  }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          {/* Input de búsqueda */}
          <SearchInput
            key={`search-${selectedFilter}`}
            mode={inputMode}
            suggestions={inputMode === 'text-suggestions' ? suggestions : []}
            fetchSuggestions={inputMode === 'text-suggestions' ? fetchSuggestions : undefined}
            onChange={handleSubmitSearch}
            placeholder={placeholder}
            stylesInput={searchInputStyles1}
            datePickerStyles={datePickerStyles1}
            allowRange={true}
          />

          <View style={styles.secondRow}>

            {/* Filtros */}
            <View style={styles.tagsRow}>
              <SelectableTag
                styles={selectableTagStyles2}
                title="Rol"
                selected={selectedFilter === 'role'}
                onPress={() => handleChangeFilter('role')}
              />
              <SelectableTag
                styles={selectableTagStyles2}
                title="Fecha"
                selected={selectedFilter === 'date'}
                onPress={() => handleChangeFilter('date')}
              />
              <SelectableTag
                styles={selectableTagStyles2}
                title="Evento"
                selected={selectedFilter === 'event'}
                onPress={() => handleChangeFilter('event')}
              />
            </View>

            {/* Orden */}
            <OrderButton
              options={opciones}
              dropdownWidth={180}
              defaultOption={selectedOrder}
              onSelect={(orderIndex) => handleChangeOrder(opciones[orderIndex - 1])}
            />

          </View>

          {isLoadingFirstPage && vacancies.length === 0 ? (
            <SearchVacancySkeleton />
          ) : (
          <View style={[styles.results, { flex: 1 }]}>
            {!isLoadingFirstPage && vacancies.length === 0 ? (
              hasSearched ? (
                <View style={styles.noVancancyCard}>
  
                  <Text style={styles.noVancancyTitle}>No se encontraron vacantes</Text>
                  
                  <Image
                    source={require('@/assets/images/jex/Jex-Sin-Trabajo.png')}
                    style={styles.noVancancyImage}
                    resizeMode="contain"
                  />
                    
                  <Text style={styles.noVancancySubtitle}>
                    Seguí explorando para descubrir tu próximo trabajo
                  </Text>
  
                </View>
              ) : (
                <View style={styles.noVancancyCard}>
  
                  <Text style={styles.noVancancyTitle}>Explorá las vacantes disponibles</Text>
                  
                  <Image
                    source={require('@/assets/images/jex/Jex-Sin-Eventos.png')}
                    style={styles.noVancancyImage}
                    resizeMode="contain"
                  />
                    
                  <Text style={styles.noVancancySubtitle}>
                    Empezá a buscar y conectá con tu próximo evento
                  </Text>
  
                </View>
              )
            ) : (
              <FlatList
                data={vacancies}
                keyExtractor={(item: Vacancy) => item.vacancy_id.toString()}
                renderItem={({ item }: { item: Vacancy }) => (
                  <ShowVacancy
                    vacancy={item}
                    orientation="horizontal"
                    onPress={goToVacancyDetails}
                  />
                )}
                contentContainerStyle={{ width: 393, alignItems: 'center' }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoadingMore ? <SearchVacancySkeleton /> : null}
              />
            )}
          </View>
        )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
