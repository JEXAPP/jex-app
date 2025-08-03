import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ShowVacancy } from './ShowVacancy'; // tu componente
import { vacancyListStyles1 as styles} from '@/styles/components/vacancyListStyles1';
import { useNavigation } from '@react-navigation/native';

interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  image_url?: string | null;
}

interface Props {
  title: string;
  data: Vacancy[];
  onPressTitle?: () => void;
  onPressVacancy: (vacancy: Vacancy) => void;
  showArrow?: boolean;
}

export const VacancyList = ({
  title,
  data,
  onPressTitle,
  onPressVacancy,
  showArrow = true,
}: Props) => {

  const handleVacancyPress = (vacancy: Vacancy) => {
    onPressVacancy(vacancy)
  };

  return (
    <View style={styles.container}>
      {/* Header con título y flecha */}
      <TouchableOpacity
        style={styles.header}
        activeOpacity={showArrow ? 0.7 : 1}
        onPress={showArrow && onPressTitle ? onPressTitle : undefined}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {showArrow && <Text style={styles.arrow}> ›</Text>}
        </View>
      </TouchableOpacity>

      {/* Lista horizontal */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.vacancy_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ShowVacancy
              vacancy={item}
              orientation="vertical"
              onPress={handleVacancyPress}
            />
          </View>
        )}
      />
    </View>
  );
};
