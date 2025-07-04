import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
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

import { Ionicons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import LottieView from "lottie-react-native";
import MapView, { Marker, Polyline } from "react-native-maps"; // import MapView and Marker
import polyline from "@mapbox/polyline";
import * as Location from "expo-location"; // import expo-location
import CardComponent from "../../../../components/shared/CardComponent";
import Loading from "../../../../components/loading/Loading";
import EmployeeDashboardSkeleton from "../../../../components/loading/Skeleton/Employee/Dashboard/DashboardSkeleton";
import Wraper from "../../../../components/shared/Wraper";
const EmployeeDashboard = () => {
  // Existing states...
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [insideFence, setInsideFence] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // New state for user location
  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);

  // Animation refs and values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const confettiRef = useRef(null);

  const customMapStyle = [
    {
      elementType: "geometry",
      stylers: [{ color: "#fef8e8" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#5e5c5c" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#fef8e8" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "simplified" }, { color: "#fde68a" }],
    },
    {
      featureType: "poi.park",
      stylers: [{ color: "#c8f7c5" }, { visibility: "simplified" }],
    },
    {
      featureType: "road",
      stylers: [{ color: "#ffffff" }, { lightness: 100 }],
    },
    {
      featureType: "road.arterial",
      stylers: [{ color: "#ffd3b6" }],
    },
    {
      featureType: "road.highway",
      stylers: [{ color: "#ffaaa7" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      stylers: [{ color: "#a2e3ff" }],
    },
  ];

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
    new Promise((resolve) => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        resolve();
      }, 1500);
    });

  const destination = useRef({
    latitude: 32.513324,
    longitude: 51.791245,
  }).current;

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("دسترسی به موقعیت داده نشد.");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const getRouteFromMapIr = async (origin, dest) => {
    const url = `https://map.ir/routes/route/v1/driving/${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}`;
    try {
      const res = await axios.get(url, {
        params: { overview: "full", geometries: "polyline" },
        headers: {
          "x-api-key":
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ5N2E0NzE3NDNhM2M1OTQ3Y2YzNGUwZTIwYWRlZGUyNmRmMTFkYjY5OTc5NWY4YmYwYTg0ZDcyODk1Y2M3NjYwZmI2NWI0N2Q0Y2U1ODlmIn0.eyJhdWQiOiIzMjk2NSIsImp0aSI6ImQ5N2E0NzE3NDNhM2M1OTQ3Y2YzNGUwZTIwYWRlZGUyNmRmMTFkYjY5OTc5NWY4YmYwYTg0ZDcyODk1Y2M3NjYwZmI2NWI0N2Q0Y2U1ODlmIiwiaWF0IjoxNzUwMDY3NjA3LCJuYmYiOjE3NTAwNjc2MDcsImV4cCI6MTc1MjY1OTYwNywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.VNG637QjvVNbb-noYr5_92-cLU2UXwy-GkXxFKhyuYEb4S3xSLb1OR8n8PUoGUCz-VMPEKqX6-RqWZfH3gECAgodKUD5MFNA9c9qn8HbGH4mLDu61txCJHy-jLFOAw2BXcWslUM7uMFbhwPIYTVV3RN2vWvaNJ9eZ1uPgiUz0EP2OFylR4tI6Co21oW91DV2qsjwR5bPzgvlUBDkxFYNjq5k8XiJ7SbVO-qiB1c-A8hgzp8GCXGTpp2PLlyWVHHiNXOS436wxiU1J8dQZyDd4yGcBrZx0e1_NC9gDiVY4GiTQuLpbcQc6Agxt_sZIXRNSj0IWAti3Z3EW0mawuqoew",
        },
      });

      const route = res.data.routes[0];

      setDistance((route.distance / 1000).toFixed(1));
      setDuration(Math.ceil(route.duration / 60));

      const coords = polyline
        .decode(route.geometry)
        .map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
      setRouteCoords(coords);
    } catch (err) {
      console.error("خطا در مسیر‌یابی Map.ir:", err);
    }
  };

  React.useEffect(() => {
    if (location) getRouteFromMapIr(location, destination);
  }, [location]);

  // Use focus effect calls getUserLocation and refreshes UI
  useFocusEffect(
    useCallback(() => {
      setRouteCoords([]);
      setErrorMsg(null);
      (async () => {
        await getUserLocation();
      })();
    }, [])
  );

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setIsCheckedIn(true);
    setCheckInTime(now);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
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
      handleCheckOut();
    } else {
      handleCheckIn();
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
                    <Text className="font-sans text-right text-gray-800 text-lg">
                      صبح بخیر رضا
                    </Text>
                    <Text className="text-right mt-1 text-gray-500 text-sm">
                      {todayDate}
                    </Text>
                  </View>
                </CardComponent>
              </View>

              {/* Location Map */}
              {/* <View className="px-5 mt-8">
              <View className="h-80 rounded-3xl overflow-hidden shadow-2xl bg-[#FDE68A] border-4 border-yellow-400/70 relative">
                {location ? (
                  <>
                    <MapView
                      style={{ flex: 1 }}
                      customMapStyle={customMapStyle}
                      initialRegion={{
                        ...location,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }}
                      showsUserLocation
                      loadingEnabled
                      showsMyLocationButton={false}
                    >
                      <Marker
                        coordinate={destination}
                        title="📍 مقصد"
                        pinColor="green"
                      />
                      {routeCoords.length > 0 && (
                        <Polyline
                          coordinates={routeCoords}
                          strokeWidth={4}
                          strokeColor="#FF5733"
                        />
                      )}
                    </MapView>
                    <View className="absolute bottom-2 left-0 right-0 items-center">
                      <Text className="bg-white/80 px-4 py-2 rounded-full text-gray-800">
                        فاصله: {distance} km • زمان: {duration} min
                      </Text>
                    </View>
                  </>
                ) : (
                  <View className="flex-1 items-center justify-center bg-yellow-100">
                    <Text className="text-yellow-700">
                      {errorMsg || "در حال دریافت موقعیت..."}
                    </Text>
                  </View>
                )}
              </View>
            </View> */}

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
                        <Text className="text-blue-900 text-base font-medium font-IRANSansMobile">
                          زمان ورود:{" "}
                          <Text className="font-bold text-blue-800">
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
                  <Text className="text-lg font-sans text-gray-800 mb-2 text-right">
                    انگیزه روزانه 💬
                  </Text>
                  <Text className="text-gray-600 text-right leading-6 font-sans">
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
    </Wraper>
  );
};

export default EmployeeDashboard;
