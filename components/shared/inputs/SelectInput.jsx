// components/SelectInput.js
import React, { useState } from "react";
import { TouchableOpacity, Text, View, FlatList } from "react-native";
import BottomSheet from "../BottomSheet";
import { Ionicons } from "@expo/vector-icons";

// import BottomSheet from './BottomSheet';

const SelectInput = ({
  options = [],
  value,
  onChange,
  placeholder = "",
  className = "",
  inputKey,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleSelect = (item) => {
    onChange(item.value); // Only return value
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        className={`border border-gray-200 bg-gray-50 rounded-xl px-4 py-3   flex-row items-center justify-between font-sans ${className}`}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="chevron-down-outline" size={20} color="gray" />

        <Text className="text-lg text-gray-500">
          {selectedLabel || placeholder}
        </Text>
      </TouchableOpacity>

      <BottomSheet
        key={inputKey}
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 12,
          }}
          className="font-sans"
        >
          {placeholder}
        </Text>

        <FlatList
          data={options}
          keyExtractor={(item, index) => item.value + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text className="text-center font-sans">{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </>
  );
};

export default SelectInput;
