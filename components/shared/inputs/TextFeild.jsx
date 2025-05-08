import React from "react";
import { TextInput, View } from "react-native";

const TextFeild = ({ value, onChangeText, placeholder, className = "" }) => {
  return (
    <View
      className={`bg-white text-right   rounded-lg shadow-md ${className}`}
    >
      <TextInput
        className="text-right text-lg text-gray-500 p-4"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        textAlign="right"
      />
    </View>
  );
};

export default TextFeild;
