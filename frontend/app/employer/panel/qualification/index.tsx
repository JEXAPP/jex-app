// screens/Quali/index.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuali } from "@/hooks/employer/panel/qualification/useQuali";
import { qualiStyles as styles } from "@/styles/app/employer/panel/qualification/qualiStyles";
import { Rating } from "react-native-ratings";
import { Colors } from "@/themes/colors";
import StarRating from "react-native-star-rating-widget";

export default function QualiScreen() {
  const {
    roles,
    selectedRole,
    setSelectedRole,
    workers,
    ratings,
    handleRating,
    handleComment,
    handleSubmit,
    ratedCount,
    totalCount,
  } = useQuali();

  const [inputHeight, setInputHeight] = useState(50);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS levanta, Android ajusta altura
        keyboardVerticalOffset={100} // ⚠️ ajustá según la altura del header
      >
        <Text style={styles.title}>Calificaciones</Text>

        {/* Tabs de roles */}
        <View style={styles.filterContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterButton,
                selectedRole === role && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedRole === role && styles.filterTextActive,
                ]}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de trabajadores */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"   // 👈 importante para que no se cierre
        >
          {workers.map((worker) => {
            const userRating = ratings[worker.id]?.rating ?? 0;
            return (
              <View key={worker.id} style={styles.workerCard}>
                <View style={styles.workerRow}>
                  <Image source={{ uri: worker.image }} style={styles.workerImage} />
                  <Text style={styles.workerName}>{worker.name}</Text>
                </View>

                {/* Estrellas */}
                <View style={styles.ratingRow}>
                  <StarRating
  rating={ratings[worker.id]?.rating || 0}
  onChange={(val) => {
    const current = ratings[worker.id]?.rating || 0;

    // 👇 Si el valor nuevo es igual al actual, resetear
    if (val === current) {
      handleRating(worker.id, 0);
    } else {
      handleRating(worker.id, val);
    }
  }}
  starSize={35}
  color={Colors.violet3}
/>


                  <Text style={styles.ratingValue}>
                    ({(ratings[worker.id]?.rating ?? 0).toFixed(1)})
                  </Text>
                </View>

                {/* Comentario */}
                {userRating > 0 && (
                
                <TextInput
                style={[
                    styles.commentInput,
                    { height: inputHeight, textAlignVertical: "top" }
                ]}
                placeholder="Deja tu comentario..."
                placeholderTextColor="#999"
                multiline
                onContentSizeChange={(event) =>
                    setInputHeight(event.nativeEvent.contentSize.height)
                }
                value={ratings[worker.id]?.comment ?? ""}
                onChangeText={(text) => handleComment(worker.id, text)}
                />
                                )}
                            </View>
            );
          })}
        </ScrollView>

        {/* Footer fijo */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Calificados: {ratedCount}/{totalCount}
          </Text>
          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}