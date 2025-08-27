import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { Carousel } from '@/components/others/Carousel';
import HomeSkeleton from '@/constants/skeletons/employee/homeSkeleton';
import { useHomeEmployee } from '@/hooks/employee/useHomeEmployee';
import { homeScreenEmployeeStyles as styles } from '@/styles/app/employee/homeScreenStyles';
import { buttonWithIconStyles2 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles2';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VacancyList } from '@/components/others/VacancyList';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';

export default function HomeEmployeeScreen () {
  const {
    soonVacancies,
    interestVacancies,
    nearVacancies,
    loadingComienzo,
    errorVacancies,
    goToSearchVacancy,
    goToVacancyDetails,
    goToSoonList,
    goToInterestList,
    goToNearList,
  } = useHomeEmployee();

  return (
    <ScrollView>

      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

        {loadingComienzo ? (<HomeSkeleton />)
        : (<>
        
          <View>
            <ButtonWithIcon
              texto="Buscar vacantes"
              icono={iconos.search(24, Colors.gray3)}
              onPress={goToSearchVacancy}
              styles={{...buttonWithIconStyles2, texto: {...buttonWithIconStyles2.texto, marginLeft: 10}}}
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

          {!loadingComienzo && !errorVacancies && (
            <>
              <VacancyList
                title="Según tus intereses"
                data={interestVacancies}
                onPressTitle={goToInterestList}
                onPressVacancy={goToVacancyDetails}
                showArrow
              />
              <VacancyList
                title="Próximos eventos"
                data={soonVacancies}
                onPressTitle={goToSoonList}
                onPressVacancy={goToVacancyDetails}
                showArrow
              />
              <VacancyList
                title="Cerca tuyo"
                data={nearVacancies}
                onPressTitle={goToNearList}
                onPressVacancy={goToVacancyDetails}
                showArrow
              />
            </>
          )}
          
        </>)}
        
      </SafeAreaView>

    </ScrollView>
  );
};

