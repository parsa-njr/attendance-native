import React, { useState } from "react";
import { useRouter } from "expo-router";
import ApiServiece from "../../../../services/apiService";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
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
import CardComponent from "@/components/shared/CardComponent";
import {
  Dialog,
  Portal,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";

const Index = () => {
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/300?img=5"
  );
  const [name, setName] = useState("Sarah Johnson");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [email, setEmail] = useState("sarah@example.com");
  const [showDialog, setShowDialog] = useState(false);

  const [profile, setProfile] = useState({
    profileImage: "https://i.pravatar.cc/300?img=5",
    firstName: "پارسا",
    lastName: "نجات پور",
    email: "parsanejatpoor@gmail.com",
    phoneNumber: "09191693237",
  });

  const router = useRouter();

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

  const handleLogout = () => {
    ApiServiece.get("/auth/logout")
      .then((resp) => {
        console.log(resp.data);
        Toast.show({
          type: "success",
          text1: `${resp.data?.msg}`,
        });
        AsyncStorage.removeItem("authData");
        router.push("/Auth/login");
      })
      .catch((err) => {
        console.log(err);
        Toast.show({
          type: "error",
          text1: "مشکلی پیش آمد",
          text2: "خطایی در خروج از حساب رخ داده است",
        });
      });
  };

  return (
    <PaperProvider>
      <SafeAreaView className="flex-1 bg-gray-50 ">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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

              <View className="absolute bottom-0 left-0 bg-blue-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white">
                <Text className="text-white text-lg font-bold">+</Text>
              </View>
            </View>

            <Text className="text-sm text-gray-400 mt-2 font-sans">
              "روی عکس کلیک کنید تا تغییر دهید"
            </Text>
          </View>

          {/* Form Section */}
          <View className="px-5 mt-8 space-y-5 flex">
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

            {/* Save Button */}
            <View className="flex-row justify-center gap-4 mt-8">
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-blue-500 rounded-lg py-4 items-center shadow-md"
              >
                <Text className="text-white text-base font-semibold font-sans">
                  ذخیره تغییرات
                </Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View className="px-5 mt-10">
              <TouchableOpacity
                onPress={() => setShowDialog(true)}
                activeOpacity={0.7}
                className="flex-row items-center justify-center bg-red-100 py-4 rounded-xl shadow-md"
              >
                <Feather
                  name="log-out"
                  size={20}
                  color="#dc2626"
                  className="mr-2"
                />
                <Text className="text-red-600 text-base font-semibold font-sans">
                  خروج از حساب کاربری
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Dialog Confirmation */}
        <Portal>
          <Dialog
            visible={showDialog}
            onDismiss={() => setShowDialog(false)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 5,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <LottieView
                source={require("../../../../assets/animations/Animation - 1748604940792 (1).json")}
                autoPlay
                loop
                style={{ width: 180, height: 180, marginBottom: -20 }}
              />
            </View>
            <Dialog.Content>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontFamily: "sans",
                  color: "#111827",
                  marginBottom: 10,
                }}
              >
                می‌خواهید از حساب کاربری خارج شوید؟
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-between" }}>
              <Button
                textColor="#6b7280"
                onPress={() => setShowDialog(false)}
                mode="outlined"
                labelStyle={{
                  fontFamily: "sans",

                  fontSize: 15,
                }}
              >
                خیر
              </Button>
              <Button
                onPress={() => {
                  setShowDialog(false);
                  handleLogout();
                }}
                mode="contained"
                labelStyle={{
                  fontFamily: "sans",

                  fontSize: 15,
                }}
              >
                بله، خارج شو
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Index;
