import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons"; // Make sure you have this or use another icon lib

const Header = ({ title, classname = "", onClose }) => {
  return (
    <View
      style={{ borderBottomColor: "#eee" }}
      className={`border-b border-[#babcc1] px-4 py-3 flex-row items-center justify-between ${classname}`}
    >
      {/* Invisible spacer to center the title when close icon exists */}
      <View style={{ width: 24 }} />

      <Text className="text-xl text-center text-gray-500 font-sans flex-1">
        {title || ""}
      </Text>

      {/* Close Button */}
      <TouchableOpacity onPress={onClose} className="pl-2">
        <Ionicons name="close" size={24} color="#777" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
