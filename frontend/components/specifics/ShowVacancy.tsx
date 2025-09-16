import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { showVacancyStyles1 } from '@/styles/components/specifics/showVacancyStyles/showVacancyStyles1';
import { showVacancyStyles2 } from '@/styles/components/specifics/showVacancyStyles/showVacancyStyles2';
import { Colors } from '@/themes/colors';
import { useDataTransformation } from '@/services/internal/useDataTransformation';
import ImageOnline from '../others/ImageOnline';

interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  event_image_public_id?: string | null;
  event_image_url?: string | null;
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
    start_date,
    payment,
    job_type_name,
    specific_job_type,
    event_image_public_id,
    event_image_url,
  } = vacancy;

  const { formatFechaCorta } = useDataTransformation();
  const formattedDate = formatFechaCorta(start_date);

  const styles =
    orientation === 'vertical'
      ? showVacancyStyles1
      : showVacancyStyles2;

  // 🔹 Definir tamaño según orientación
  const imageSize = orientation === 'vertical' ? 140 : 90;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(vacancy)}
      activeOpacity={0.8}
    >
      <ImageOnline
        imageId={event_image_public_id}
        imageUrl={event_image_url}
        size={imageSize}
        shape="square"
        style={styles.image}
      />

      <View style={styles.textContainer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text
          style={styles.role}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
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
