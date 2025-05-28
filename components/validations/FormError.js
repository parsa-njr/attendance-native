import React, { useEffect, useRef } from "react";
import { Text, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const FormError = ({ error, visible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-5)).current;

  useEffect(() => {
    if (visible && error) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, error]);

  if (!error || !visible) return null;

  return (
    <Animated.View
      className="mb-2"
      style={{
        flexDirection: "row-reverse", // Flip for RTL
        alignItems: "center",
        marginTop: 4,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <FontAwesome
        name="exclamation-circle"
        size={16}
        color="#FF6B6B"
        style={{ marginLeft: 6 }} 
      />
      <Text
        className="font-sans text-right"
        style={{ color: "#FF6B6B", fontSize: 14 }}
      >
        {error}
      </Text>
    </Animated.View>
  );
};

export default FormError;
