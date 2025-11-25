import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import { adminDashboardStyles as styles } from '@/styles/app/admin/adminDashboardStyles';
import { Colors } from '@/themes/colors';
import { DotsLoader } from '@/components/others/DotsLoader';
import { iconos } from '@/constants/iconos';

const AdminDashboardScreen = () => {
  const {
    loading,
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    pieStatusData,
    barReasonData, // (por ahora no se usa, pero lo dejamos por si después agregamos la de barras)
    filteredComplaints,
    selectedStatusFilter,
    setSelectedStatusFilter,
    availableStatusFilters,
    handleLogout,
  } = useAdminDashboard();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Paleta de violetas para el gráfico y la leyenda
  const piePalette = [Colors.violet4, Colors.violet2, Colors.violet1, Colors.violet5];

  const pieDataColored = pieStatusData.map((item, index) => {
    const color = piePalette[index % piePalette.length];
    return {
      ...item,
      color,
    };
  });

  const onLogoutPress = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.headerTitle}>Panel de sanciones</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <DotsLoader />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Resumen */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{totalComplaints}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Pendientes</Text>
              <Text style={styles.summaryValue}>{pendingComplaints}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Resueltas</Text>
              <Text style={styles.summaryValue}>{resolvedComplaints}</Text>
            </View>
          </View>

          {/* Gráfico de torta + leyenda a la derecha */}
          <View style={styles.chartsRow}>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Sanciones por estado</Text>
              {pieDataColored.length === 0 ? (
                <Text style={styles.emptyChartText}>Sin datos</Text>
              ) : (
                <View style={styles.pieRow}>
                  <PieChart
                    data={pieDataColored}
                    donut
                    showText
                    textColor={Colors.gray3}
                    innerRadius={40}
                    radius={80}
                    centerLabelComponent={() => (
                      <View>
                        <Text style={styles.pieCenterNumber}>{totalComplaints}</Text>
                        <Text style={styles.pieCenterLabel}>Total</Text>
                      </View>
                    )}
                  />

                  <View style={styles.legendContainer}>
                    {pieDataColored.map(item => (
                      <View key={item.label} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendDot,
                            {
                              backgroundColor: item.color,
                            },
                          ]}
                        />
                        <Text style={styles.legendLabel}>
                          {item.label} ({item.value})
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Filtros */}
          <View style={styles.filtersContainer}>
            <Text style={styles.sectionTitle}>Listado de sanciones</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedStatusFilter === 'all' && styles.filterChipActive,
                ]}
                onPress={() => setSelectedStatusFilter('all')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedStatusFilter === 'all' && styles.filterChipTextActive,
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>

              {availableStatusFilters.map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    selectedStatusFilter === status && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedStatusFilter === status && styles.filterChipTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Listado de denuncias con más detalle */}
          <FlatList
            data={filteredComplaints}
            keyExtractor={item => String(item.id)}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            renderItem={({ item }) => (
              <View style={styles.complaintCard}>
                {/* Motivo + Estado */}
                <View style={styles.complaintHeader}>
                  <Text style={styles.complaintReason}>{item.reason}</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{item.status}</Text>
                  </View>
                </View>

                <Text style={styles.complaintDate}>{item.created_at}</Text>

                {/* Denunciante / Denunciado */}
                <View style={styles.partiesRow}>
                  <View style={styles.partyColumn}>
                    <Text style={styles.partyLabel}>Denunciante</Text>
                    <Text style={styles.partyName}>{item.reporter_name}</Text>
                  </View>
                  <View style={styles.partyColumn}>
                    <Text style={styles.partyLabel}>Denunciado</Text>
                    <Text style={styles.partyName}>{item.reported_name}</Text>
                  </View>
                </View>

                {/* Contacto del penalizado */}
                <View style={styles.contactRow}>
                  <View style={styles.contactColumn}>
                    <Text style={styles.contactLabel}>Teléfono denunciado</Text>
                    <Text style={styles.contactValue}>
                      {item.penalized_phone || '-'}
                    </Text>
                  </View>
                  <View style={styles.contactColumn}>
                    <Text style={styles.contactLabel}>Email denunciado</Text>
                    <Text style={styles.contactValue}>
                      {item.penalized_email || '-'}
                    </Text>
                  </View>
                </View>

                {/* Imagen + info del evento */}
                {(item.event_image || item.event_name) && (
                  <View style={styles.eventRow}>
                    {item.event_image ? (
                      <Image
                        source={{ uri: item.event_image }}
                        style={styles.eventImage}
                      />
                    ) : null}
                    <View style={styles.eventInfoColumn}>
                      <Text style={styles.eventLabel}>Evento</Text>
                      <Text style={styles.eventName}>
                        {item.event_name || 'Sin nombre'}
                      </Text>
                      {item.context ? (
                        <Text style={styles.eventContext}>{item.context}</Text>
                      ) : null}
                    </View>
                  </View>
                )}

                {/* Comentario / detalle adicional */}
                {item.comments ? (
                  <Text style={styles.complaintComments}>{item.comments}</Text>
                ) : null}
              </View>
            )}
          />

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutRow}
              activeOpacity={0.7}
              onPress={onLogoutPress}
              disabled={isLoggingOut}
            >
              {iconos.logout(28, Colors.gray3)}
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
              {isLoggingOut && (
                <ActivityIndicator size="small" color="#444" style={{ marginLeft: 10 }} />
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;
