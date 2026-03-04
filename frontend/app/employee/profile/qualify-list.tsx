import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQualifyList } from "@/hooks/employee/profile/useQualifyList";
import { Colors } from "@/themes/colors";
import { router } from "expo-router";
import { listStyles as styles } from "@/styles/app/employee/profile/qualifyListStyles";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function SelectEventToQualify() {
  const { employers, loading, error } = useQualifyList();

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.violet4} />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  if (!employers.length)
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No hay eventos pendientes de calificación</Text>
      </View>
    );

  return (
    <LinearGradient colors={["#f8f6ff", "#ffffff"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.backBtnHero} onTouchEnd={() => router.replace('/employee/profile')}>
            <Ionicons name="arrow-back" size={28} color={Colors.violet4} />
        </View>
        <Image
          source={require("@/assets/images/jex/Jex-Busqueda-Disponibilidad.webp")}
          style={styles.headerImage}
        />

        <Text style={styles.title}>Eventos a Calificar</Text>

        <FlatList
          data={employers}
          keyExtractor={(item) => item.event_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/employee/profile/qualify",
                    params: {
                      employerId: item.employer_id,
                      employerName: item.company_name,
                      eventId: item.event_id,
                      eventName: item.event_name,
                      jobType: item.job_type,
                      date: item.event_start_date,
                      time: `${item.event_start_time} - ${item.event_end_time}`,
                      imageUrl: item.image_url || "", 
                    },
                  })
                }
              >
                <View style={styles.cardHeader}>
                 
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventName}>{item.event_name}</Text>
                    <Text style={styles.eventDetail}>
                      {item.event_start_date} • {item.job_type}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
