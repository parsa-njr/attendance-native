import React from "react";
import { TextInput, Text, View } from "react-native";

const TextArea = ({
  value,
  onChangeText,
  placeholder,
  label,
  className = "",
  numberOfLines = 6,
  ...props
}) => {
  return (
    <View className={`mb-6 ${className}`}>
      {label && (
        <Text className="mb-2 text-sm text-right text-gray-500 font-sans px-4">
          {label}
        </Text>
      )}
      <TextInput
        className="rounded-xl px-4 py-3 text-base text-right font-sans text-gray-800 bg-white border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200 h-32"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        multiline={true}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
    </View>
  );
};

export default TextArea;
