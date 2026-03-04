import { useMemo, useState } from "react";
import { OrderButton } from "@/components/button/OrderButton"; 
import ImageOnline from "@/components/image/ImageOnline"; 
import { DotsLoader } from "@/components/others/DotsLoader"; 
import { iconos } from "@/constants/iconos"; 
import { Job, useActiveJobs } from "@/hooks/employee/jobs/useActiveJobs"; 
import { activeJobsStyles as styles } from "@/styles/app/employee/jobs/activeJobsStyles"; 
import { Colors } from "@/themes/colors"; 
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActiveJobsScreen() {
  const { jobs, goToJobDetail, loading } = useActiveJobs();

  const orderOptions = [
    "Días Faltantes ASC",
    "Días Faltantes DESC",
    "Rol ASC",
    "Rol DESC",
    "Evento ASC",
    "Evento DESC",
  ];

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const sortedJobs = useMemo(() => {
    const list = [...jobs];
    switch (selectedOrder) {
      case "Días Faltantes ASC":
        return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
      case "Días Faltantes DESC":
        return list.sort((a, b) => b.daysRemaining - a.daysRemaining);
      case "Rol ASC":
        return list.sort((a, b) => a.role.localeCompare(b.role));
      case "Rol DESC":
        return list.sort((a, b) => b.role.localeCompare(a.role));
      case "Evento ASC":
        return list.sort((a, b) => a.eventName.localeCompare(b.eventName));
      case "Evento DESC":
        return list.sort((a, b) => b.eventName.localeCompare(a.eventName));
      default:
        return list; // sin orden seleccionado todavía
    }
  }, [jobs, selectedOrder]);

  const handleSort = (orderIndex: number) => {
    const opt = orderOptions[orderIndex - 1];
    setSelectedOrder(opt);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <DotsLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Trabajos</Text>
        {jobs.length > 0 && (
          <OrderButton options={orderOptions} onSelect={handleSort} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { flexGrow: 1, justifyContent: jobs.length === 0 ? "center" : "flex-start" }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {jobs.length === 0 ? (
          <View style={styles.noJobsCard}>
            <Text style={styles.noJobsTitle}>Aún no tienes trabajos</Text>
            <Image
              source={require("@/assets/images/jex/Jex-Olvidadizo.webp")}
              style={styles.noJobsImage}
              resizeMode="contain"
            />
            <Text style={styles.noJobsSubtitle}>
              Cuando consigas uno, aparecerá aquí
            </Text>
          </View>
        ) : (
          sortedJobs.map((job) => (
            <View key={job.id} style={styles.card}>
              {/* Header con imagen + info */}
              <View style={styles.cardHeader}>

                <ImageOnline
                  imageUrl={job.event_image_url}
                  imageId={job.event_image_public_id}
                  size={60}
                  shape="square"
                  style={styles.eventImage}
                />

                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{job.eventName}</Text>
                  {job.category ? (
                    <Text style={styles.eventType}>{job.category}</Text>
                  ) : null}
                </View>

                <View style={[
                  styles.daysPill,
                  job.daysRemaining === 0 && { backgroundColor: Colors.violet4 } 
                ]}>
                  <Text style={[
                    styles.daysPillText,
                    job.daysRemaining === 0 && { color: Colors.white } 
                  ]}>
                    {job.daysRemaining === 0
                      ? "Hoy"
                      : `Faltan ${job.daysRemaining} días`}
                  </Text>
                </View>

              </View>

              {/* Fecha + rol/salario */}
              <View style={styles.dateRoleRow}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>{job.date}</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.roleSalaryBox}>
                  <Text style={styles.role}>{job.role}</Text>
                  <View style={styles.salaryPill}>
                    <Text style={styles.salaryText}>{job.salary} ARS</Text>
                  </View>
                </View>
              </View>

              {/* Separador */}
              <View style={styles.horizontalDivider} />

              {/* Info extra + botón */}
              <TouchableOpacity
                style={styles.footerRow}
                activeOpacity={0.7}
                onPress={() => goToJobDetail(job)}
              >
                <Text style={styles.footerText}>
                  Recuerda cómo llegar al evento, reglas, horarios y otra
                  información relevante
                </Text>
                {iconos.flechaDerecha(20, Colors.gray3)}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}