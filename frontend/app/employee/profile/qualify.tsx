// screens/Employee/qualify.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "react-native-star-rating-widget";
import { Colors } from "@/themes/colors";
import { qualifyStyles as styles } from "@/styles/app/employee/profile/qualifyStyles";
import { useQualify } from "@/hooks/employee/profile/useQualify";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function QualifyScreen() {
  const { organizer, role, rating, comment, setComment, handleRating, handleSubmit } =
    useQualify();

  const [inputHeight, setInputHeight] = useState(40);

  // 👉 función para cerrar teclado solo si el toque NO es en un input
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={Platform.OS === "ios" ? 20 : 100}
        keyboardShouldPersistTaps="handled"
      >
        {/* 👉 envolvemos todo pero excluimos el card y el input */}
        <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* Título */}
            <Text style={styles.title}>Calificar Organizador</Text>

            {/* Card Organizador */}
            <View style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={{ uri: organizer.image }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{organizer.name}</Text>
                  <Text style={styles.event}>Evento: {organizer.event}</Text>
                  <Text style={styles.eventDetail}>
                    {organizer.date} • {organizer.time}
                  </Text>
                </View>
              </View>
            </View>

            {/* Card de Rol */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{role}</Text>
              <Text style={styles.question}>¿Cómo fue tu experiencia?</Text>

              {/* Estrellas */}
              <View style={styles.starsRow}>
                <StarRating
                  rating={rating}
                  onChange={(val) => handleRating(Math.round(val))}
                  starSize={32}
                  color={Colors.yellow}
                  enableHalfStar={false}
                  enableSwiping={false}
                  animationConfig={{ scale: 1.2 }}
                />
                <TouchableOpacity
                  disabled={rating === 0}
                  onPress={() => handleRating(0)}
                >
                  <Text style={styles.ratingValue}>({rating.toFixed(1)})</Text>
                </TouchableOpacity>
              </View>

              {/* Comentario */}
              {rating > 0 && (
                <View style={styles.commentBox}>
                  <TextInput
                    style={[
                      styles.commentInput,
                      { height: Math.min(Math.max(40, inputHeight), 120) },
                    ]}
                    placeholder="Deja tu comentario (opcional)..."
                    placeholderTextColor={Colors.gray2}
                    multiline
                    scrollEnabled
                    maxLength={200}
                    value={comment}
                    onChangeText={setComment}
                    onContentSizeChange={(e) => {
                      const size = e?.nativeEvent?.contentSize;
                      if (size?.height) setInputHeight(size.height);
                    }}
                  />
                  <Text style={styles.commentCounter}>
                    {comment.length}/200
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      {/* Botón fijo */}
      <TouchableOpacity
        style={[
          styles.button,
          rating === 0 ? styles.buttonOmit : styles.buttonSubmit,
        ]}
        onPress={rating === 0 ? () => console.log("⏭ Omitido") : handleSubmit}
      >
        <Text
          style={[
            styles.buttonText,
            rating === 0 ? styles.buttonTextOmit : styles.buttonTextSubmit,
          ]}
        >
          {rating === 0 ? "Omitir" : "Enviar Calificacion"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
