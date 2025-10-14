import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { IconButton } from '@/components/button/IconButton';
import { Carousel } from '@/components/others/Carousel';
import { ShowVacancy } from '@/components/specifics/ShowVacancy';
import { iconos } from '@/constants/iconos';
import { Vacancy } from '@/constants/interfaces';
import HomeSkeleton from '@/constants/skeletons/employee/homeSkeleton';
import { useHomeEmployee } from '@/hooks/employee/useHomeEmployee';
import { homeScreenEmployeeStyles as styles } from '@/styles/app/employee/homeScreenStyles';
import { buttonWithIconStyles2 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles2';
import { iconButtonStyles1 } from '@/styles/components/button/iconButtonStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeEmployeeScreen () {
  const {
    sections,
    loadingComienzo,
    errorVacancies,
    goToSearchVacancy,
    goToVacancyDetails,
    goToNotifications
  } = useHomeEmployee();

    const handleVacancyPress = (vacancy: Vacancy) => {
    goToVacancyDetails(vacancy);
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.headerRow}>

          <Text style={styles.title}>Vacantes</Text>
          
          <IconButton
            sizeContent={40}
            styles={iconButtonStyles1}
            onPress={goToNotifications}
            content="notifications-circle-sharp"
            contentColor={Colors.violet4}
          />
          
        </View>
        
        {loadingComienzo ? (
          <HomeSkeleton />
        ) : (
          <>
            <View>
              <ButtonWithIcon
                texto="Buscar"
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
