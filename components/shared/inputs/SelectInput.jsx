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
  placeholder = ""
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
        className="bg-white px-4 py-2 rounded-lg shadow-md w-1/2  flex-row items-center justify-between"
        onPress={() => setVisible(true)}
      >
        <Ionicons name="chevron-down-outline" size={20} color="gray" />

        <Text className="text-lg text-gray-500">
          {selectedLabel || placeholder}
        </Text>
      </TouchableOpacity>

      <BottomSheet visible={visible} onClose={() => setVisible(false)}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 12,
          }}
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
              <Text className="text-center">{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </>
  );
};

export default SelectInput;
