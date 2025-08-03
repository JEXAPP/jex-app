import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener expo/vector-icons instalado

import { showVacancyStyles1 } from '@/styles/components/showVacancyStyles/showVacancyStyles1';
import { showVacancyStyles2 } from '@/styles/components/showVacancyStyles/showVacancyStyles2';
import { Colors } from '@/themes/colors';

interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  image_url?: string | null;
}

interface ShowVacancyProps {
  vacancy: Vacancy;
  orientation?: 'vertical' | 'horizontal';
  onPress?: (vacancy: Vacancy) => void;
}

export const ShowVacancy = ({
  vacancy,
  orientation = 'vertical',
  onPress,
}: ShowVacancyProps) => {
  const {
    event_name,
    start_date,
    payment,
    job_type_name,
    specific_job_type,
    image_url,
  } = vacancy;

  const [day, month, year] = start_date.split('/');
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

  const weekday = dateObj.toLocaleDateString('es-AR', { weekday: 'long' });
  // Capitalizar primera letra
  const formattedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  // Formato final: "Sábado 02/08"
  const formattedDate = `${formattedWeekday} ${day}/${month}`;

  const displayImage =
    image_url ?? require('@/assets/images/jex/Jex-Evento-Default.png'); // Imagen por defecto

  // Estilos según orientación
  const styles =
    orientation === 'vertical'
      ? showVacancyStyles1
      : showVacancyStyles2;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(vacancy)}
      activeOpacity={0.8}
    >
      <Image source={displayImage} style={styles.image} resizeMode="cover" />

      <View style={styles.textContainer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.role}>
          {specific_job_type ?? job_type_name}
        </Text>
        <Text style={styles.payment}>
          {`${Number(payment).toLocaleString('es-AR', { minimumFractionDigits: 0 })} ARS`}
        </Text>
      </View>

      {orientation === 'horizontal' && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.violet3}
          style={styles.icon}
        />
      )}
    </TouchableOpacity>
  );
};
