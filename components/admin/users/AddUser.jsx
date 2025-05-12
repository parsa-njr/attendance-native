import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import TextFeild from "../../shared/inputs/TextFeild";

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
      <View style={{paddingHorizontal:32, paddingTop:4}} className=" rounded-t-3xl relative bg-white">
        <Header classname="mb-4" title="افزودن کارمند جدید" />

        <TextFeild
          value={newUser.name}
          onChangeText={(text) => setNewUser({ ...newUser, name: text })}
          placeholder="نام"
          className="mb-4"
        />
        <TextFeild
          value={newUser.position}
          onChangeText={(text) => setNewUser({ ...newUser, position: text })}
          placeholder="سمت"
          className="mb-4"
        />
        <TextFeild
          value={newUser.email}
          onChangeText={(text) => setNewUser({ ...newUser, email: text })}
          placeholder="ایمیل"
          className="mb-4"
          keyboardType="email-address"
        />
        <TextFeild
          value={newUser.phone}
          onChangeText={(text) => setNewUser({ ...newUser, phone: text })}
          placeholder="شماره تماس"
          className="mb-4"
          keyboardType="phone-pad"
        />

        {/* Add Button */}

        <SubmitButton
          className="mt-4"
          title="افزودن"
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
        />
      </View>
    </BottomSheet>
  );
};

export default AddUser;
