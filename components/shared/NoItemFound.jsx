import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const NoItemFound = ({ title = null }) => {
  return (
    <View className="flex-1 justify-center items-center mt-10">
      <LottieView
        source={require("../../assets/animations/Animation - 1745703881904 (1).json")} // Replace with your actual Lottie file
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text className="text-gray-500 mt-4 text-lg font-sans">
        {title || ""}
      </Text>
    </View>
  );
};

export default NoItemFound;
