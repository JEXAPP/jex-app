import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RowButton from "@/components/button/RowButton";
import { useChangePasswordOne } from "@/hooks/employee/profile/settings/useChangePasswordOne";
import { changePasswordOneStyles as styles } from "@/styles/app/employee/profile/settings/changePasswordOneStyles";
import { Colors } from "@/themes/colors";
import { rowButtonStyles2 } from "@/styles/components/button/rowButton/rowButtonStyles2";
export default function ChangePasswordMethodScreen() {
  const {
    loading,
    emailMasked,
    phoneMasked,
    goToEmailValidation,
    goToSmsValidation,
  } = useChangePasswordOne();

  const options = [];

  if (emailMasked) {
    options.push({
      label: `Mandar código a ${emailMasked}`,
      iconName: "mail",
      onPress: goToEmailValidation,
    });
  }

  if (phoneMasked) {
    options.push({
      label: `Mandar código a ${phoneMasked}`,
      iconName: "smartphone",
      onPress: goToSmsValidation,
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Cambiar contraseña</Text>
        <Text style={styles.subtitle}>Elegí método de validación</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.optionsContainer}>
          {loading && (
            <Text style={{ color: Colors.gray3, marginTop: 20 }}>
              Cargando métodos disponibles...
            </Text>
          )}

          {!loading &&
            options.map((opt) => {
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