import React, { useState, useCallback, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";
import ApiService from "@/services/apiService";
import { showMessage } from "react-native-flash-message";
import Alert from "../../../../components/shared/modal/Alert";
import { Ionicons } from "@expo/vector-icons";

import LottieView from "lottie-react-native";

import CardComponent from "../../../../components/shared/CardComponent";
import Loading from "../../../../components/loading/Loading";
import EmployeeDashboardSkeleton from "../../../../components/loading/Skeleton/Employee/Dashboard/DashboardSkeleton";
import Wraper from "../../../../components/shared/Wraper";
const EmployeeDashboard = () => {
  const [showChechkinDialog, setCheckinShowDialog] = useState(false);
  const [showChechkoutDialog, setCheckoutShowDialog] = useState(false);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Animation refs and values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const confettiRef = useRef(null);

  // Confetti effect
  useEffect(() => {
    if (showConfetti && confettiRef.current) {
      confettiRef.current.play();
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Pulse animation for status card
  useEffect(() => {
    if (isCheckedIn) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCheckedIn]);

  // Rotation animation for button
  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);
  // get user location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setRefreshing(false);
    } catch (err) {
      console.error("Error getting location:", err);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLocation();
    }, [])
  );

  // Button press animation
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onRefresh = () =>
    new Promise(() => {
      setRefreshing(true);
      getLocation();
    });

  const handleCheckIn = async () => {
    try {
      const data = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
      const response = await ApiService.post("/user/checkIn", data);

      const message = response.data.message;

      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setIsCheckedIn(true);
      setCheckInTime(now);

      showMessage({
        message: "موفقیت آمیز بود",
        description: `${message}`,
        type: "success",
        icon: "success",
      });
    } catch (error) {
      const message =
        error?.response?.data?.errorDetails || "خطای ناشناخته‌ای رخ داده است.";
      showMessage({
        message: "مشکلی پیش آمد",
        description: message,
        type: "danger",
        icon: "danger",
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      const data = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
      const response = await ApiService.post("/user/checkOut", data);

      const message = response.data.message;

      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setIsCheckedIn(false);
      setCheckInTime(null);

      showMessage({
        message: "موفقیت آمیز بود",
        description: `${message}`,
        type: "success",
        icon: "success",
      });
    } catch (error) {
      const message =
        error?.response?.data?.errorDetails || "خطای ناشناخته‌ای رخ داده است.";
      showMessage({
        message: "مشکلی پیش آمد",
        description: message,
        type: "danger",
        icon: "danger",
      });
    }
  };

  const todayDate = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handlePress = () => {
    animateButtonPress();
    if (isCheckedIn) {
      setCheckoutShowDialog(true);
    } else {
      setCheckinShowDialog(true);
      setShowConfetti(true);
    }
  };

  if (refreshing) {
    return <EmployeeDashboardSkeleton />;
  }

  return (
    <Wraper className="flex-1 bg-gray-50 relative">
      <Loading onRefresh={onRefresh}>
        {() => (
          <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView>
              {/* Profile & Greeting */}
              <View className="px-5 pt-5">
                <CardComponent className="flex-row-reverse items-center mt-9 p-5">
                  <View className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden ml-4">
                    <Image
                      source={{ uri: "https://i.pravatar.cc/300?img38" }}
                      className="w-full h-full"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="font-sans text-gray-800 text-lg">
                      صبح بخیر رضا
                    </Text>
                    <Text className=" mt-1 text-gray-500 text-sm">
                      {todayDate}
                    </Text>
                  </View>
                </CardComponent>
              </View>

              {/* Status & Actions */}
              <View className="px-5 mt-8 items-center">
                <CardComponent className="p-6 w-full border border-indigo-100 items-center">
                  {/* Status Card */}
                  <Animated.View
                    style={{ transform: [{ scale: pulseAnim }] }}
                    className={`flex-row items-center justify-end w-full mb-6 p-4 rounded-lg ${
                      isCheckedIn ? "bg-green-500/10" : "bg-yellow-400/10"
                    }`}
                  >
                    <View className="flex-row items-center">
                      {isCheckedIn ? (
                        <>
                          <Text className="text-[18px] text-emerald-700 mr-3 font-sans">
                            حضور شما ثبت شده است
                          </Text>
                          <Ionicons
                            name="checkmark-circle"
                            size={28}
                            color="#10B981"
                          />
                        </>
                      ) : (
                        <>
                          <Text className="text-[18px] text-yellow-800 mr-3 font-sans">
                            در انتظار ثبت حضور
                          </Text>
                          <Ionicons name="time" size={28} color="#F59E0B" />
                        </>
                      )}
                    </View>
                  </Animated.View>

                  {/* Main Button */}
                  <Animated.View
                    style={{ transform: [{ rotate: rotateInterpolate }] }}
                  >
                    <Animated.View
                      style={{ transform: [{ scale: buttonScaleAnim }] }}
                    >
                      <TouchableOpacity
                        onPress={handlePress}
                        activeOpacity={0.7}
                        className={`w-44 h-44 rounded-full justify-center items-center relative overflow-hidden ${
                          isCheckedIn ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{
                          transform: [{ rotate: "-45deg" }],
                          shadowColor: isCheckedIn ? "#EF4444" : "#10B981",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 8,
                          elevation: 5,
                        }}
                      >
                        {/* Button shine effect */}
                        <View className="absolute top-0 left-0 w-full h-1/2 bg-white/20" />

                        {/* Button inner circle */}
                        <View
                          className={`w-32 h-32 rounded-full justify-center items-center ${
                            isCheckedIn ? "bg-red-500/20" : "bg-emerald-500/20"
                          }`}
                        >
                          <Text className="text-white text-2xl  font-sans">
                            {isCheckedIn ? "خروج" : "ورود"}
                          </Text>
                        </View>

                        {/* Floating icon */}
                        <View className="absolute bottom-6">
                          <Ionicons
                            name={
                              isCheckedIn ? "exit-outline" : "enter-outline"
                            }
                            size={32}
                            color="white"
                          />
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  </Animated.View>

                  {/* Confetti Animation */}
                  {showConfetti && (
                    <View className="absolute inset-0 justify-center items-center pointer-events-none">
                      <LottieView
                        ref={confettiRef}
                        source={require("../../../../assets/animations/check.json")}
                        speed={1.5}
                        loop={false}
                        className="w-72 h-72"
                      />
                    </View>
                  )}

                  {/* Time display */}
                  {isCheckedIn && (
                    <Animated.View
                      style={{
                        opacity: rotateAnim,
                        transform: [
                          {
                            translateY: rotateAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                            }),
                          },
                        ],
                      }}
                      className="mt-6 bg-blue-50 px-5 py-4 rounded-lg w-full border border-blue-200"
                    >
                      <View className="flex-row-reverse items-center space-x-2 space-x-reverse">
                        <Ionicons name="time" size={20} color="#4F46E5" />
                        <Text className="text-blue-900 text-base font-medium font-sans">
                          زمان ورود:{" "}
                          <Text className="font-sans text-blue-800">
                            {checkInTime}
                          </Text>
                        </Text>
                      </View>
                    </Animated.View>
                  )}
                </CardComponent>
              </View>

              {/* Motivational Quote */}
              <View className="px-5 mt-8">
                <CardComponent className="p-5">
                  <Text className="text-lg font-sans text-gray-800 mb-2 ">
                    انگیزه روزانه 💬
                  </Text>
                  <Text className="text-gray-600  leading-6 font-sans">
                    موفقیت مجموع تلاش‌های کوچک است که هر روز تکرار می‌شود.
                  </Text>
                </CardComponent>
              </View>

              {/* Attendance Summary */}
              <View className="px-5 mt-8 mb-10">
                <View className="flex-row-reverse flex-wrap justify-between">
                  <CardComponent className="w-[32%] p-4 mb-4 items-center bg-white rounded-2xl shadow">
                    <Text className="text-3xl font-bold text-yellow-500 font-sans">
                      20
                    </Text>
                    <Text className="text-xs text-gray-500 mt-2 text-center font-sans">
                      روز های حاضر
                    </Text>
                  </CardComponent>

                  <CardComponent className="w-[32%] p-4 mb-4 items-center bg-white rounded-2xl shadow">
                    <Text className="text-3xl font-bold text-yellow-500 font-sans">
                      2
                    </Text>
                    <Text className="text-xs text-gray-500 mt-2 text-center font-sans">
                      روز های غایب
                    </Text>
                  </CardComponent>

                  <CardComponent className="w-[32%] p-4 mb-4 items-center bg-white rounded-2xl shadow">
                    <Text className="text-3xl font-bold text-yellow-500 font-sans">
                      1
                    </Text>
                    <Text className="text-xs text-gray-500 mt-2 text-center font-sans">
                      روز های با تاخیر
                    </Text>
                  </CardComponent>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Loading>

      <Alert
        visible={showChechkinDialog}
        onDismiss={() => setCheckinShowDialog(false)}
        onConfirm={() => {
          setCheckinShowDialog(false);
          handleCheckIn();
        }}
        mode="warning"
        title="می خواهید ورودی خود را ثبت کنید؟"
        cancelText="خیر"
        confirmText="بله،  ثبت کن"
      />

      <Alert
        visible={showChechkoutDialog}
        onDismiss={() => setCheckoutShowDialog(false)}
        onConfirm={() => {
          setCheckoutShowDialog(false);
          handleCheckOut();
        }}
        mode="warning"
        title="می خواهید خروجی خود را ثبت کنید؟"
        cancelText="خیر"
        confirmText="بله،  ثبت کن"
      />
    </Wraper>
  );
};

export default EmployeeDashboard;
