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
  Modal,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import { adminDashboardStyles as styles } from '@/styles/app/admin/adminDashboardStyles';
import { Colors } from '@/themes/colors';
import { DotsLoader } from '@/components/others/DotsLoader';
import { iconos } from '@/constants/iconos';
import { Input } from '@/components/input/Input';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';

const AdminDashboardScreen = () => {
  const {
    loading,
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    pieStatusData,
    filteredComplaints,
    selectedStatusFilter,
    setSelectedStatusFilter,
    availableStatusFilters,
    resolvePenalty,
    handleLogout,
  } = useAdminDashboard();

  const [resolveOpen, setResolveOpen] = useState(false);
  const [resolveTarget, setResolveTarget] = useState<number | null>(null);
  const [resolveStateId, setResolveStateId] = useState<2 | 3>(3);
  const [resolveComment, setResolveComment] = useState('');
  const [resolving, setResolving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const piePalette = [Colors.violet4, Colors.violet2, Colors.violet1];

  const pieDataColored = pieStatusData.map((item, index) => ({
    ...item,
    color: piePalette[index % piePalette.length],
  }));

  const onLogoutPress = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
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
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>

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

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Sanciones por estado</Text>

              {pieDataColored.every(p => p.value === 0) ? (
                <Text style={styles.emptyChartText}>Sin datos</Text>
              ) : (
                <View style={styles.pieRow}>
                  <PieChart
                    data={pieDataColored}
                    donut
                    innerRadius={40}
                    radius={80}
                    showText={false}
                  />

                  <View style={styles.legendContainer}>
                    {pieDataColored.map(item => (
                      <View key={item.label} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendDot,
                            { backgroundColor: item.color },
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

            <View style={styles.filtersContainer}>
              <Text style={styles.sectionTitle}>Listado de sanciones</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                        selectedStatusFilter === status &&
                          styles.filterChipTextActive,
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

                  <Text style={styles.complaintDate}>
                    {item.created_at} {item.created_time}
                  </Text>

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

                  {(item.event_image || item.event_name) && (
                    <View style={styles.eventRow}>
                      {item.event_image && (
                        <Image
                          source={{ uri: item.event_image }}
                          style={styles.eventImage}
                        />
                      )}
                      <View style={styles.eventInfoColumn}>
                        <Text style={styles.eventLabel}>Evento</Text>
                        <Text style={styles.eventName}>
                          {item.event_name || 'Sin nombre'}
                        </Text>
                      </View>
                    </View>
                  )}

                  {item.comments && (
                    <Text style={styles.complaintComments}>
                      {item.comments}
                    </Text>
                  )}

                  {item.status === 'En Revisión' && (
                    <TouchableOpacity
                      style={styles.resolveButton}
                      onPress={() => {
                        setResolveTarget(item.id);
                        setResolveOpen(true);
                      }}
                    >
                      <Text style={styles.resolveButtonText}>Resolver</Text>
                    </TouchableOpacity>
                  )}

                  {item.status !== 'En Revisión' && (
                    <View style={styles.resolutionBubble}>
                      <Text style={styles.resolutionTitle}>
                        Estado final: {item.status}
                      </Text>

                      <Text style={styles.resolutionMeta}>
                        Resuelta {item.close_date ?? ''} {item.close_time ?? ''}
                      </Text>

                      <Text style={styles.resolutionComment}>
                        {item.state_comment
                          ? item.state_comment
                          : 'No se realizó ningún comentario al respecto'}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          </ScrollView>

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

          <Modal visible={resolveOpen} transparent animationType="fade">
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Resolver sanción</Text>

                <View style={styles.modalRow}>
                  <TouchableOpacity
                    style={[
                      styles.modalChoice,
                      resolveStateId === 3 && styles.modalChoiceActive,
                    ]}
                    onPress={() => setResolveStateId(3)}
                  >
                    <Text
                      style={[
                        styles.modalChoiceText,
                        resolveStateId === 3 && styles.modalChoiceTextActive,
                      ]}
                    >
                      Aceptada
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalChoice,
                      resolveStateId === 2 && styles.modalChoiceActive,
                    ]}
                    onPress={() => setResolveStateId(2)}
                  >
                    <Text
                      style={[
                        styles.modalChoiceText,
                        resolveStateId === 2 && styles.modalChoiceTextActive,
                      ]}
                    >
                      Rechazada
                    </Text>
                  </TouchableOpacity>
                </View>

                <Input
                  value={resolveComment}
                  onChangeText={setResolveComment}
                  placeholder="Comentario"
                  multiline
                  maxLength={200}
                  numberOfLines={4}
                  styles={{
                    input: { ...inputStyles1.input },
                    inputContainer: {
                      ...inputStyles1.inputContainer,
                      height: 100,
                      width: 320,
                      alignItems: 'flex-start',
                      paddingTop: 5,
                    },
                  }}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setResolveOpen(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalConfirm}
                    onPress={async () => {
                      if (!resolveTarget) return;
                      setResolving(true);
                      await resolvePenalty(
                        resolveTarget,
                        resolveStateId,
                        resolveComment.trim()
                      );
                      setResolving(false);
                      setResolveOpen(false);
                    }}
                  >
                    <Text style={styles.modalConfirmText}>
                      {resolving ? 'Guardando...' : 'Confirmar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;