import React, { useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import {
  Text,
  Pressable,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import { Formik } from "formik";
import { showMessage } from "react-native-flash-message";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiServiece from "../../services/apiService";
import SignUpSchema from "../../components/validations/schemas/SignUpValidation";
import ErrorMessage from "../../components/validations/FormError"; // separate error message component

const Login = () => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [url] = useState("http://localhost:8080/api/v1");

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Inside your component:
  const router = useRouter();

  const handleSignUp = async (values, { setSubmitting }) => {
    const data = {
      name: values.name,
      phone: values.phone,
      password: values.password,
    };
    console.log("data", data);

    try {
      const resp = await ApiServiece.post(`auth/sign-up`, data);
      const { token, user } = resp?.data || {};

      if (token && user) {
        const authData = { token, user };
        await AsyncStorage.setItem("authData", JSON.stringify(authData));

        showMessage({
          message: "خوش آمدید",
          description: "ثبت نام با موفقیت انجام شد",
          type: "success",
          icon: "success",
        });

        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data?.errorDetails);
      const message = err?.response?.data?.errorDetails;
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={require("../../assets/animations/Animation - 1745700345349 (1).json")}
        autoPlay
        loop
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <View className="absolute inset-0 bg-black/40" />

      <KeyboardAvoidingView
        className="w-full px-6 flex-1 justify-center items-center"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BlurView
            intensity={80}
            tint="dark"
            className="w-full max-w-lg p-8 rounded-3xl border border-white/20"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 24,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <Text className=" text-center text-white mb-8 font-sans">
              ثبت نام
            </Text>

            <Formik
              initialValues={{ name: "", phone: "", password: "" }}
              validationSchema={SignUpSchema}
              onSubmit={handleSignUp}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View className="space-y-6">
                  <View>
                    <TextInput
                      className="bg-white/20 text-white rounded-2xl py-4 px-6 text-lg font-sans"
                      placeholder="نام"
                      placeholderTextColor="#ccc"
                      keyboardType="default"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                      style={{
                        borderBottomColor: "#fff",
                        borderBottomWidth: 2,
                        marginBottom: 8,
                      }}
                    />
                    <ErrorMessage error={errors.name} visible={touched.name} />
                  </View>
                  <View>
                    <TextInput
                      className="bg-white/20 text-white rounded-2xl py-4 px-6 text-lg font-sans"
                      placeholder="شماره موبایل"
                      placeholderTextColor="#ccc"
                      keyboardType="phone-pad"
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      value={values.phone}
                      style={{
                        borderBottomColor: "#fff",
                        borderBottomWidth: 2,
                        marginBottom: 8,
                      }}
                    />
                    <ErrorMessage
                      error={errors.phone}
                      visible={touched.phone}
                    />
                  </View>

                  <View>
                    <TextInput
                      className="bg-white/20 text-white rounded-2xl py-4 px-6 text-lg font-sans"
                      placeholder="رمز عبور"
                      placeholderTextColor="#ccc"
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      style={{
                        borderBottomColor: "#fff",
                        borderBottomWidth: 2,
                        marginBottom: 8,
                      }}
                    />
                    <ErrorMessage
                      error={errors.password}
                      visible={touched.password}
                    />
                  </View>

                  <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <TouchableOpacity
                      disabled={isSubmitting}
                      onPress={() => {
                        animateButton();
                        handleSubmit();
                      }}
                      style={{
                        marginTop: 20,
                        paddingVertical: 14,
                        paddingHorizontal: 40,
                        borderRadius: 30,
                        backgroundColor: "#3E5E88",
                        justifyContent: "center",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 5,
                        flexDirection: "row", // in case you want text + spinner side by side in future
                      }}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white font-sans text-lg">
                          ثبت نام
                        </Text>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
            </Formik>

            <View className="flex-row justify-center mt-6">
              <Pressable onPress={() => router.push("/Auth/login")}>
                <Text className="text-sm text-blue-400 font-sans">ورود</Text>
              </Pressable>
              <Text className="text-sm text-gray-200 font-sans">
                از قبل حساب دارید ؟{" "}
              </Text>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
