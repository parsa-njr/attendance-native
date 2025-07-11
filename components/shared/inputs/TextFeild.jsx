import React from "react";
import { TextInput, Text, View } from "react-native";

const TextFeild = ({
  value,
  onChangeText,
  placeholder,
  label,
  className = "",
  type = "text",
  ...props
}) => {
  const isPassword = type === "password";

  return (
    <View className={`mb-6 ${className}`}>
      {label && (
        <Text className="mb-2 text-sm text-right text-gray-500 font-sans px-4">
          {label}
        </Text>
      )}
      <TextInput
        className="rounded-xl px-4 py-3 text-base text-right font-sans text-gray-800 bg-white border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        secureTextEntry={isPassword}
        {...props}
      />
    </View>
  );
};

export default TextFeild;
