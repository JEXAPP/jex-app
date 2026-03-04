// app/employer/profile/ViewEmployerProfileScreen.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ImageOnline from "@/components/image/ImageOnline";
import { IconButton } from "@/components/button/IconButton";
import { iconButtonStyles1 } from "@/styles/components/button/iconButtonStyles1";
import { DotsLoader } from "@/components/others/DotsLoader";

import { useViewEmployerProfile } from "@/hooks/employer/profile/useViewEmployerProfile";
import { employerProfileViewStyles as s } from "@/styles/app/employer/profile/employerProfileViewStyles";
import { Colors } from "@/themes/colors";
import { iconos } from "@/constants/iconos";

export default function ViewEmployerProfileScreen() {
  const { data, loading, error } = useViewEmployerProfile();

  if (loading && !data) {
    return (
      <SafeAreaView style={s.centerFull}>
        <DotsLoader />
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={s.centerFull}>
        <Text style={s.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={["left", "right"]}>
      {/* Header violeta con foto, nombre y lápiz */}
      <View style={s.topHero}>
        {/* Volver */}
        <TouchableOpacity style={s.backBtnHero} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        {/* Editar */}
        <View style={s.editButtonTop}>
          <IconButton
            onPress={() =>
              router.push("/employer/profile/edit-basic")
            }
            sizeButton={30}
            backgroundColor="transparent"
            icon={iconos.edit(24, Colors.white)}
            styles={iconButtonStyles1}
          />
        </View>

        {/* Foto + Nombre */}
        <View style={s.topHeroCenter}>
          <ImageOnline
            imageUrl={data?.profileImageUrl ?? null}
            size={96}
            shape="circle"
            fallback={require("@/assets/images/jex/Jex-Evento-Default.webp")}
            style={s.avatar}
          />
          <Text style={s.nameCenter}>
            {data?.companyName || "Nombre de empresa"}
          </Text>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Descripción */}
        <View style={s.descCard}>
          <Text style={s.descTitle}>Descripción</Text>
          <Text style={s.descText}>
            {data?.description && data.description.trim() !== ""
              ? data.description
              : "Sin descripción."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
