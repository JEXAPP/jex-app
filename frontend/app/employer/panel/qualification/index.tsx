// screens/Quali/index.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  Platform,
  LayoutAnimation,
  findNodeHandle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuali } from "@/hooks/employer/panel/qualification/useQuali";
import { qualiStyles as styles } from "@/styles/app/employer/panel/qualification/qualiStyles";
import { Colors } from "@/themes/colors";
import StarRating from "react-native-star-rating-widget";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ImageWindow from "@/components/window/ImageWindow";

export default function QualiScreen() {
  const router = useRouter();
  const {
    roles,
    selectedRole,
    setSelectedRole,
    workers,
    ratings,
    handleRating,
    handleComment,
    handleSubmit,
    handleToggleLinked,
    ratedCount,
    totalCount,
    handleSanction,
  } = useQuali();

  const [keyboardHeight, setKeyboardHeight] = useState(40);
  const [inputHeights, setInputHeights] = useState<Record<string, number>>({});
  const [showSanction, setShowSanction] = useState(false);
  const [workerToSanction, setWorkerToSanction] = useState<string | null>(null);

  const scrollRef = useRef<any>(null);
  const inputRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(e.endCoordinates?.height || 0);
    };
    const onHide = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleFocus = (workerId: string) => {
    const node = findNodeHandle(inputRefs.current[workerId]);
    if (node && scrollRef.current?.scrollToFocusedInput) {
      scrollRef.current.scrollToFocusedInput(node);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Título */}
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
      <KeyboardAwareScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: keyboardHeight ? keyboardHeight + 140 : 140,
        }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={Platform.OS === "ios" ? 20 : 100}
        keyboardShouldPersistTaps="handled"
      >
        {workers.map((worker) => {
          const userRating = ratings[worker.id]?.rating ?? 0;
          return (
            <View key={worker.id} style={styles.workerCard}>
              {/* Datos principales */}
              <View style={styles.workerRow}>
                <Image source={{ uri: worker.image }} style={styles.workerImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerRole}>{worker.role}</Text>
                </View>

                {/* Chips de acción */}
                <View style={{ alignItems: "flex-end" }}>
                  {/* Vincular / Vinculado */}
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      worker.linked ? styles.chipDisabled : styles.chipActive,
                    ]}
                    onPress={() => handleToggleLinked(worker.id)}
                  >
                    <Ionicons
                      name={worker.linked ? "checkmark" : "person-add"}
                      size={14}
                      color={worker.linked ? Colors.gray3 : "#fff"}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        worker.linked ? styles.chipTextDisabled : styles.chipTextActive,
                      ]}
                    >
                      {worker.linked ? "Vinculado" : "Vincular"}
                    </Text>
                  </TouchableOpacity>

                  {/* Sancionar */}
                  <TouchableOpacity
                    style={[styles.chip, styles.chipOutline]}
                    onPress={() => {
                      setWorkerToSanction(worker.id);
                      setShowSanction(true);
                    }}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={14}
                      color={Colors.violet4}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.chipText, { color: Colors.violet4 }]}>
                      Sancionar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Estrellas */}
              <View style={styles.ratingRow}>
                <StarRating
                  rating={userRating}
                  onChange={(val) => handleRating(worker.id, Math.round(val))}
                  starSize={30}
                  color={Colors.yellow}
                  enableHalfStar={false}
                  enableSwiping={false}
                  animationConfig={{ scale: 1 }}
                />
                <Text style={styles.ratingValue}>
                  {userRating > 0 ? userRating.toFixed(1) : ""}
                </Text>
              </View>

              {/* Comentario */}
              {userRating > 0 && (
                <View style={styles.commentBox}>
                  <TextInput
                    ref={(r) => {
                      inputRefs.current[worker.id] = r;
                    }}
                    style={[
                      styles.commentInput,
                      {
                        height: Math.min(
                          Math.max(40, inputHeights[worker.id] || 40),
                          120
                        ),
                      },
                    ]}
                    placeholder="Deja tu comentario..."
                    placeholderTextColor={Colors.gray2}
                    multiline
                    scrollEnabled
                    maxLength={200}
                    value={ratings[worker.id]?.comment ?? ""}
                    onChangeText={(text) => handleComment(worker.id, text)}
                    onContentSizeChange={(e) => {
                      const size = e?.nativeEvent?.contentSize;
                      if (size?.height) {
                        setInputHeights((prev) => ({
                          ...prev,
                          [worker.id]: size.height,
                        }));
                      }
                    }}
                    onFocus={() => handleFocus(worker.id)}
                  />
                  <Text style={styles.commentCounter}>
                    {(ratings[worker.id]?.comment?.length || 0)}/200
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </KeyboardAwareScrollView>

      {/* Footer con barra de progreso */}
      <View style={styles.footer}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(ratedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.footerText}>
            Calificados: {ratedCount}/{totalCount}
          </Text>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal aviso sancionar */}
      <ImageWindow
        visible={showSanction}
        title="Aviso:"
        subtitle="Recordá que sancionar a un empleado puede afectar negativamente su reputación."
        buttonText="Entendido"
        onClose={() => {
          setShowSanction(false);
          if (workerToSanction) {
            handleSanction(workerToSanction);
            setWorkerToSanction(null);
          }
        }}
      />
    </SafeAreaView>
  );
}
