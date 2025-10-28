import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { eventReportStyles as s } from '@/styles/app/employer/panel/report/reportStyles';
import { Colors } from '@/themes/colors';
import ImageOnline from '@/components/image/ImageOnline';
import {useEventReport, EmployeeItem, PaymentStatus } from '@/hooks/employer/panel/report/useReport';

function labelPay(status: PaymentStatus) {
  switch (status) {
    case 'APPROVED': return 'Pago aprobado';
    case 'PENDING':  return 'Pago pendiente';
    case 'FAILURE':  return 'Error de pago';
    default:         return 'Sin pago';
  }
}

export default function EventReportScreen() {
  const {
    loading,
    error,
    paymentCounts,
    ratingBuckets,
    avgRating,
    byRole,
    accepted,
    confirmed,
    approved,
    eventName,
    employees,
    refresh,
    goBack,
  } = useEventReport();

  const totalEmployees = employees.length;

  // ---- Datos de gráficos ----
  const paymentPieData = [
    { value: paymentCounts.APPROVED, text: 'Aprobado', color: Colors.violet4  },
    { value: paymentCounts.PENDING,  text: 'Pendiente', color: Colors.yellow },
    { value: paymentCounts.NO_PAYMENT, text: 'Sin pago', color: Colors.violet1 },
    { value: paymentCounts.FAILURE,  text: 'Error',     color: Colors.red    },
  ].filter(d => d.value > 0);

  // Línea: buckets 1..5 con eje Y reducido + labels claras
  const ratingLineData = useMemo(
    () => [1,2,3,4,5].map((r, idx) => ({
      value: ratingBuckets[idx],
      label: `${r}`,
      dataPointText: ratingBuckets[idx] ? String(ratingBuckets[idx]) : undefined,
    })),
    [ratingBuckets]
  );
  const maxY = Math.max(1, ...ratingBuckets);
  const sections = Math.max(1, Math.min(3, maxY)); // <=3 secciones para no “achatar”
  const step = Math.max(1, Math.ceil(maxY / sections));
  const yAxisLabels = Array.from({ length: sections + 1 }, (_, i) => String(i * step));
  const yMax = step * sections;

  // ---- Modals ----
  const [modal, setModal] = useState<'pagos' | 'ratings' | 'roles' | null>(null);

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <Text style={s.title}>Reportes</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={s.subtitle}>{eventName || 'Evento'}</Text>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* KPIs */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 450 }}
          style={s.kpiRow}
        >
          <LinearGradient colors={['#f3ecf8ff', '#FFFFFF']} start={[0,0]} end={[1,1]} style={s.kpiCard}>
            <Text style={s.kpiLabel}>Ofertas aceptadas</Text>
            <Text style={s.kpiValue}>{accepted}</Text>
          </LinearGradient>

          <LinearGradient colors={['#f3ecf8ff', '#FFFFFF']} start={[0,0]} end={[1,1]} style={s.kpiCard}>
            <Text style={s.kpiLabel}>Asistencias registradas</Text>
            <Text style={s.kpiValue}>{confirmed}</Text>
            <Text style={s.kpiHint}>{accepted ? Math.round((confirmed/accepted)*100) : 0}% del total</Text>
          </LinearGradient>

          <LinearGradient colors={['#f3ecf8ff', '#FFFFFF']} start={[0,0]} end={[1,1]} style={s.kpiCard}>
            <Text style={s.kpiLabel}>Pagos aprobados</Text>
            <Text style={s.kpiValue}>{approved}</Text>
            <Text style={s.kpiHint}>{accepted ? Math.round((approved/accepted)*100) : 0}% del total</Text>
          </LinearGradient>
        </MotiView>

        {/* 1) Pie de Pagos (tap -> modal) */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 80 }}
          style={s.card}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={() => setModal('pagos')}>
            <View style={s.rowBetween}>
              <Text style={s.cardTitle}>Estado de pagos ({totalEmployees})</Text>
            </View>
            {paymentPieData.length === 0 ? (
              <Text style={s.emptyText}>Sin datos de pagos</Text>
            ) : (
              <View style={s.pieRow}>
                <PieChart
                  data={paymentPieData.map(p => ({ value: p.value, color: p.color }))}
                  donut
                  showGradient
                  innerRadius={60}
                  radius={90}
                  strokeWidth={0}
                  strokeColor="#fff"
                  animationDuration={800}
                  focusOnPress
                />
                <View style={s.pieLegend}>
                  {paymentPieData.map((p, idx) => (
                    <View key={idx} style={s.legendItem}>
                      <View style={[s.legendDot, { backgroundColor: p.color }]} />
                      <Text style={s.legendText}>{p.text}</Text>
                      <Text style={s.legendQty}>{p.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </TouchableOpacity>
        </MotiView>

        {/* 2) Línea de Calificaciones (tap -> modal) */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 140 }}
          style={s.card}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={() => setModal('ratings')}>
            <View style={s.rowBetween}>
              <Text style={s.cardTitle}>Distribución de calificaciones</Text>
              <View style={s.avgBadge}>
                <Ionicons name="star" size={14} color={Colors.yellow} />
                <Text style={s.avgText}>{avgRating.toFixed(1)}</Text>
              </View>
            </View>

            <LineChart
              data={ratingLineData}
              thickness={3}
              hideRules={false}
              noOfSections={sections}
              maxValue={yMax+0.01}
              yAxisLabelTexts={yAxisLabels}
              isAnimated
              animationDuration={900}
              curved
              xAxisLabelTextStyle={s.axisLabel}
              spacing={50}
              yAxisTextNumberOfLines={1}
              color={Colors.violet4}
              dataPointsHeight={8}
              dataPointsWidth={8}
              hideDataPoints={false}
            />

            {/* Leyenda + aclaración ejes */}
            <View style={s.chartLegendRow}>
              <Text style={s.axisHint}>Eje X: Calificación (1–5)          Eje Y: Cantidad Personas</Text>
            </View>

            {totalEmployees === 0 && <Text style={s.emptyText}>Aún no hay calificaciones</Text>}
          </TouchableOpacity>
        </MotiView>

        {/* 3) Barras horizontales por Rol (Asistidos / No) (tap -> modal) */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={s.card}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={() => setModal('roles')}>
            <Text style={s.cardTitle}>Asistencia por rol</Text>

            <View style={{ gap: 14, marginTop: 10 }}>
              {byRole.map(({ role, attended, notAttended, total }) => (
                <View key={role} style={s.roleBlock}>
                  <Text style={s.roleLabel} numberOfLines={1}>{role}</Text>

                  <View style={s.dualRow}>
                    <Text style={s.dualLegendLeft}>Asistidos</Text>
                    <View style={s.dualBarTrack}>
                      <MotiView
                        from={{ width: 0, opacity: 0.6 }}
                        animate={{ width: `${total ? (attended/total)*100 : 0}%`, opacity: 1 }}
                        transition={{ type: 'timing', duration: 700 }}
                        style={[s.dualBarFill, { backgroundColor: Colors.darkgreen }]}
                      />
                    </View>
                    <Text style={s.dualLegendRight}>{attended}</Text>
                  </View>

                  <View style={s.dualRow}>
                    <Text style={s.dualLegendLeft}>No</Text>
                    <View style={s.dualBarTrack}>
                      <MotiView
                        from={{ width: 0, opacity: 0.6 }}
                        animate={{ width: `${total ? (notAttended/total)*100 : 0}%`, opacity: 1 }}
                        transition={{ type: 'timing', duration: 700, delay: 80 }}
                        style={[s.dualBarFill, { backgroundColor: Colors.red }]}
                      />
                    </View>
                    <Text style={s.dualLegendRight}>{notAttended}</Text>
                  </View>
                </View>
              ))}
              {byRole.length === 0 && <Text style={s.emptyText}>No hay roles registrados</Text>}
            </View>
          </TouchableOpacity>
        </MotiView>

        {error && <Text style={s.errorText}>{error}</Text>}
        <View style={s.footerSpace} />
      </ScrollView>

      {/* ---------- MODALS (centrados con scroll interno) ---------- */}
      <CenteredDetailModal
        visible={modal === 'pagos'}
        title="Detalle de pagos"
        onClose={() => setModal(null)}
        data={employees}
        renderItem={(e) => (
          <PersonRow
            key={e.employee_id}
            name={e.employee_name}
            role={e.job_type || 'Sin rol'}
            rightText={labelPay(e.payment_status)}
            imageUrl={e.profile_image_url ?? undefined}
          />
        )}
      />

      <CenteredDetailModal
        visible={modal === 'ratings'}
        title="Detalle de calificaciones"
        onClose={() => setModal(null)}
        data={employees}
        renderItem={(e) => (
          <PersonRow
            key={e.employee_id}
            name={e.employee_name}
            role={e.job_type || 'Sin rol'}
            rightText={`${e.rating.toFixed(1)} ★`}
            imageUrl={e.profile_image_url ?? undefined}
          />
        )}
      />

      <CenteredDetailModal
        visible={modal === 'roles'}
        title="Asistencia por rol"
        onClose={() => setModal(null)}
        data={groupByRole(employees)}
        renderItem={(g) => (
          <View key={g.role} style={s.detailGroup}>
            <Text style={s.detailGroupTitle}>{g.role}</Text>
            {g.items.map((e: EmployeeItem) => (
              <PersonRow
                key={e.employee_id}
                name={e.employee_name}
                role={e.attendance ? 'Asistió' : 'No asistió'}
                rightText={e.attendance ? '✓' : '—'}
                imageUrl={e.profile_image_url ?? undefined}
              />
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ------- Auxiliares -------
function groupByRole(list: EmployeeItem[]) {
  const map = new Map<string, EmployeeItem[]>();
  list.forEach(e => {
    const role = e.job_type || 'Sin rol';
    const arr = map.get(role) || [];
    arr.push(e);
    map.set(role, arr);
  });
  return Array.from(map.entries()).map(([role, items]) => ({ role, items }));
}

function CenteredDetailModal<T>({
  visible,
  title,
  onClose,
  data,
  renderItem,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalBackdropCenter}>
        <View style={s.modalCardCenter}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s.modalClose}>
              <Ionicons name="close" size={20} color={Colors.violet4} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={({ item }) => <>{renderItem(item)}</>}
            ItemSeparatorComponent={() => <View style={s.separator} />}
            contentContainerStyle={s.modalListContent}
            showsVerticalScrollIndicator
          />
        </View>
      </View>
    </Modal>
  );
}

function PersonRow({
  name,
  role,
  rightText,
  imageUrl,
}: {
  name: string;
  role: string;
  rightText: string;
  imageUrl?: string;
}) {
  return (
    <View style={s.personRow}>
      <ImageOnline imageUrl={imageUrl} size={40} shape="circle" />
      <View style={{ flex: 1 }}>
        <Text style={s.personName}>{name}</Text>
        <Text style={s.personRole}>{role}</Text>
      </View>
      <Text style={s.personRight}>{rightText}</Text>
    </View>
  );
}
