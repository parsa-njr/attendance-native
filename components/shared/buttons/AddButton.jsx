import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const AddButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#3B82F6", // blue-500
        borderRadius: 999,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        zIndex: 999, // Ensure it's above everything
      }}
    >
      <AntDesign name="plus" size={28} color="#fff" />
    </TouchableOpacity>
  );
};


export default AddButton;
