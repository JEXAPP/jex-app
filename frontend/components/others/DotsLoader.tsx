// components/DotsLoader.tsx
import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";

export const DotsLoader = () => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.3, translateY: 0 }}
          animate={{ opacity: 1, translateY: -5 }}
          transition={{
            type: "timing",
            duration: 500,
            delay: i * 200,
            loop: true,
          }}
          style={{
            width: 10,
            height: 10,
            marginTop:150,
            borderRadius: 5,
            backgroundColor: "#4B0082", // violeta
            marginHorizontal: 5,
          }}
        />
      ))}
    </View>
  );
};
