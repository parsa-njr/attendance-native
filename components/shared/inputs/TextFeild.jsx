import React from "react";
import { TextInput, View } from "react-native";

const TextFeild = ({
  value,
  onChangeText,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    // <View className={`bg-white text-right   rounded-lg shadow-md`}>
    <TextInput
      className={`border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-right text-base text-gray-800 font-sans  ${className}`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6b7280"
      // textAlign="right"
      // onPress={}
      {...props}
    />
    // </View>
  );
};

export default TextFeild;
