import React from "react";
import { TextInput } from "react-native";

const TextFeild = ({
  value,
  onChangeText,
  placeholder,
  className = "",
  type = "text", // default to text
  ...props
}) => {
  const isPassword = type === "password";

  return (
    <TextInput
      className={`border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-right text-base text-gray-800 font-sans ${className}`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6b7280"
      secureTextEntry={isPassword}
      {...props}
    />
  );
};

export default TextFeild;
