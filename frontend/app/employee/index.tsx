import React from 'react';
import { ScrollView, View, Image, ActivityIndicator, Text } from 'react-native';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { buttonWithIconStyles2 } from '@/styles/components/buttonWithIcon/buttonWithIconStyles2';
import { useHomeScreenEmployee } from '@/hooks/employee/useHomeScreen';
import { homeScreenEmployeeStyles as styles } from '@/styles/app/employee/homeScreenStyles';
import { Carousel } from '@/components/Carousel';
import { VacancyList } from '@/components/VacancyList';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreenEmployee () {
  const {
    soonVacancies,
    interestVacancies,
    nearVacancies,
    loading,
    errorVacancies,
    goToSearchVacancy,
    goToVacancyDetails,
    goToSoonList,
    goToInterestList,
    goToNearList,
  } = useHomeScreenEmployee();

  return (
    <ScrollView>
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      {/* {loading ? (
        <HomeSkeleton />)
      : <> */}
      
        <View>
          <ButtonWithIcon
            texto="Buscar"
            icono="search1"
            onPress={goToSearchVacancy}
            styles={buttonWithIconStyles2}
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

        {errorVacancies && <Text>{errorVacancies}</Text>}

        {!loading && !errorVacancies && (
          <>
            <VacancyList
              title="Según tus intereses"
              data={interestVacancies}
              onPressTitle={goToInterestList}
              showArrow
            />
            <VacancyList
              title="Próximos eventos"
              data={soonVacancies}
              onPressTitle={goToSoonList}
              showArrow
            />
            <VacancyList
              title="Cerca tuyo"
              data={nearVacancies}
              onPressTitle={goToNearList}
              showArrow
            />
          </>
        )}
        
        {/* </>} */}
      
      </SafeAreaView>
    </ScrollView>
  );
};

