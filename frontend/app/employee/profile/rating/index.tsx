import React from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/themes/colors";
import { employeeRatingsStyles as styles } from "@/styles/app/employee/profile/rating/employeeRatingsStyles";
import ImageOnline from "@/components/image/ImageOnline";
import { EmployeeRating, useEmployeeRatings } from '@/hooks/employee/profile/rating/useEmployeeRatings';
import { DotsLoader } from "@/components/others/DotsLoader";

type RatingItemProps = {
  item: EmployeeRating;
  index: number;
};

const RatingItem: React.FC<RatingItemProps> = ({ item, index }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-12)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      delay: index * 90,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      delay: index * 90,
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
      {/* Header: avatar + nombre + fecha */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <ImageOnline
            imageUrl={item.reviewerImageUrl ?? undefined}
            size={40}
            shape={'square'}
            style={styles.avatar}
          />
          <Text style={styles.name}>{item.companyName}</Text>
        </View>

        <View style={styles.datePill}>
          <Text style={styles.dateText}>{item.createdAt}</Text>
        </View>
      </View>

      {/* Rol */}
      <Text style={styles.role}>{item.jobType}</Text>

      {/* Rating numérico */}
      <View style={styles.ratingRow}>
        <View style={styles.starsRow}>
          {[...Array(5)].map((_, idx) => {
            const filled = idx + 1 <= Math.floor(item.score);
            const half = item.score - idx >= 0.5 && item.score - idx < 1;
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
        <Text style={styles.ratingValue}>{item.score.toFixed(1)}</Text>
      </View>

      {/* Comentario */}
      <View style={styles.commentBubble}>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>
    </Animated.View>
  );
};

const EmployeeRatingsScreen: React.FC = () => {
  const { ratings, loading } = useEmployeeRatings();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header con back y título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calificaciones</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <DotsLoader />
        </View>
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <RatingItem item={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default EmployeeRatingsScreen;
