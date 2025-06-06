import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

const SubmitButton = ({
  onPress,
  title,
  className = "",
  loading = false,    // controls spinner & opacity
  disabled = false,   // controls disabled state independently
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}   // disable if either loading or disabled
        className={`h-12 rounded-lg py-3 items-center flex-row justify-center shadow-md bg-blue-500 ${className}`}
        style={{ opacity: disabled || loading ? 0.6 : 1 }}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginRight: 8 }}
          />
        )}
        <Text className="text-white text-[14px] font-semibold font-sans">
          {loading ? "در حال ارسال..." : title || ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitButton;
