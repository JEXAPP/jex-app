import RowButton from "@/components/button/RowButton";
import { useProfileSettings } from "@/hooks/employee/profile/settings/useEmployeeSettings";
import { profileSettingsStyles as styles } from '@/styles/app/employee/profile/settings/employeeSettingsStyles';
import { rowButtonStyles1 } from "@/styles/components/button/rowButton/rowButtonStyles1";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileSettingsScreen: React.FC = () => {
  const { options } = useProfileSettings();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.headerTitle}>Configuración</Text>

        <View style={styles.listContainer}>
          {options.map((opt) => {
            return (
              <RowButton
                key={opt.id}
                title={opt.title}
                icon={opt.icon}
                onPress={opt.onPress}
                styles={rowButtonStyles1}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettingsScreen;
