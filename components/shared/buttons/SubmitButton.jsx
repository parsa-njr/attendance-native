import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const SubmitButton = ({ onPress, title, className = "" }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        className={`h-12  bg-blue-500 rounded-lg py-3 items-center  shadow-md  ${className}`}
      >
        <Text className="text-white text-[14px] font-semibold font-sans items-center">
          {title || ""}{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitButton;
