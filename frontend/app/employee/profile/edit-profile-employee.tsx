import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RowButton from "@/components/button/RowButton";
import { useEditEmployeeInfoMenu } from "@/hooks/employee/profile/useEditEmployeeInfoMenu";
import { editEmployeeInfoMenuStyles as styles } from "@/styles/app/employee/profile/editEmployeeInfoMenuStyles";
import { Colors } from "@/themes/colors";
import { rowButtonStyles2 } from "@/styles/components/button/rowButton/rowButtonStyles2";

export default function EditEmployeeInfoMenuScreen() {
  const {
    goToPersonalInfo,
    goToExperience,
    goToEducation,
    goToLanguages,
  } = useEditEmployeeInfoMenu();

  const options = [
    {
      label: "Modificar información personal",
      iconName: "user",
      onPress: goToPersonalInfo,
    },
    {
      label: "Modificar experiencia",
      iconName: "briefcase",
      onPress: goToExperience,
    },
    {
      label: "Modificar educación",
      iconName: "book-open",
      onPress: goToEducation,
    },
    {
      label: "Modificar idiomas",
      iconName: "globe",
      onPress: goToLanguages,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Modificar perfil</Text>
        <Text style={styles.subtitle}>Elegí qué querés editar</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.optionsContainer}>
          {options.map((opt) => {
            const iconElement = (
              <Feather
                name={opt.iconName as any}
                size={22}
                color={Colors.gray3}
              />
            );

            return (
              <RowButton
                key={opt.label}
                title={opt.label}
                icon={iconElement}
                onPress={opt.onPress}
                styles={rowButtonStyles2}
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
