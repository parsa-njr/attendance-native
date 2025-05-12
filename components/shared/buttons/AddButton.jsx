import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const AddButton = ({ onPress, className = "" }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`absolute bottom-6  right-6 w-28 h-16 bg-blue-500 rounded-full justify-center items-center shadow-lg ${className}`}
      style={{
        elevation: 10,
        width: 70,
        height: 70,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      }}
    >
      <AntDesign name="plus" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

export default AddButton;
