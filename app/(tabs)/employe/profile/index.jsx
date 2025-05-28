import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ProfileSkeleton from "../../../../components/loading/Skeleton/Employee/Profile/ProfileSkeleton";

import Loading from "../../../../components/loading/Loading";
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
import CardComponent from "../../../../components/shared/CardComponent";

const Index = () => {
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/300?img=5"
  );
  const [name, setName] = useState("Sarah Johnson");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [email, setEmail] = useState("sarah@example.com");
  const [refreshing, setRefreshing] = useState(false);

  const [profile, setProfile] = useState({
    profileImage: "https://i.pravatar.cc/300?img=5",
    firstName: "پارسا",
    lastName: "نجات پور",
    email: "parsanejatpoor@gmail.com",
    phoneNumber: "09191693237",
  });

  const pickImage = async () => {
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
  };

  const onRefresh = () =>
    new Promise((resolve) => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        resolve();
      }, 1500);
    });

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      const timeout = setTimeout(() => {
        setRefreshing(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }, [])
  );

  if (refreshing) {
    return <ProfileSkeleton />;
  }

  return (
    <Loading onRefresh={onRefresh}>
      {() => (
        <SafeAreaView className="flex-1 bg-gray-50 ">
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Profile Header */}
            <View className="px-5 pt-8 items-center mt-5">
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

                <View className="absolute bottom-0 left-0 bg-blue-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white">
                  <Text className="text-white text-lg font-bold">+</Text>
                </View>
              </View>

              <Text className="text-sm text-gray-400 mt-2 font-sans">
                روی عکس کلیک کنید تا تغییر دهید
              </Text>
            </View>

            {/* Form Section */}
            <View className="px-5 mt-8 space-y-5 flex">
              <>
                {/* First Name Input */}
                <CardComponent className=" p-5 mb-3">
                  <Text className="text-gray-500 text-sm mb-2 text-right font-sans">
                    نام
                  </Text>
                  <TextInput
                    value={profile.firstName}
                    onChangeText={(text) =>
                      setProfile((prev) => ({ ...prev, firstName: text }))
                    }
                    className="border-b border-gray-200 pb-2 text-base text-gray-800 text-right font-sans"
                    placeholder="نام خود را وارد کنید"
                    placeholderTextColor="#aaa"
                    style={{ writingDirection: "rtl" }}
                  />
                </CardComponent>

                {/* Last Name Input */}
                <CardComponent className=" p-5 mb-3">
                  <Text className="text-gray-500 text-sm mb-2 text-right font-sans">
                    نام خانوادگی
                  </Text>
                  <TextInput
                    value={profile.lastName}
                    onChangeText={(text) =>
                      setProfile((prev) => ({ ...prev, lastName: text }))
                    }
                    className="border-b border-gray-200 pb-2 text-base text-gray-800 text-right font-sans"
                    placeholder="نام خانوادگی خود را وارد کنید"
                    placeholderTextColor="#aaa"
                    style={{ writingDirection: "rtl" }}
                  />
                </CardComponent>

                <View className="flex-row justify-center gap-4 mt-8">
                  <TouchableOpacity
                    onPress={handleSave}
                    className="flex-1 bg-blue-600 rounded-lg py-4 items-center shadow-md"
                  >
                    <Text className="text-white text-base font-semibold font-sans">
                      ذخیره تغییرات
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Loading>
  );
};

export default Index;
