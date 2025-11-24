import React from "react";
import {
  Animated,
  FlatList,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageOnline from "@/components/image/ImageOnline";
import { DotsLoader } from "@/components/others/DotsLoader";

import { employerEventsHistoryStyles as styles } from "@/styles/app/employer/profile/employerEventsHistoryStyles";
import { useEmployerEventsHistory, EmployerEventHistoryItem } from '../../../hooks/employer/profile/useEmployerEventsHistory';

type EventHistoryCardProps = {
  item: EmployerEventHistoryItem;
  index: number;
};

const EventHistoryCard: React.FC<EventHistoryCardProps> = ({ item, index }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-14)).current;

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

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Header violeta: foto + nombre del evento */}
      <View style={styles.cardHeader}>
        <View style={styles.eventRow}>
          <ImageOnline
            imageUrl={item.eventImageUrl ?? undefined}
            size={48}
            shape="square"
            style={styles.eventLogo}
          />
          <Text style={styles.eventName}>{item.name}</Text>
        </View>
      </View>

      {/* Cuerpo blanco: descripción del evento */}
      <View style={styles.body}>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    </Animated.View>
  );
};

const EmployerEventsHistoryScreen: React.FC = () => {
  const { items, loading, error } = useEmployerEventsHistory();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header con título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de eventos</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <DotsLoader />
        </View>
      ) : (
        <>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <EventHistoryCard item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default EmployerEventsHistoryScreen;
