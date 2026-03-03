import ImageOnline from "@/components/image/ImageOnline";
import { DotsLoader } from "@/components/others/DotsLoader";
import { iconos } from "@/constants/iconos";
import StateOffersSkeleton from "@/constants/skeletons/employer/offers/stateOffersSkeleton";
import { useStateOffers } from "@/hooks/employer/offers/useStateOffers";
import { stateOffersStyles as styles } from "@/styles/app/employer/offers/stateOffersStyles";
import { Colors } from "@/themes/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectableTag } from "@/components/button/SelectableTags";
import { selectableTagStyles2 } from "@/styles/components/button/selectableTagsStyles/selectableTagsStyles2";
import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams } from "expo-router";
import ImageWindow from "@/components/window/ImageWindow";
import { useEffect, useMemo, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { ClickWindow } from "@/components/window/ClickWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";

type StatusParam = "success" | "failure" | "pending";

export default function StateOffersScreen() {
  const {
    currentEvent,
    goNextEvent,
    goPrevEvent,
    canGoNext,
    canGoPrev,
    filter,
    setFilter,
    finalizedFilter,
    setFinalizedFilter,
    filteredOffers,
    offers,
    events,
    loading,
    loadingEvents,
    creatingPaymentId,
    createPaymentLink,
    refreshOffers,
  } = useStateOffers();

  const { payment_status } = useLocalSearchParams<{ payment_status?: string }>();

  const [showInfo, setShowInfo] = useState(false);
  const [receiptCopiedVisible, setReceiptCopiedVisible] = useState(false);

  const statusContent = useMemo(() => {
    const s = (payment_status ?? "").toLowerCase() as StatusParam | "";
    if (s === "success") {
      return {
        title: "¡Pago exitoso!",
        subtitle: "El pago se ha realizado correctamente.",
        image: require("@/assets/images/jex/Jex-Pago-Exitoso.webp"),
      };
    }
    if (s === "failure") {
      return {
        title: "Pago rechazado",
        subtitle: "Hubo un error en el pago. Intentá nuevamente.",
        image: require("@/assets/images/jex/Jex-Pago-Rechazado.webp"),
      };
    }
    if (s === "pending") {
      return {
        title: "Pago pendiente",
        subtitle: "Tu pago está en proceso. Te avisaremos cuando se apruebe.",
        image: require("@/assets/images/jex/Jex-Pago-Pendiente.webp"),
      };
    }
    return null;
  }, [payment_status]);

  useEffect(() => {
    if (statusContent) {
      setShowInfo(true);
      setTimeout(() => {
        refreshOffers();
      }, 800);
    }
  }, [statusContent]);

  const cerrarVentana = () => {
    setShowInfo(false);
  };

  const handlePay = async (offerId: number) => {
    try {
      const { url } = await createPaymentLink(offerId);
      await WebBrowser.openBrowserAsync(url);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "No se pudo iniciar el pago.");
    }
  };

  if (loadingEvents) return <StateOffersSkeleton />;

  if (events.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Text style={styles.title}>Ofertas</Text>
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsTitle}>
            Aún no has creado ningún evento
          </Text>
          <Image
            source={require("@/assets/images/jex/Jex-Sin-Eventos.webp")}
            style={styles.noEventsImage}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    );
  }

  const isFinalized = currentEvent?.state.name === "Finalizado";
  const hasOffersForEvent = offers.some((o) => o.eventId === currentEvent!.id);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {statusContent && (
        <ImageWindow
          visible={showInfo}
          title={statusContent.title}
          subtitle={statusContent.subtitle}
          buttonText="Entendido"
          onClose={cerrarVentana}
          imageSource={statusContent.image}
        />
      )}

      <ClickWindow
        visible={receiptCopiedVisible}
        title="Copiado"
        message="El número de comprobante fue copiado al portapapeles."
        buttonText="Aceptar"
        onClose={() => setReceiptCopiedVisible(false)}
        styles={clickWindowStyles1}
      />

      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        data={loading ? [] : filteredOffers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const badgeStyle =
            item.status === "Pendiente"
              ? styles.statusPendiente
              : item.status === "Aceptada" || item.status === "A Pagar"
              ? styles.statusAceptada
              : styles.statusRechazada;

          const badgeText =
            item.status === "Vencida" ? "Vencida" : item.status;

          const isApproved = item.payment_state === "APPROVED";
          const isPending = item.payment_state === "PENDING";
          const isNotPayed = item.payment_state === "NOT_PAYED";
          const showPayButton = isFinalized && isNotPayed;

          const copyReceipt = async () => {
            const raw = item.payment_mp_id
              ? String(item.payment_mp_id).trim()
              : "";
            if (!raw) return;
            await Clipboard.setStringAsync(raw);
            setReceiptCopiedVisible(true);
          };

          return (
            <View style={styles.offerCard}>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, badgeStyle]}>
                  {badgeText}
                </Text>
              </View>

              <View style={styles.offerHeader}>
                <ImageOnline
                  imageUrl={item.imageUrl}
                  imageId={item.imageId}
                  size={70}
                  shape="circle"
                  style={styles.avatar}
                  fallback={require("@/assets/images/jex/Jex-Postulantes-Default.webp")}
                />
                <View style={styles.headerInfo}>
                  <Text style={styles.employeeName}>
                    {item.employeeName}
                  </Text>
                  <Text style={styles.roleText}>{item.role}</Text>
                </View>
              </View>

              <View style={styles.turnContainer}>
                <View style={styles.turnRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.gray3} />
                  <Text style={styles.turnText}>{item.fechaInicio}</Text>
                </View>

                <View style={styles.turnRow}>
                  <Ionicons name="time-outline" size={16} color={Colors.gray3} />
                  <Text style={styles.turnText}>
                    {item.horaInicio} - {item.horaFin}
                  </Text>
                </View>
              </View>

              <View
                style={
                  isFinalized && isApproved
                    ? styles.paymentBlockApproved
                    : styles.paymentBlock
                }
              >
                {!isFinalized && (
                  <Text style={styles.paymentAmountPending}>
                    {item.salary} ARS
                  </Text>
                )}

                {isFinalized && isApproved && (
                  <>
                    <Text style={styles.paymentAmountApproved}>
                      {item.salary} ARS
                    </Text>

                    <Text style={styles.paymentDateText}>
                      Realizado el pago el {item.payment_date}
                    </Text>

                    {!!item.payment_mp_id && (
                      <TouchableOpacity
                        style={styles.receiptBox}
                        onPress={copyReceipt}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.receiptLabel}>
                          Número Comprobante:
                        </Text>
                        <Text style={styles.receiptValue} numberOfLines={1}>
                          {item.payment_mp_id}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {isFinalized && isPending && (
                  <>
                    <Text style={styles.paymentAmountPending}>
                      {item.salary} ARS
                    </Text>
                    <View style={styles.pendingBox}>
                      <ActivityIndicator size="small" color={Colors.violet4} />
                      <Text style={styles.pendingText}>Pago pendiente</Text>
                    </View>
                  </>
                )}

                {isFinalized && !isApproved && !isPending && (
                  <View style={styles.payRow}>
                    <Text style={styles.paymentAmountPending}>
                      {item.salary} ARS
                    </Text>

                    {showPayButton && (
                      <TouchableOpacity
                        onPress={() => handlePay(item.id)}
                        style={[
                          styles.payButtonSmall,
                          creatingPaymentId === item.id && { opacity: 0.7 },
                        ]}
                        disabled={creatingPaymentId === item.id}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.payButtonSmallText}>
                          {creatingPaymentId === item.id
                            ? "Abriendo..."
                            : "Pagar"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Ofertas</Text>

            <View style={styles.eventRow}>
              <View style={styles.sideSlot}>
                {canGoPrev && (
                  <TouchableOpacity onPress={goPrevEvent}>
                    {iconos.flechaIzquierda(24, Colors.violet4)}
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.centerSlot}>
                <Text style={styles.eventName}>
                  {currentEvent!.name}
                </Text>
              </View>

              <View style={styles.sideSlot}>
                {canGoNext && (
                  <TouchableOpacity onPress={goNextEvent}>
                    {iconos.flechaDerecha(24, Colors.violet4)}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {currentEvent?.state?.name && (
              <View style={styles.eventEstadoBadge}>
                <Text style={styles.eventEstadoText}>{currentEvent.state.name}</Text>
              </View>
            )}
            

            <View style={styles.tagsRow}>
              {isFinalized ? (
                <>
                  <SelectableTag
                    title="A Pagar"
                    selected={finalizedFilter === "A_PAGAR"}
                    onPress={() => setFinalizedFilter("A_PAGAR")}
                    styles={selectableTagStyles2}
                  />
                  <SelectableTag
                    title="Pagado"
                    selected={finalizedFilter === "PAGADO"}
                    onPress={() => setFinalizedFilter("PAGADO")}
                    styles={selectableTagStyles2}
                  />
                </>
              ) : (
                <>
                  <SelectableTag
                    title="Pendiente"
                    selected={filter === "Pendiente"}
                    onPress={() => setFilter("Pendiente")}
                    styles={selectableTagStyles2}
                  />
                  <SelectableTag
                    title="Aceptadas"
                    selected={filter === "Aceptadas"}
                    onPress={() => setFilter("Aceptadas")}
                    styles={selectableTagStyles2}
                  />
                  <SelectableTag
                    title="Otro"
                    selected={filter === "Otro"}
                    onPress={() => setFilter("Otro")}
                    styles={selectableTagStyles2}
                  />
                </>
              )}
            </View>

            {loading && <DotsLoader />}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            isFinalized && finalizedFilter === "A_PAGAR" ? (
              <View style={styles.generalEmptyContainer}>
                
                <Image
                  source={require("@/assets/images/jex/Jex-Asociado.webp")}
                  style={styles.generalEmptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.generalEmptyTitle}>
                  Pagaste a todos los empleados
                </Text>
              </View>
            ) : isFinalized && finalizedFilter === "PAGADO" ? (
              <View style={styles.generalEmptyContainer}>
                
                <Image
                  source={require("@/assets/images/jex/Jex-Pago-Rechazado.webp")}
                  style={styles.generalEmptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.generalEmptyTitle}>
                  No realizaste ningún pago aún
                </Text>
              </View>
            ): !hasOffersForEvent ? (
              <View style={styles.generalEmptyContainer}>
                
                <Image
                  source={require("@/assets/images/jex/Jex-Sin-Eventos.webp")}
                  style={styles.generalEmptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.generalEmptyTitle}>
                  Sin Ofertas
                </Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                
                <Image
                  source={require("@/assets/images/jex/Jex-Sin-Eventos.webp")}
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.emptyTitle}>
                  Sin Ofertas de este tipo
                </Text>
              </View>
            )
          ) : null
        }
      />
    </SafeAreaView>
  );
}