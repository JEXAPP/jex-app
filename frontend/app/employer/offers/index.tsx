import ImageOnline from "@/components/image/ImageOnline";
import { DotsLoader } from "@/components/others/DotsLoader";
import { iconos } from "@/constants/iconos";
import StateOffersSkeleton from "@/constants/skeletons/employer/offers/stateOffersSkeleton";
import { useStateOffers } from "@/hooks/employer/offers/useStateOffers";
import { stateOffersStyles as styles } from "@/styles/app/employer/offers/stateOffersStyles";
import { Colors } from "@/themes/colors";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectableTag } from "@/components/button/SelectableTags";
import { selectableTagStyles2 } from "@/styles/components/button/selectableTagsStyles/selectableTagsStyles2";
import * as WebBrowser from "expo-web-browser";

export default function StateOffersScreen() {
  const {
    currentEvent,
    goNextEvent,
    goPrevEvent,
    canGoNext,
    canGoPrev,
    filter,
    setFilter,
    filteredOffers,
    offers,
    events,
    loading,
    loadingEvents,
    creatingPaymentId,
    createPaymentLink,
  } = useStateOffers();

  const handlePay = async (offerId: number) => {
    try {
      const { url } = await createPaymentLink(offerId);
      await WebBrowser.openBrowserAsync(url);
    } catch (err: any) {
      console.error("Error al iniciar pago MP:", err);
      Alert.alert("Error", err?.message ?? "No se pudo iniciar el pago.");
    }
  };

  if (loadingEvents) return <StateOffersSkeleton />;

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ofertas</Text>
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsTitle}>Aún no has creado ningún evento</Text>
          <Image
            source={require("@/assets/images/jex/Jex-Sin-Eventos.webp")}
            style={styles.noEventsImage}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  const hasOffersForEvent = offers.some((o) => o.eventId === currentEvent!.id);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View>
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
            <Text style={styles.eventName}>{currentEvent!.name}</Text>
          </View>

          <View style={styles.sideSlot}>
            {canGoNext && (
              <TouchableOpacity onPress={goNextEvent}>
                {iconos.flechaDerecha(24, Colors.violet4)}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.tagsRow}>
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
        </View>

        {loading ? (
          <DotsLoader />
        ) : !hasOffersForEvent ? (
          <View style={styles.generalEmptyContainer}>
            <Text style={styles.generalEmptyTitle}>Sin Ofertas</Text>
            <Image
              source={require("@/assets/images/jex/Jex-Sin-Eventos.webp")}
              style={styles.generalEmptyImage}
              resizeMode="contain"
            />
          </View>
        ) : filteredOffers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Sin Ofertas de este tipo</Text>
            <Image
              source={require("@/assets/images/jex/Jex-Sin-Eventos.webp")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <FlatList
            data={filteredOffers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const badgeStyle =
                item.status === "Pendiente"
                  ? styles.statusPendiente
                  : item.status === "Aceptada"
                  ? styles.statusAceptada
                  : styles.statusRechazada;

              const badgeText = item.status === "Vencida" ? "Vencida" : item.status;

              return (
                <View style={styles.offerCard}>
                  <View style={styles.statusBadge}>
                    <Text style={[styles.statusText, badgeStyle]}>{badgeText}</Text>
                  </View>

                  <View style={styles.offerHeader}>
                    <ImageOnline
                      imageUrl={item.imageUrl}
                      imageId={item.imageId}
                      size={70}
                      shape="circle"
                      style={{ marginRight: 10 }}
                      fallback={require("@/assets/images/jex/Jex-Postulantes-Default.webp")}
                    />
                    <View style={styles.column}>
                      <Text style={styles.employeeName}>{item.employeeName}</Text>
                      <View style={styles.salaryPill}>
                        <Text style={styles.salaryText}>{item.salary} ARS</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.roleText}>{item.role}</Text>

                  <View style={styles.datePill}>
                    <Ionicons name="calendar" size={14} color={Colors.gray3} />
                    <Text style={styles.date}>
                      {`${item.fechaInicio}      ${item.horaInicio} - ${item.horaFin}`}
                    </Text>
                  </View>

                  {item.status === "Aceptada" && (
                    <TouchableOpacity
                      onPress={() => handlePay(item.id)}
                      style={{
                        marginTop: 12,
                        alignSelf: "flex-end",
                        backgroundColor: Colors.violet4,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        opacity: creatingPaymentId === item.id ? 0.7 : 1,
                      }}
                      disabled={creatingPaymentId === item.id}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Ionicons name="card" size={16} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          {creatingPaymentId === item.id ? "Abriendo..." : "Pagar"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
