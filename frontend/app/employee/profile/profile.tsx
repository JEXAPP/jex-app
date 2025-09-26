import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { profileStyles as styles } from "@/styles/app/employee/profile/profileStyles";
import { useProfile } from "@/hooks/employee/profile/useProfile";

export default function ProfileScreen() {
  const { user, options, handleLogout } = useProfile();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header con imagen y nombre */}
        <View style={styles.header}>
          <Image source={{ uri: user.image }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
        </View>

        {/* Rating */}
        <TouchableOpacity style={styles.ratingCard} activeOpacity={0.7}>
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < user.rating ? "star" : "star-outline"}
                  size={27}
                  color="#ffd103ff"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.ratingValue}>{user.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.commentsRow}>
            <Text style={styles.ratingComments}>
              Mirá los comentarios que te hicieron
            </Text>
            <Feather name="chevron-right" size={18} color="#888" />
          </View>
        </TouchableOpacity>

        {/* Opciones */}
        <View style={styles.optionsContainer}>
          {options.map((opt, idx) => (
            <TouchableOpacity key={idx} style={styles.optionRow} activeOpacity={0.7}>
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
            onPress={handleLogout} // 👈 ahora sí funciona
          >
            <Feather name="log-out" size={22} color="#444" style={styles.optionIcon} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}