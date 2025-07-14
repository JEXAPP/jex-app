import { Colors } from '@/themes/colors';
import { View, Text, ActivityIndicator} from 'react-native';
import { indexCrearEventoStyles as styles } from '@/styles/app/crear-evento/indexCrearEventoStyles';
import { useCrearEventoIndex } from '@/hooks/crear-evento/useCrearEventoIndex';

export default function CrearEventoIndex() {

  useCrearEventoIndex()

  return (
    <View style={styles.container}>
      
      <ActivityIndicator size="large" color={Colors.violet3 }/>

      <Text style={styles.texto}>Cargando creación de evento...</Text>
    
    </View>
  );
}

