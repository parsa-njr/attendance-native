import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

const SubmitButton = ({
  onPress,
  title,
  className = "",
  loading = false,
  disabled = false,
  icon = null,
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className={`h-12 rounded-lg px-4 flex-row items-center justify-center shadow-md bg-blue-500 ${className}`}
        style={{ opacity: disabled || loading ? 0.6 : 1 }}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        )}

        <Text className="text-white text-[14px] font-semibold font-sans">
          {title}
        </Text>

        {icon && <View className="ml-2">{icon}</View>}
      </TouchableOpacity>
    </View>
  );
};

export default SubmitButton;
