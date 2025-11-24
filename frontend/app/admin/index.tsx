import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
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
    barReasonData,
    filteredComplaints,
    selectedStatusFilter,
    setSelectedStatusFilter,
    availableStatusFilters,
    handleLogout
  } = useAdminDashboard();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pieDataColored = pieStatusData.map((item, index) => {
    const palette = [Colors.violet4, Colors.violet2, Colors.gray3, Colors.gray3, Colors.violet5];
    return {
      ...item,
      color: palette[index % palette.length],
    };
  });

  const onLogoutPress = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const barDataColored = barReasonData.map((item, index) => {
    const palette = [Colors.violet4, Colors.violet2, Colors.gray3, Colors.gray3];
    return {
      value: item.value,
      label: item.label,
      frontColor: palette[index % palette.length],
      fullLabel: item.fullLabel,
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.headerTitle}>Panel de denuncias</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <DotsLoader />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

          <View style={styles.chartsRow}>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Denuncias por estado</Text>
              {pieDataColored.length === 0 ? (
                <Text style={styles.emptyChartText}>Sin datos</Text>
              ) : (
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
              )}
            </View>


          </View>

          <View style={styles.filtersContainer}>
            <Text style={styles.sectionTitle}>Listado de denuncias</Text>
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

          <FlatList
            data={filteredComplaints}
            keyExtractor={item => String(item.id)}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            renderItem={({ item }) => (
              <View style={styles.complaintCard}>
                <View style={styles.complaintHeader}>
                  <Text style={styles.complaintReason}>{item.reason}</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{item.status}</Text>
                  </View>
                </View>

                <Text style={styles.complaintDate}>{item.created_at}</Text>

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

                {item.context ? (
                  <Text style={styles.complaintContext}>{item.context}</Text>
                ) : null}
              </View>

            )}

           
          />

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
                <ActivityIndicator
                    size="small"
                    color="#444"
                    style={{ marginLeft: 10 }}
                />
                )}
            </TouchableOpacity>
            </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;
