import React from "react";
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "@/components/input/Input";
import { inputStyles2 } from "@/styles/components/input/inputStyles/inputStyles2";
import { useChangePasswordTwo } from "@/hooks/employee/profile/settings/useChangePasswordTwo";
import { changePasswordTwoStyles as styles } from "@/styles/app/employee/profile/settings/changePasswordTwoStyles";

export default function ChangePasswordTwoScreen() {
  const {
    inputs,
    inputsRef,
    handleChange,
    handleKeyPress,
    borderColors,
    shakeAnim,
    subtitle,
  } = useChangePasswordTwo();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/jex/Jex-Registrandose.webp")}
              style={styles.image}
            />

            <Text style={styles.title}>Cambiar contraseña</Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoidingView}
          >
            <Text style={styles.subtitle}>{subtitle}</Text>

            <Animated.View
              style={[
                inputStyles2.inputContainer,
                { transform: [{ translateX: shakeAnim }] },
              ]}
            >
              {inputs.map((value, index) => (
                <Input
                  key={index}
                  ref={(ref) => {
                    if (ref) inputsRef[index] = ref;
                  }}
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  styles={{
                    input: [
                      inputStyles2.input,
                      { borderColor: borderColors[index] },
                    ],
                    inputContainer: inputStyles2.inputContainer,
                  }}
                />
              ))}
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
