// app/employee/active-jobs/index.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useActiveJobs, Job } from "@/hooks/employee/jobs/useActiveJobs";
import { activeJobsStyles as styles } from "@/styles/app/employee/jobs/activeJobsStyles";
import { OrderButton } from "@/components/button/OrderButton";
import { Colors } from "@/themes/colors";

export default function ActiveJobsScreen() {
  const { jobs, goToJobDetail } = useActiveJobs();
  const [sortedJobs, setSortedJobs] = useState<Job[]>([]);

  useEffect(() => {
    setSortedJobs(jobs);
  }, [jobs]);

  const orderOptions = [
    "Días Faltantes ASC",
    "Días Faltantes DESC",
    "Fecha Inicio ASC",
    "Fecha Inicio DESC",
    "Rol ASC",
    "Rol DESC",
    "Evento ASC",
    "Evento DESC",
  ];

  const handleSort = (order: number) => {
    const opt = orderOptions[order - 1];
    let ordered = [...jobs];

    switch (opt) {
      case "Días Faltantes ASC":
        ordered.sort((a, b) => a.daysRemaining - b.daysRemaining);
        break;
      case "Días Faltantes DESC":
        ordered.sort((a, b) => b.daysRemaining - a.daysRemaining);
        break;
      case "Fecha Inicio ASC":
        ordered.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        break;
      case "Fecha Inicio DESC":
        ordered.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        break;
      case "Rol ASC":
        ordered.sort((a, b) => a.role.localeCompare(b.role));
        break;
      case "Rol DESC":
        ordered.sort((a, b) => b.role.localeCompare(a.role));
        break;
      case "Evento ASC":
        ordered.sort((a, b) => a.eventName.localeCompare(b.eventName));
        break;
      case "Evento DESC":
        ordered.sort((a, b) => b.eventName.localeCompare(a.eventName));
        break;
    }

    setSortedJobs(ordered);
  };

  return (
    <View style={styles.container}>
      {/* Header con título y botón */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Trabajos</Text>
        {jobs.length > 0 && (
          <OrderButton options={orderOptions} onSelect={handleSort} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { flexGrow: 1, justifyContent: sortedJobs.length === 0 ? "center" : "flex-start" }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {sortedJobs.length === 0 ? (
          <View style={styles.noJobsCard}>
            <Text style={styles.noJobsTitle}>Aún no tienes trabajos</Text>
            <Image
              source={require("@/assets/images/jex/Jex-Olvidadizo.png")}
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
                <Image
                  source={job.image}
                  style={styles.eventImage}
                  resizeMode="contain"
                />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{job.eventName}</Text>
                  {job.category ? (
                    <Text style={styles.eventType}>{job.category}</Text>
                  ) : null}
                </View>

                <View style={[
                  styles.daysPill,
                  job.daysRemaining === 0 && { backgroundColor: Colors.violet4 } // 👈 pill violeta si es HOY
                ]}>
                  <Text style={[
                    styles.daysPillText,
                    job.daysRemaining === 0 && { color: Colors.white } // 👈 texto blanco si es HOY
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
                <Text style={styles.footerArrow}>{">"}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
