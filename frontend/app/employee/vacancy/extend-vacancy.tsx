import { ShowVacancy } from '@/components/specifics/ShowVacancy';
import { Vacancy } from '@/constants/interfaces';
import SearchVacancySkeleton from '@/constants/skeletons/employee/vacancy/searchVacancySkeleton';
import { useExtendVacancy} from '@/hooks/employee/vacancy/useExtendVacancy';
import { extendVacancyStyles as styles } from '@/styles/app/employee/vacancy/extendVacancyStyles';
import React from 'react';
import { FlatList, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListVacancyByCategoryScreen() {
    
  const { title, vacancies, isFetching, handleLoadMore, goToVacancyDetails } = useExtendVacancy();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={styles.container}>

            <Text style={styles.title}>{title}</Text>

            { isFetching 
            ? 
                <SearchVacancySkeleton/>    
            :
                <FlatList
                    data={vacancies}
                    keyExtractor={(item: Vacancy) => String(item.vacancy_id)}
                    renderItem={({ item }) => (
                    <ShowVacancy
                        vacancy={item}
                        orientation="horizontal"
                        onPress={(item) => goToVacancyDetails(item)}
                    />
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                />
            }
            
        </View>

      </TouchableWithoutFeedback>

    </SafeAreaView>
  );
}