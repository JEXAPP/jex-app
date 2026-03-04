import React from "react";
import {
  Animated,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import {
  WorkHistoryItem,
  useWorkHistory,
} from "@/hooks/employee/profile/work-history/useWorkHistory";
import { workHistoryStyles as styles } from "@/styles/app/employee/profile/work-history/employeeWorkHistoryStyles";

import ImageOnline from "@/components/image/ImageOnline";
import { DotsLoader } from "@/components/others/DotsLoader";
import { ClickWindow } from "@/components/window/ClickWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";

type WorkHistoryCardProps = {
  item: WorkHistoryItem;
  index: number;
};

const safeFormatDDMMYYYY = (str: string | null) => {
  if (!str) return null;
  const [dd, mm, yyyy] = str.split("/");
  return `${dd}/${mm}/${yyyy}`;
};

const WorkHistoryCard: React.FC<WorkHistoryCardProps> = ({ item, index }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-14)).current;

  const [copiedVisible, setCopiedVisible] = React.useState(false);

  React.useEffect(() => {
    const delay = index * 90;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      delay,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      delay,
      useNativeDriver: true,
    }).start();
  }, [index, opacity, translateY]);

  const eventDateLabel = safeFormatDDMMYYYY(item.eventDate);

  // Texto chico en header morado (como ya tenías)
  const headerPaymentLabel = item.isPaid
    ? item.doneAt
      ? `Realizado el ${safeFormatDDMMYYYY(item.doneAt)}`
      : "Pago realizado"
    : "No se ha realizado el pago";

  const amountLabel = `${item.amount.toLocaleString("es-AR")} ${item.currency}`;

  const counterpartyShape = "square";

  const copyReceipt = async () => {
    const text = item.paymentMpId ? String(item.paymentMpId) : "";
    if (!text || !item.isPaid) return;

    await Clipboard.setStringAsync(text);
    setCopiedVisible(true);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Header morado con datos de evento */}
        <View style={styles.cardHeader}>
          <View style={styles.eventRow}>
            <ImageOnline
              imageUrl={item.eventLogoUrl ?? undefined}
              size={48}
              shape="square"
              style={styles.eventLogo}
            />
            <Text style={styles.eventName}>{item.eventName}</Text>
          </View>

          <View style={styles.datePill}>
            <Text style={styles.dateText}>{eventDateLabel}</Text>
          </View>

          <Text style={styles.role}>{item.roleName}</Text>

        </View>

        {/* Sección de experiencia y rating */}
        <View style={styles.body}>
          <View style={styles.experienceRow}>
            <Text style={styles.experienceLabel}>Tu experiencia con:</Text>

            <View style={styles.counterpartyRow}>
              <ImageOnline
                imageUrl={item.organizerImageUrl ?? undefined}
                size={32}
                shape={counterpartyShape}
                style={styles.counterpartyAvatar}
              />
              <Text style={styles.counterpartyName}>{item.organizerName}</Text>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, idx) => {
                const filled = idx + 1 <= Math.floor(item.ratingScore);
                const half =
                  item.ratingScore - idx >= 0.5 && item.ratingScore - idx < 1;
                return (
                  <Ionicons
                    key={idx}
                    name={filled ? "star" : half ? "star-half" : "star-outline"}
                    size={20}
                    color="#ffd103ff"
                    style={{ marginRight: 2 }}
                  />
                );
              })}
            </View>
            <Text style={styles.ratingValue}>{item.ratingScore.toFixed(1)}</Text>
          </View>

          <View style={styles.commentBubble}>
            <Text style={styles.commentText}>{item.ratingComment}</Text>
          </View>

          {item.isPaid ? (
            <View style={[styles.payBox, styles.payBoxPaid]}>
              <Text style={styles.payAmount}>{amountLabel}</Text>
              <Text style={styles.payStatus}>
                {item.doneAt
                  ? `Realizado el ${safeFormatDDMMYYYY(item.doneAt)}`
                  : "Pago realizado"}
              </Text>

              {!!item.paymentMpId && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={copyReceipt}
                  style={styles.receiptPill}
                >
                  <Text style={styles.receiptLabel}>Número Comprobante:</Text>
                  <Text style={styles.receiptValue} numberOfLines={1}>
                    {item.paymentMpId}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={[styles.payBox, styles.payBoxPending]}>
              <Text style={styles.payAmount}>{amountLabel}</Text>
              <Text style={styles.payStatus}>Pago pendiente</Text>
            </View>
          )}
        </View>
      </Animated.View>

      <ClickWindow
        visible={copiedVisible}
        title="Copiado"
        message="El número de comprobante fue copiado al portapapeles."
        buttonText="Aceptar"
        onClose={() => setCopiedVisible(false)}
        styles={clickWindowStyles1}
      />
    </>
  );
};

const WorkHistoryScreen: React.FC = () => {
  const { items, loading } = useWorkHistory();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de Trabajo</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <DotsLoader />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <WorkHistoryCard item={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default WorkHistoryScreen;