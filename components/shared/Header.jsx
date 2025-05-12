import { View, Text } from "react-native";
import React from "react";

const Header = ({ title, classname = "" }) => {
  return (
    <View
      style={{ borderBottomColor: "#eee" }}
      className={`border-b border-[#babcc1] ${classname}`}
    >
      <Text className="text-xl text-center text-gray-500 mb-2 font-sans">
        {title || ""}{" "}
      </Text>
    </View>
  );
};

export default Header;
