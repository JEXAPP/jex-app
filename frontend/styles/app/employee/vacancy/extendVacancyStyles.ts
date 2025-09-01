import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const extendVacancyStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray1,
        alignItems: 'center'
    },
    title: {
        fontSize: 25, 
        fontFamily: 'interBold',
        marginBottom: 20,
        color: Colors.violet4,
        alignSelf: 'center',
        marginTop: 10
    }
});
