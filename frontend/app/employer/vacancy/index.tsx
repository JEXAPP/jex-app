import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/input/Input";
import { IconButton } from "@/components/button/IconButton";
import { iconButtonStyles1 } from "@/styles/components/button/iconButtonStyles1";
import { selectableTagStyles2 } from "@/styles/components/button/selectableTagsStyles/selectableTagsStyles2";
import { SelectableTag } from "@/components/button/SelectableTags";
import { iconos } from "@/constants/iconos";
import { Colors } from "@/themes/colors";
import { inputStyles1 } from "@/styles/components/input/inputStyles/inputStyles1";
import { useVacancies } from "@/hooks/employer/vacancy/useVacancies";
import { vacanciesStyles as styles } from "@/styles/app/employer/vacancy/vacanciesStyles";
import HomeEventsSkeleton from "@/constants/skeletons/employer/homeEventsSkeleton";
import { DotsLoader } from "@/components/others/DotsLoader";

export default function VacanciesScreen() {
  const {
    currentEvent,
    filteredVacantes,
    loading,
    search,
    setSearch,
    selectableStates,
    selectedState,
    setSelectedState,
    goToCreateVacancy,
    goToVacancyDetail,
  } = useVacancies();

  if (loading) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando datos...</Text>
                <View style={{ marginTop: -140 }}>
                  <DotsLoader />
                </View>
              </SafeAreaView>
      );
    }

  if (!currentEvent) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noEventsText}>No hay evento seleccionado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Titulo */}
          <Text style={styles.title}>Vacantes</Text>
          <Text style={styles.eventName}>{currentEvent.nombre}</Text>

          {/* Search + Crear Vacante */}
          <View style={styles.searchRow}>
            <Input
              placeholder="Buscar vacante"
              value={search}
              onChangeText={setSearch}
              iconName="search"
              showIcon
              styles={{
                inputContainer: {
                  ...inputStyles1.inputContainer,
                  height: 50,
                  flex: 1,
                  paddingVertical: 4,
                },
                input: inputStyles1.input,
              }}
            />
            <IconButton
              sizeButton={35}
              sizeContent={27}
              styles={iconButtonStyles1}
              onPress={() =>
                goToCreateVacancy(
                  currentEvent.id,
                  currentEvent.fechaInicio,
                  currentEvent.fechaFin
                )
              }
              content="+"
              backgroundColor={Colors.violet4}
              contentColor={Colors.white}
            />
          </View>

          {/* Filtros */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersTags}
          >
            {selectableStates.map((state: React.Key | null | undefined) => (
              <SelectableTag
                key={state}
                styles={selectableTagStyles2}
                title={state != null ? String(state) : ""}
                selected={selectedState === state}
                onPress={() =>
                  setSelectedState((prev: React.Key | null | undefined) =>
                    prev === state ? null : (state as any)
                  )
                }
              />
            ))}
          </ScrollView>

          {/* Vacantes */}
          <View>
            {filteredVacantes.map((item: { id: any; estado: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; nombre: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
