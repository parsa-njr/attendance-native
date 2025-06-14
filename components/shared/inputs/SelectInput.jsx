import React, { useState } from "react";
import { TouchableOpacity, Text, View, FlatList } from "react-native";
import BottomSheet from "../BottomSheet";
import { Ionicons } from "@expo/vector-icons";

const SelectInput = ({
  options = [],
  value,
  onChange,
  placeholder = "",
  label,
  className = "",
  inputKey,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleSelect = (item) => {
    onChange(item.value);
    setVisible(false);
  };

  return (
    <View className={`mb-6 ${className}`}>
      {label && (
        <Text className="mb-2 text-sm text-right text-gray-500 font-sans px-4">
          {label}
        </Text>
      )}

      <TouchableOpacity
        className="rounded-xl px-4 py-3 flex-row-reverse items-center justify-between bg-white border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
        onPress={() => setVisible(true)}
      >
        <Text
          className={`text-base ${
            selectedLabel ? "text-gray-800 " : "text-gray-400"
          } font-sans text-right flex-1`}
        >
          {selectedLabel || placeholder}
        </Text>

        <Ionicons
          name="chevron-down-outline"
          size={20}
          color="#a3a3a3"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      <BottomSheet
        key={inputKey}
        visible={visible}
        onClose={() => setVisible(false)}
       
      >
        <Text className="text-lg text-center mb-4 font-sans text-gray-700">
          {placeholder}
        </Text>

        <FlatList
          data={options}
          keyExtractor={(item, index) => item.value + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              className="py-4 px-6 border-b border-gray-100"
            >
              <Text className="text-center text-base font-sans text-gray-700">
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </View>
  );
};

export default SelectInput;
