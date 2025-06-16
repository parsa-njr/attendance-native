import { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import LottieView from "lottie-react-native";
import Loading from "../../../../components/loading/Loading";
import EmployeeDashboardSkeleton from "../../../../components/loading/Skeleton/Employee/Dashboard/DashboardSkeleton";
import CardComponent from "../../../../components/shared/CardComponent";
import ApiService from "@/services/apiService";

const EmployeeDashboard = () => {
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [registeredLocation, setRegisteredLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({});
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);

  // Animation refs and values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const confettiRef = useRef(null);

  // Request permission and watch position to get live updates
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation?.coords;
      setInitialRegion({
        latitude,
        longitude,
        
      });
      setLocation({ latitude, longitude });
    })();
  }, []);

  // Recalculate distance when both locations are available
  useEffect(() => {
    const calculateDistance = async () => {
      if (location && registeredLocation) {
        const dist = await Location.getDistanceAsync(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          {
            latitude: registeredLocation.latitude,
            longitude: registeredLocation.longitude,
          }
        );
        setDistance(dist);
      }
    };

    calculateDistance();
  }, [location, registeredLocation]);

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

  const getDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await ApiService.get("/user/dashboard");
      const location = response?.data?.user?.location;

      if (location?.latitude && location?.longitude) {
        setRegisteredLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          range: location.range,
        });
      } else {
        setRegisteredLocation(null);
      }

      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRegisteredLocation(null);
      setRefreshing(false);
    }
  };
  const onRefresh = () =>
    new Promise(() => {
      setRefreshing(true);
      getDashboardData();
    });

  useFocusEffect(
    useCallback(() => {
      getDashboardData();
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
    <Loading onRefresh={onRefresh}>
      {() => (
        <SafeAreaView className="flex-1 bg-gray-50">
          <ScrollView>
            {/* Profile & Greeting */}
            <View className="px-5 pt-5">
              <CardComponent className="p-5 flex-row-reverse items-center mt-9">
                <View className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden ml-4">
                  <Image
                    source={{ uri: "https://i.pravatar.cc/300?img38" }}
                    className="w-full h-full"
                  />
                </View>

                <View className="flex-1">
                  <Text className="font-sans text-lg text-gray-800 text-right">
                    صبح بخیر رضا
                  </Text>
                  <Text className="font-sans text-sm text-gray-500 mt-1 text-right">
                    {todayDate}
                  </Text>
                </View>
              </CardComponent>
            </View>

            {/* Display User Location with Map */}
            <View className="px-5 mt-5">
              <CardComponent className="p-4" style={{ height: 300 }}>
                {location ? (
                  <>
                    <Text className="text-right font-sans text-gray-700 mb-2">
                      موقعیت شما: {location.latitude.toFixed(5)} ،{" "}
                      {location.longitude.toFixed(5)}
                    </Text>
                    <MapView
                      style={styles.map}
                      region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                      showsUserLocation={true}
                      followsUserLocation={true}
                    >
                      {/* User location marker */}
                      <Marker
                        coordinate={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                        }}
                        title="موقعیت شما"
                        pinColor="blue"
                      />

                      {/* Registered location marker (if available) */}
                      {registeredLocation && (
                        <Marker
                          coordinate={{
                            latitude: registeredLocation?.latitude,
                            longitude: registeredLocation?.longitude,
                          }}
                          title="موقعیت ثبت‌شده"
                          pinColor="red"
                        />
                      )}
                    </MapView>
                  </>
                ) : locationErrorMsg ? (
                  <Text className="text-red-500 text-right font-sans">
                    {locationErrorMsg}
                  </Text>
                ) : (
                  <Text className="text-right font-sans text-gray-500">
                    در حال دریافت موقعیت...
                  </Text>
                )}
              </CardComponent>
            </View>

            {/* Status & Actions */}
            <View className="px-5 mt-8 items-center">
              <CardComponent className="p-6 w-full items-center border border-indigo-100">
                {/* Status Card */}
                <Animated.View
                  style={[{ transform: [{ scale: pulseAnim }] }]}
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
                        <Text className="text-[18px] text-amber-700 mr-3 font-sans">
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
                      className={`w-[176px] h-[176px] rounded-full justify-center items-center relative overflow-hidden ${
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
                        <Text className="font-sans text-white text-2xl font-extrabold">
                          {isCheckedIn ? "خروج" : "ورود"}
                        </Text>
                      </View>

                      {/* Floating icon */}
                      <View className="absolute bottom-6">
                        <Ionicons
                          name={isCheckedIn ? "exit-outline" : "enter-outline"}
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
                      className="w-[300px] h-[300px]"
                    />
                  </View>
                )}

                {/* Time display */}
                {isCheckedIn && (
                  <Animated.View
                    style={[
                      {
                        opacity: rotateAnim,
                        transform: [
                          {
                            translateY: rotateAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                    className="mt-6 bg-blue-100 px-5 py-4 rounded-xl w-full border border-blue-300"
                  >
                    <View className="flex-row-reverse gap-1 items-center">
                      <Ionicons name="time" size={20} color="#4F46E5" />
                      <Text className="font-sans text-blue-900 text-base">
                        زمان ورود:{" "}
                        <Text className="font-sans font-bold text-blue-800">
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
                <Text className="text-lg text-gray-800 mb-2 text-right font-sans">
                  انگیزه روزانه 💬
                </Text>
                <Text className="text-gray-600 text-right leading-6 font-sans">
                  موفقیت مجموع تلاش‌های کوچک است که هر روز تکرار می‌شود.
                </Text>
              </CardComponent>
            </View>

            {/* Attendance Summary */}
            <View className="px-5 mt-8 mb-10">
              <View className="flex-row-reverse justify-between">
                <CardComponent className="w-[30%] p-4 items-center">
                  <Text className="text-2xl font-bold text-yellow-400 font-sans">
                    20
                  </Text>
                  <Text className="text-xs text-gray-500 mt-2 text-center font-sans">
                    روز های حاضر
                  </Text>
                </CardComponent>

                <CardComponent className="w-[30%] p-4 items-center">
                  <Text className="text-2xl font-bold text-yellow-400 font-sans">
                    2
                  </Text>
                  <Text className="text-xs text-gray-500 mt-2 text-center font-sans">
                    روز های غایب
                  </Text>
                </CardComponent>

                <CardComponent className="w-[30%] p-4 items-center">
                  <Text className="text-2xl font-bold text-yellow-400 font-sans">
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
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 8,
  },
});

export default EmployeeDashboard;
