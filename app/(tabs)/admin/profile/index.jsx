import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import SubmitButton from "../../../../components/shared/buttons/SubmitButton";
import ApiServiece from "../../../../services/apiService";
import LottieView from "lottie-react-native";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileValidationSchema from "../../../../components/validations/schemas/ProfileValidationSchema";
import Loading from "../../../../components/loading/Loading";
import ErrorMessage from "../../../../components/validations/FormError";
import ProfileSkeleton from "../../../../components/loading/Skeleton/Employee/Profile/ProfileSkeleton";
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
import CardComponent from "@/components/shared/CardComponent";
import {
  Dialog,
  Portal,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";

const Index = () => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [pendingSubmitValues, setPendingSubmitValues] = useState(null);
  const [pendingSubmitHelpers, setPendingSubmitHelpers] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profileImage, setProfileImage] = useState("");

  const pickImage = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      setFieldValue("profileImage", uri);
    }
  };

  const onRefresh = () =>
    new Promise(() => {
      setRefreshing(true);
      getProfile();
    });

  const getProfile = async () => {
    setRefreshing(true);
    try {
      const response = await ApiServiece.get("/admin/get-profile");

      const data = response.data.customer;
      console.log("api response", data);
      setProfileData({
        name: data.name,
        phone: data.phone,
        profileImage: data.profileImage,
      });

      console.log(profileData);

      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const handleProfileChange = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("phone", values.phone);

      if (values.password) {
        formData.append("password", values.password);
      }

      if (values.profileImage && values.profileImage.startsWith("file://")) {
        const uriParts = values.profileImage.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("profileImage", {
          uri: values.profileImage,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await ApiServiece.post("/admin/edit-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const message = response.data.message;
      showMessage({
        message: "موفقیت آمیز بود",
        description: `${message}`,
        type: "success",
        icon: "success",
      });
    } catch (error) {
      console.log("Error submitting form:", error.message);
      if (error.response) {
        console.log("Server responded with:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error setting up request:", error.message);
      }

      const message =
        error?.response?.data?.errorDetails || "خطایی رخ داده است";
      showMessage({
        message: "مشکلی پیش آمد",
        description: message,
        type: "danger",
        icon: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const resp = await ApiServiece.get("/auth/logout");

      Toast.show({
        type: "success",
        text1: `${resp.data?.msg}`,
      });

      await AsyncStorage.removeItem("authData");
      router.push("/Auth/login");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "مشکلی پیش آمد",
        text2: "خطایی در خروج از حساب رخ داده است",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [])
  );

  if (refreshing) {
    return <ProfileSkeleton />;
  }

  return (
    <Loading onRefresh={onRefresh}>
      {() => (
        <PaperProvider>
          <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <Formik
                initialValues={profileData}
                validationSchema={ProfileValidationSchema}
                onSubmit={(values, helpers) => {
                  setPendingSubmitValues(values);
                  setPendingSubmitHelpers(helpers);
                  setShowSubmitDialog(true);
                }}
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  setFieldValue,
                  isSubmitting,
                  isValid,
                  errors,
                  touched,
                }) => (
                  <>
                    {/* Profile Header */}
                    <View className="px-5 pt-8 items-center">
                      <View className="relative">
                        <TouchableOpacity
                          onPress={() => pickImage(setFieldValue)}
                          activeOpacity={0.7}
                          className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-200 shadow-md"
                        >
                          {values?.profileImage ? (
                            <Image
                              source={{
                                uri: values.profileImage.startsWith("file://")
                                  ? values.profileImage
                                  : `http://192.168.217.156:8080${values.profileImage}`,
                              }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View
                              className="w-full h-full rounded-full bg-white justify-center items-center shadow-md"
                              style={{
                                backgroundColor: "#F3F4F6",
                                shadowColor: "#E5E7EB",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.15,
                                shadowRadius: 6,
                                elevation: 3,
                              }}
                            >
                              <Ionicons
                                name="person-outline"
                                size={32}
                                color="#9CA3AF"
                              />
                            </View>
                          )}
                        </TouchableOpacity>

                        <View className="absolute bottom-0 left-0 bg-blue-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white">
                          <Text className="text-white text-lg font-bold">
                            +
                          </Text>
                        </View>
                      </View>

                      <Text className="text-sm text-gray-400 mt-2 font-sans">
                        "روی عکس کلیک کنید تا تغییر دهید"
                      </Text>
                    </View>

                    {/* Form Section */}
                    <View className="px-5 mt-8 space-y-5 flex">
                      <CardComponent className="p-5 mb-3">
                        <Text className="text-gray-500 text-sm mb-2 text-right font-sans">
                          نام
                        </Text>
                        <TextInput
                          value={values.name}
                          onChangeText={handleChange("name")}
                          className="border-b border-gray-200 pb-2 mb-2 text-base text-gray-800 text-right font-sans"
                          placeholder="نام خود را وارد کنید"
                          placeholderTextColor="#aaa"
                          style={{ writingDirection: "rtl" }}
                        />
                        <ErrorMessage
                          error={errors.name}
                          visible={touched.name}
                        />
                      </CardComponent>

                      <CardComponent className="p-5 mb-3">
                        <Text className="text-gray-500 text-sm mb-2 text-right font-sans">
                          شماره تماس
                        </Text>
                        <TextInput
                          value={values.phone}
                          keyboardType="phone-pad"
                          onChangeText={handleChange("phone")}
                          className="border-b border-gray-200 pb-2 mb-2 text-base text-gray-800 text-right font-sans"
                          placeholder="شماره تماس خود را وارد کنید"
                          placeholderTextColor="#aaa"
                          style={{ writingDirection: "rtl" }}
                        />
                        <ErrorMessage
                          error={errors.phone}
                          visible={touched.phone}
                        />
                      </CardComponent>

                      <CardComponent className="p-5 mb-3">
                        <Text className="text-gray-500 text-sm mb-2 text-right font-sans">
                          رمز عبور
                        </Text>
                        <TextInput
                          value={(values.password || "").slice(0, 10)}
                          secureTextEntry={true}
                          maxLength={10}
                          onChangeText={(text) =>
                            setFieldValue("password", text.slice(0, 10))
                          }
                          className="border-b border-gray-200 pb-2 mb-2 text-base text-gray-800 text-right font-sans"
                          placeholder="رمز عبور جدید خود را وارد کنید"
                          placeholderTextColor="#aaa"
                          style={{ writingDirection: "rtl" }}
                        />
                        <ErrorMessage
                          error={errors.password}
                          visible={touched.password}
                        />
                      </CardComponent>

                      {/* Save Button */}
                      <SubmitButton
                        title="ویرایش"
                        className="mt-4"
                        loading={isSubmitting && isValid}
                        disabled={isSubmitting || !isValid}
                        onPress={handleSubmit}
                      />

                      {/* Logout Button */}
                      <View className="px-5 mt-10">
                        <TouchableOpacity
                          onPress={() => setShowDialog(true)}
                          activeOpacity={0.7}
                          className="flex-row items-center justify-center bg-red-100 py-4 rounded-xl shadow-md"
                        >
                          <Feather name="log-out" size={20} color="#dc2626" />
                          <Text className="text-red-600 text-base font-semibold font-sans ml-2">
                            خروج از حساب کاربری
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              </Formik>
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
                    labelStyle={{ fontFamily: "sans", fontSize: 15 }}
                  >
                    خیر
                  </Button>
                  <Button
                    onPress={() => {
                      setShowDialog(false);
                      handleLogout();
                    }}
                    mode="contained"
                    labelStyle={{ fontFamily: "sans", fontSize: 15 }}
                  >
                    بله، خارج شو
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

            <Portal>
              <Dialog
                visible={showSubmitDialog}
                onDismiss={() => setShowSubmitDialog(false)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                }}
              >
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
                    آیا مطمئن هستید که می‌خواهید اطلاعات را ویرایش کنید؟
                  </Text>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: "space-between" }}>
                  <Button
                    textColor="#6b7280"
                    onPress={() => {
                      setShowSubmitDialog(false);

                      pendingSubmitHelpers.setSubmitting(false);
                    }}
                    mode="outlined"
                    labelStyle={{ fontFamily: "sans", fontSize: 15 }}
                  >
                    خیر
                  </Button>
                  <Button
                    onPress={async () => {
                      setShowSubmitDialog(false);
                      if (pendingSubmitValues && pendingSubmitHelpers) {
                        await handleProfileChange(
                          pendingSubmitValues,
                          pendingSubmitHelpers
                        );
                        pendingSubmitHelpers.setSubmitting(false);
                        setPendingSubmitValues(null);
                        setPendingSubmitHelpers(null);
                      }
                    }}
                    mode="contained"
                    labelStyle={{ fontFamily: "sans", fontSize: 15 }}
                  >
                    بله، تایید می‌کنم
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </SafeAreaView>
        </PaperProvider>
      )}
    </Loading>
  );
};

export default Index;
