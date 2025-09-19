import { iconos } from '@/constants/iconos';
import { useHomeEmployer } from '@/hooks/employer/useHomeEmployer';
import { homeEmployerStyles as styles } from '@/styles/app/employer/homeEmployerStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/input/Input';
import { IconButton } from '@/components/button/IconButton';
import { iconButtonStyles1 } from '../../styles/components/button/iconButtonStyles1';
import { SelectableTag } from '@/components/button/SelectableTags';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { ScrollView } from 'react-native-gesture-handler';

export default function useHomeEmployerScreen() {
  const {
    currentEvent,
    currentEventIndex,
    events,
    filteredVacantes,
    loading,
    handleNextEvent,
    handlePrevEvent,
    goToEditEvent,
    goToCreateEvent,
    goToCreateVacancy,
    goToVacancyDetail,
    search, 
    setSearch,
    selectableStates,
    selectedState, setSelectedState,
  } = useHomeEmployer();

  return (

    <ScrollView>

      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View>

            <View style={styles.headerRow}>

              <Text style={styles.title}>Eventos</Text>

              <View style={styles.addEventButton}>

                <IconButton
                  sizeButton={30}
                  sizeContent={20}
                  styles={iconButtonStyles1}
                  onPress={goToCreateEvent}
                  content="add"
                  backgroundColor={Colors.gray2}
                  contentColor={Colors.white}
                />

              </View>
              
            </View>

            {events.length === 0 ? (

              // No hay eventos

              <View style={styles.noEventsCard}>

                <Text style={styles.noEventsTitle}>No tienes ningún evento activo</Text>
                
                <Image
                  source={require('@/assets/images/jex/Jex-Sin-Eventos.png')}
                  style={styles.noEventsImage}
                  resizeMode="contain"
                />
                  
                <Text style={styles.noEventsSubtitle}>
                  Apretá el botón + para crear tu próximo evento
                </Text>

              </View>

            ) : (

              // Si hay Eventos

                <>

                  <View style={styles.eventRow}>

                    <View style={styles.sideSlot}>
                      {currentEventIndex > 0 ? (
                        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={handlePrevEvent}>
                          {iconos.flechaIzquierda(24, Colors.violet4)}
                        </TouchableOpacity> 
                      ) : null}

                    </View>

                    <View style={styles.centerSlot}>

                      <Text style={styles.eventName}>{currentEvent?.nombre}</Text>

                    </View>

                    <View style={styles.sideSlot}>

                      {currentEventIndex < events.length - 1 ? (
                        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={handleNextEvent}>
                          {iconos.flechaDerecha(24, Colors.violet4)}
                        </TouchableOpacity>
                      ) : null}

                    </View>

                  </View>

                  <View style={styles.eventCard}>

                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventDetail}>Inicio: {currentEvent?.inicio}</Text>
                      <Text style={styles.eventDetail}>Fin: {currentEvent?.fin}</Text>
                      <Text style={styles.eventDetail}>Ubicación: {currentEvent?.ubicacion}</Text>
                    </View>

                    <TouchableOpacity onPress={() => goToEditEvent(currentEvent.id)}>
                      {iconos.editar(22, Colors.violet4)}
                    </TouchableOpacity>

                  </View>

                  <View style={styles.searchRow}>

                    <Input
                      placeholder="Buscar vacante"
                      value={search}
                      onChangeText={setSearch}
                      iconName='search'
                      showIcon
                      styles={{inputContainer: {...inputStyles1. inputContainer, height:50, width:300, paddingVertical: 4}, input:inputStyles1.input}}
                    />

                    <IconButton
                      sizeButton={35}
                      sizeContent={25}
                      styles={iconButtonStyles1}
                      onPress={() => goToCreateVacancy(currentEvent.id, currentEvent.fechaInicio, currentEvent.fechaFin)}
                      content="add-outline"
                      backgroundColor={Colors.violet4}
                      contentColor={Colors.white}
                    />

                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersTags}
                  >
                    {selectableStates.map((state) => (
                      <SelectableTag
                        key={state}
                        styles={selectableTagStyles2}
                        title={state}
                        selected={selectedState === state}
                        onPress={() => {
                          setSelectedState(prev => (prev === state ? null : (state as any)));
                        }}
                      />
                    ))}
                  </ScrollView>

                  <View>
                    {filteredVacantes.map((item) => (
                      <TouchableOpacity
                        key={String(item.id)}
                        style={styles.vacancyCard}
                        onPress={() => goToVacancyDetail(item.id)}
                      >
                        <View style={styles.vacancyInfo}>
                          <View style={styles.vacancyEstadoBadge}>
                            <Text style={styles.vacancyEstadoText}>{item.estado}</Text>
                          </View>
                          <Text style={styles.vacancyNombre}>{item.nombre}</Text>
                        </View>
                        {iconos.flechaDerecha(22, Colors.violet4)}
                      </TouchableOpacity>
                    ))}
                  </View>

                </>

            )}
          </View>

        </TouchableWithoutFeedback>

      </SafeAreaView>

    </ScrollView>
  );
}
