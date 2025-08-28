import { View } from "react-native";
import { detailOffersStyles as styles } from "@/styles/app/employee/offers/detailOffersStyles";

export default function OfferDetailsSkeleton() {
  return (
    <View style={styles.container}>
      

      <View style={styles.card}>
        {/* Imagen del evento */}
        <View
          style={{
            width: "100%",
            height: 150,
            borderRadius: 12,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Empresa */}
        <View
          style={{
            width: "70%",
            height: 20,
            borderRadius: 6,
            marginTop: 12,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Rol */}
        <View
          style={{
            width: "50%",
            height: 20,
            borderRadius: 6,
            marginTop: 8,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Salario */}
        <View
          style={{
            width: 100,
            height: 28,
            borderRadius: 6,
            marginTop: 12,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Fecha */}
        <View
          style={{
            width: "80%",
            height: 18,
            borderRadius: 6,
            marginTop: 10,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Ubicación label */}
        <View
          style={{
            width: "40%",
            height: 16,
            borderRadius: 6,
            marginTop: 16,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Ubicación texto */}
        <View
          style={{
            width: "70%",
            height: 18,
            borderRadius: 6,
            marginTop: 6,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Imagen del mapa */}
        <View
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            marginTop: 12,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Requerimientos */}
        <View
          style={{
            width: "50%",
            height: 16,
            borderRadius: 6,
            marginTop: 16,
            backgroundColor: "#E0E0E0",
          }}
        />
        <View
          style={{
            width: "80%",
            height: 16,
            borderRadius: 6,
            marginTop: 8,
            backgroundColor: "#E0E0E0",
          }}
        />
        <View
          style={{
            width: "60%",
            height: 16,
            borderRadius: 6,
            marginTop: 8,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Comentarios */}
        <View
          style={{
            width: "70%",
            height: 16,
            borderRadius: 6,
            marginTop: 16,
            backgroundColor: "#E0E0E0",
          }}
        />
        <View
          style={{
            width: "100%",
            height: 40,
            borderRadius: 6,
            marginTop: 8,
            backgroundColor: "#E0E0E0",
          }}
        />

        {/* Botones */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <View
            style={{
              width: "45%",
              height: 40,
              borderRadius: 10,
              backgroundColor: "#E0E0E0",
            }}
          />
          <View
            style={{
              width: "45%",
              height: 40,
              borderRadius: 10,
              backgroundColor: "#E0E0E0",
            }}
          />
        </View>

        {/* Expiration */}
        <View
          style={{
            width: "80%",
            height: 16,
            borderRadius: 6,
            marginTop: 20,
            backgroundColor: "#E0E0E0",
          }}
        />
      </View>
    </View>
  );
}
