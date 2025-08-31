import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { Carousel } from '@/components/others/Carousel';
import HomeSkeleton from '@/constants/skeletons/employee/homeSkeleton';
import { useHomeEmployee } from '@/hooks/employee/useHomeEmployee';
import { homeScreenEmployeeStyles as styles } from '@/styles/app/employee/homeScreenStyles';
import { buttonWithIconStyles2 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles2';
import React from 'react';
import { Image, ScrollView, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { ShowVacancy } from '@/components/specifics/ShowVacancy';
import { Vacancy } from '@/constants/interfaces';

export default function HomeEmployeeScreen () {
  const {
    sections,
    loadingComienzo,
    errorVacancies,
    goToSearchVacancy,
    goToVacancyDetails,
  } = useHomeEmployee();

    const handleVacancyPress = (vacancy: Vacancy) => {
    goToVacancyDetails(vacancy);
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {loadingComienzo ? (
          <HomeSkeleton />
        ) : (
          <>
            <View>
              <ButtonWithIcon
                texto="Buscar vacantes"
                icono={iconos.search(24, Colors.gray3)}
                onPress={goToSearchVacancy}
                styles={{ ...buttonWithIconStyles2, texto: { ...buttonWithIconStyles2.texto, marginLeft: 10 } }}
              />
            </View>

            <View style={styles.adsWrapper}>
              <Image
                source={require('@/assets/images/jex/Jex-Publicidad.png')}
                style={styles.jexBanner}
                resizeMode="cover"
              />
              <Carousel
                images={[
                  require('@/assets/images/Publicidad1.png'),
                  require('@/assets/images/Publicidad2.png'),
                  require('@/assets/images/Publicidad3.png'),
                ]}
              />
            </View>

            {errorVacancies && <Text style={styles.errorText}>{errorVacancies}</Text>}

            {!errorVacancies && sections.map(({ title, data, onPressTitle, showArrow }, idx) => (
              <View key={idx} style={styles.vacancySectionContainer}>
                <TouchableOpacity
                  style={styles.vacancySectionHeader}
                  activeOpacity={showArrow ? 0.7 : 1}
                  onPress={showArrow  ? onPressTitle : undefined}
                >
                  <View style={styles.vacancyTitleRow}>
                    <Text style={styles.vacancyTitle}>{title}</Text>
                    {showArrow && <Text style={styles.vacancyArrow}> ›</Text>}
                  </View>
                </TouchableOpacity>

                <FlatList
                  data={data}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.vacancy_id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.vacancyCardWrapper}>
                      <ShowVacancy
                        vacancy={item}
                        orientation="vertical"
                        onPress={handleVacancyPress}
                      />
                    </View>
                  )}
                />
              </View>
            ))}
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
