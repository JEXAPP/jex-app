import { Colors } from '@/themes/colors';
import { View, Text, ActivityIndicator} from 'react-native';
import { loadingStyles as styles } from '@/styles/app/loading/loadingStyles';
import { useLoading } from '@/hooks/loading/useLoading';

export default function CrearEventoIndex() {

  useLoading()

  return (
    <View style={styles.container}>
      
      <ActivityIndicator size="large" color={Colors.violet3 }/>

      <Text style={styles.texto}>Cargando creación de evento...</Text>
    
    </View>
  );
}

