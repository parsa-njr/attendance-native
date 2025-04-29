import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

const Index = () => {
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/300?img=5"
  );
  const [name, setName] = useState("Sarah Johnson");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [email, setEmail] = useState("sarah@example.com");

  const [profile, setProfile] = useState({
    profileImage: "https://i.pravatar.cc/300?img=5",
    firstName: "پارسا",
    lastName: "نجات پور",
    email: "parsanejatpoor@gmail.com",
    phoneNumber: "09191693237",
  });

  // const [isEditing, setIsEditing] = useState(false); // << New Edit Mode State

  const pickImage = async () => {
    // if (!isEditing) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfile((prev) => ({
        ...prev,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const handleSave = () => {
    console.log("Saved:", profile);
    // setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-9">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* <View className="absolute top-5 left-5 z-10">
          {!isEditing && (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="flex-row bg-blue-500 rounded-lg  items-center shadow-md"
            >
              <AntDesign
                className="text-white text-base font-semibold p-2"
                name="edit"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        </View> */}

        {/* Profile Header */}
        <View className="px-5 pt-8 items-center">
          <View className="relative">
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.7}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-200 shadow-md"
            >
              <Image
                source={{ uri: profile.profileImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>

            {/* Small Plus Icon - only show if editing */}
            {/* {isEditing && ( */}
            <View className="absolute bottom-0 left-0 bg-blue-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white">
              <Text className="text-white text-lg font-bold">+</Text>
            </View>
            {/* )} */}
          </View>

          <Text className="text-sm text-gray-400 mt-2">
            "روی عکس کلیک کنید تا تغییر دهید"
          </Text>
        </View>

        {/* Form Section */}
        <View className="px-5 mt-8 space-y-5 flex">
          {/* Name Input */}
          {/* First Name Input */}
          <View className="bg-white rounded-2xl p-5 mb-3 shadow-sm">
            <Text className="text-gray-500 text-sm mb-2 text-right">نام</Text>
            <TextInput
              value={profile.firstName}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, firstName: text }))
              }
              // editable={isEditing}
              className="border-b border-gray-200 pb-2 text-base text-gray-800 text-right"
              placeholder="نام خود را وارد کنید"
              placeholderTextColor="#aaa"
              style={{ writingDirection: "rtl" }}
            />
          </View>

          {/* Last Name Input */}
          <View className="bg-white rounded-2xl p-5 mb-3 shadow-sm">
            <Text className="text-gray-500 text-sm mb-2 text-right">
              نام خانوادگی
            </Text>
            <TextInput
              value={profile.lastName}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, lastName: text }))
              }
              // editable={isEditing}
              className="border-b border-gray-200 pb-2 text-base text-gray-800 text-right"
              placeholder="نام خانوادگی خود را وارد کنید"
              placeholderTextColor="#aaa"
              style={{ writingDirection: "rtl" }}
            />
          </View>

          {/* Edit or Save Button */}
          {/* {isEditing && ( */}
          <View className="flex-row justify-center gap-4 mt-8">
            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-blue-500 rounded-lg py-4 items-center shadow-md"
            >
              <Text className="text-white text-base font-semibold">
                ذخیره تغییرات
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            {/* <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="flex-1 bg-gray-400 rounded-full py-4 items-center shadow-md"
              >
                <Text className="text-white text-base font-semibold">
                  انصراف
                </Text>
              </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
