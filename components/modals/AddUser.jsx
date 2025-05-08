import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import BottomSheet from "../shared/BottomSheet";

const AddUser = ({ visible, onClose }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
  });

  const [users, setUsers] = useState([]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="p-8 rounded-t-3xl relative bg-white">
        {/* Close button */}
        <TouchableOpacity
          className="absolute top-4 left-4 z-10"
          onPress={onClose}
        >
          <Text className="text-2xl text-gray-500">✕</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-xl text-center text-gray-800 mb-2 font-sans">
          افزودن کارمند جدید
        </Text>

        {/* Inputs */}
        <TextInput
          placeholder="نام"
          placeholderTextColor="#aaa"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-4 text-right text-base text-gray-800 font-sans"
          value={newUser.name}
          onChangeText={(text) => setNewUser({ ...newUser, name: text })}
        />

        <TextInput
          placeholder="سمت"
          placeholderTextColor="#aaa"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-4 text-right text-base text-gray-800 font-sans"
          value={newUser.position}
          onChangeText={(text) => setNewUser({ ...newUser, position: text })}
        />

        <TextInput
          placeholder="ایمیل"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-4 text-right text-base text-gray-800 font-sans"
          value={newUser.email}
          onChangeText={(text) => setNewUser({ ...newUser, email: text })}
        />

        <TextInput
          placeholder="شماره تماس"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-6 text-right text-base text-gray-800 font-sans"
          value={newUser.phone}
          onChangeText={(text) => setNewUser({ ...newUser, phone: text })}
        />

        {/* Add Button */}
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 mt-6"
          onPress={() => {
            // Handle adding user
            if (newUser.name.trim()) {
              const newEntry = {
                id: users.length + 1,
                ...newUser,
                status: "Online",
              };

              setUsers([...users, newEntry]);
              setNewUser({
                name: "",
                position: "",
                email: "",
                phone: "",
              });
              onClose();
            }
          }}
        >
          <Text className="text-white text-center text-base font-sans">
            افزودن
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default AddUser;
