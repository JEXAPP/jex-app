import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { profileStyles as styles } from "@/styles/app/employee/profile/profileStyles";
import { useProfile } from "@/hooks/employer/profile/useProfileEmployer";

export default function ProfileScreen() {
  const { user, options, handleLogout } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={user.image} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
        </View>

        {/* Rating */}
        <TouchableOpacity style={styles.ratingCard} activeOpacity={0.7}>
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, index) => {
                const filled = index + 1 <= Math.floor(user.rating);
                const half = user.rating - index >= 0.5 && user.rating - index < 1;
                return (
                  <Ionicons
                    key={index}
                    name={filled ? "star" : half ? "star-half" : "star-outline"}
                    size={27}
                    color="#ffd103ff"
                    style={{ marginRight: 2 }}
                  />
                );
              })}
            </View>
            <Text style={styles.ratingValue}>
              {user.rating ? user.rating.toFixed(1) : "0.0"}
            </Text>
          </View>
          <View style={styles.commentsRow}>
            <Text style={styles.ratingComments}>Mirá los comentarios que te hicieron</Text>
            <Feather name="chevron-right" size={18} color="#888" />
          </View>
        </TouchableOpacity>

        {/* Opciones */}
        <View style={styles.optionsContainer}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={opt.onPress}
            >
              <Feather
                name={opt.icon as React.ComponentProps<typeof Feather>["name"]}
                size={22}
                color="#444"
                style={styles.optionIcon}
              />
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Feather name="chevron-right" size={20} color="#aaa" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Cerrar sesión */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutRow}
            activeOpacity={0.7}
            onPress={onLogoutPress}
            disabled={isLoggingOut}
          >
            <Feather name="log-out" size={22} color="#444" style={styles.optionIcon} />
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
    </SafeAreaView>
  );
}
