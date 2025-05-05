import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native"; // Importing Lottie

const Login = () => {
  const [scaleValue] = useState(new Animated.Value(1));

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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Background Animation: Typing Animation */}
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
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent white background
              borderRadius: 24,
              overflow: "hidden",
              backdropFilter: "blur(10px)", // Glassmorphism effect
            }}
          >
            <Text className=" text-center text-white mb-8 font-sans">
              خوش آمدید
            </Text>

            <View className="space-y-6">
              {/* Phone Number Input */}
              <TextInput
                className="bg-white/20 text-white rounded-2xl py-4 px-6 text-lg "
                placeholder="شماره موبایل"
                placeholderTextColor="#ccc"
                keyboardType="phone-pad"
                style={{
                  borderBottomColor: "#fff",
                  borderBottomWidth: 2,
                  marginBottom: 20,
                }}
              />
              {/* Password Input */}
              <TextInput
                className="bg-white/20 text-white rounded-2xl py-4 px-6 text-lg font-sans"
                placeholder="رمز عبور"
                placeholderTextColor="#ccc"
                secureTextEntry
                style={{
                  borderBottomColor: "#fff",
                  borderBottomWidth: 2,
                  marginBottom: 20,
                }}
              />
            </View>

            {/* Login Button with Animation */}
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <TouchableOpacity
                onPress={() => {
                  animateButton();
                  // handle login here
                }}
                style={{
                  marginTop: 20,
                  paddingVertical: 14,
                  paddingHorizontal: 40,
                  borderRadius: 30,
                  backgroundColor: "linear-gradient(45deg, #4F9BFF, #8360FF)", // Gradient background
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <Text className="text-white font-sans text-lg">ورود</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Sign Up Link */}
            <Text className="text-center text-sm text-gray-200 mt-6 font-sans">
              حساب کاربری ندارید؟{" "}
              <Text className="text-blue-400 font-sans">ثبت نام</Text>
            </Text>
          </BlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
