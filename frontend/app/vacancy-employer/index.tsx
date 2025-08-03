import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { Input } from '../../components/Input';
import { useCheckVacancy } from '@/hooks/vacancy-employer/useCheckVacancy';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { checkVacancyStyles as styles } from '@/styles/app/vacancy-employer/checkVacancyStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';

export default function CheckVacancyScreen() {
  const {
    currentEvent,
    events,
    currentEventIndex,
    handleNextEvent,
    handlePrevEvent,
    search,
    setSearch,
    showPublished,
    setShowPublished,
    sortAsc,
    setSortAsc,
    filteredVacantes,
    goToEditEvent,
    goToCreateEvent,
    goToCreateVacancy,
    goToVacancyDetail
  } = useCheckVacancy();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Header con título y + */}
          <View style={styles.headerRow}>

            <Text style={styles.title}>Eventos</Text>

            <TouchableOpacity style={styles.addEventButton} onPress={goToCreateEvent}>
              <Text style={styles.addEventButtonText}>+</Text>
            </TouchableOpacity>

            <Image
              source={require('@/assets/images/jex/Jex-Diseñando.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />
          </View>

          {/* SI NO HAY EVENTOS */}
          {events.length === 0 ? (
          <View style={styles.noEventsCard}>
            <Text style={styles.noEventsTitle}>Aun no has creado ningún evento!!</Text>
            
            {/* Imagen */}
            <Image
              source={require('@/assets/images/jex/Jex-Olvidadizo.png')}
              style={styles.noEventsImage}
              resizeMode="contain"
            />
              
              <Text style={styles.noEventsSubtitle}>
                Aprieta el boton + para crear un nuevo evento.
              </Text>
            </View>
          ) : (
            <>
              {/* Contenedor del evento */}
              <View style={styles.eventCard}>
                {currentEventIndex > 0 && (
                  <TouchableOpacity onPress={handlePrevEvent}>
                    {iconos.flechaIzquierda(24, Colors.violet4)}
                  </TouchableOpacity>
                )}

                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventName}>{currentEvent?.nombre}</Text>
                  <Text style={styles.eventDetail}>Fecha: {currentEvent?.fecha}</Text>
                  <Text style={styles.eventDetail}>Horario: {currentEvent?.horario}</Text>
                  <Text style={styles.eventDetail}>Ubicación: {currentEvent?.ubicacion}</Text>
                </View>

                {currentEventIndex < events.length - 1 && (
                  <TouchableOpacity onPress={handleNextEvent}>
                    {iconos.flechaDerecha(24, Colors.violet4)}
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={goToEditEvent} style={styles.editEventButton}>
                  {iconos.editar(22, Colors.violet4)}
                </TouchableOpacity>
              </View>

              {/* Buscador */}
              <View style={styles.searchContainer}>
                <Input
                  placeholder="Buscar vacante"
                  value={search}
                  onChangeText={setSearch}
                  styles={inputStyles1}
                />
              </View>

              {/* Filtros */}
              <View style={styles.filtersRow}>
                <TouchableOpacity
                  style={[styles.filterButton, showPublished && styles.filterButtonActive]}
                  onPress={() => setShowPublished(true)}
                >
                  <Text style={[styles.filterText, showPublished && styles.filterTextActive]}>
                    Publicadas
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterButton, !showPublished && styles.filterButtonActive]}
                  onPress={() => setShowPublished(false)}
                >
                  <Text style={[styles.filterText, !showPublished && styles.filterTextActive]}>
                    Borradores
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addVacancyButton} onPress={goToCreateVacancy}>
                  <Text style={styles.addVacancyButtonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sortButton} onPress={() => setSortAsc(!sortAsc)}>
                  {iconos.ordenarFlechas(
                    18,
                    sortAsc ? Colors.violet4 : Colors.gray3
                  )}
                </TouchableOpacity>
              </View>

              {/* Lista de vacantes */}
              <FlatList
                data={filteredVacantes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.vacancyCard}
                    onPress={() => goToVacancyDetail(item.id)}
                  >
                    <View style={styles.vacancyInfo}>
                      <View style={styles.vacancyEstadoBadge}>
                        <Text style={styles.vacancyEstadoText}>
                          {item.estado}
                        </Text>
                      </View>
                      <Text style={styles.vacancyNombre}>{item.nombre}</Text>
                    </View>
                    {iconos.flechaDerecha(22, Colors.violet4)}
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
