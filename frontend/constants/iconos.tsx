import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';

export const iconos = {
    error: (size:number, color:string) => (
        <MaterialIcons name="error" size={size} color={color} />
    ),
    exito: (size:number, color:string) => (
        <Octicons name="check-circle" size={size} color={color}/>
    )
};

