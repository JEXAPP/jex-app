import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { useSearchEmployeesResults } from '@/hooks/employer/candidates/useSearchEmployeesResults';
import { searchResultsStyles as s } from '@/styles/app/employer/candidates/searchResultsStyles';

export default function SearchResultsScreen() {
  const {
    items, count, loading, loadingMore, refreshing, errorMsg,
    reload, loadMore, goBack, onPressEmployee, 
  } = useSearchEmployeesResults();

  const renderItem = ({ item }: any) => {
    const imgSource = item.profile_image
      ? { uri: item.profile_image }
      : require('@/assets/images/jex/Jex-Postulantes-Default.png'); // aseg. extensión real

    return (
      <Pressable style={s.card} onPress={() => onPressEmployee(item.employee_id)}>
        <Image source={imgSource} style={s.avatar} />
        <View style={{ flex: 1, justifyContent:'center', alignItems: 'flex-start' }}>
          <Text style={s.name}>{item.name}</Text>

            
            <View style={s.ratingRow}>
              <View style={s.starsRow}>
                {iconos.full_star(14, Colors.violet3)}
                {iconos.full_star(14, Colors.violet3)}
                {iconos.full_star(14, Colors.violet3)}
                {iconos.full_star(14, Colors.violet3)}
                {iconos.full_star(14, Colors.violet3)}
              </View>
              <View>
                <Text style={s.ratingText}>5.0</Text>
              </View>
            </View>

            {item.approximate_location ? (
              <View style={s.locationPill}>
                {iconos.location(14, Colors.darkgreen)}
                <Text style={s.locationText} numberOfLines={1}>
                  {item.approximate_location}
                </Text>
              </View>
            ) : null}

        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['left', 'right']}>
      {/* Header interno (dentro de la sección Búsqueda) */}
      <View style={s.headerRow}>
        <Pressable onPress={goBack} hitSlop={8}>
          {iconos.flechaIzquierdaVolver(28, Colors.violet4)}
        </Pressable>
        <Text style={s.headerTitle}>Resultados</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Estado carga inicial */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={Colors.violet4} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.employee_id)}
          renderItem={renderItem}
          contentContainerStyle={s.listContent}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          refreshing={refreshing}
          onRefresh={reload}
          ListEmptyComponent={
            <View style={s.center}>
              <Text style={s.emptyText}>No encontramos empleados con esos criterios.</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator color={Colors.violet4} />
              </View>
            ) : null
          }
        />
      )}

      {/* Error “suave” en la vista (podés cambiar a tu ClickWindow si querés) */}
      {errorMsg ? (
        <View style={s.errorBox}>
          <Text style={s.errorText}>{errorMsg}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
