import { useState, useCallback, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Loading from "../../../../components/loading/Loading";
import EmployeeDashboardSkeleton from "../../../../components/loading/Skeleton/Employee/Dashboard/DashboardSkeleton";
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
import LottieView from "lottie-react-native";

const EmployeeDashboard = () => {
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      const timeout = setTimeout(() => {
        setRefreshing(false);
      }, 1500);
      return () => clearTimeout(timeout);
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
        <SafeAreaView c style={styles.container}>
          <ScrollView >
            {/* Profile & Greeting */}
            <View  style={styles.profileContainer}>
              <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: "https://i.pravatar.cc/300?img=5" }}
                    style={styles.avatar}
                  />
                </View>

                <View style={styles.profileTextContainer}>
                  <Text className="!font-sans" style={styles.greetingText}>صبح بخیر سارا</Text>
                  <Text style={styles.dateText}>{todayDate}</Text>
                </View>
              </View>
            </View>

            {/* Status & Actions */}
            <View style={styles.statusContainer}>
              <View style={styles.statusCard}>
                {/* Status Card */}
                <Animated.View
                  style={[
                    styles.statusIndicator,
                    isCheckedIn
                      ? styles.checkedInStatus
                      : styles.checkedOutStatus,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={styles.statusContent}>
                    {isCheckedIn ? (
                      <>
                        <Text className="!font-sans" style={styles.checkedInText}>
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
                        <Text className="!font-sans" style={styles.checkedOutText}>
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
                      style={[
                        styles.mainButton,
                        isCheckedIn
                          ? styles.checkOutButton
                          : styles.checkInButton,
                      ]}
                      activeOpacity={0.7}
                    >
                      {/* Button shine effect */}
                      <View style={styles.buttonShine} />

                      {/* Button inner circle */}
                      <View
                        style={[
                          styles.buttonInnerCircle,
                          isCheckedIn
                            ? styles.checkOutInner
                            : styles.checkInInner,
                        ]}
                      >
                        <Text className="!font-sans" style={styles.buttonText}>
                          {isCheckedIn ? "خروج" : "ورود"}
                        </Text>
                      </View>

                      {/* Floating icon */}
                      <View style={styles.buttonIcon}>
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
                  <View style={styles.confettiContainer}>
                    <LottieView
                      ref={confettiRef}
                      source={require("../../../../assets/animations/check.json")}
                      speed={1.5}
                      loop={false}
                      style={styles.confetti}
                    />
                  </View>
                )}

                {/* Time display */}
                {isCheckedIn && (
                  <Animated.View
                    style={[
                      styles.timeDisplay,
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
                  >
                    <View style={styles.timeContent}>
                      <Ionicons name="time" size={20} color="#4F46E5" />
                      <Text  className="!font-sans" style={styles.timeText}>
                        زمان ورود:{" "}
                        <Text  className="font-sans" style={styles.timeValue}>{checkInTime}</Text>
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </View>
            </View>

            {/* Motivational Quote */}
            <View style={styles.quoteContainer}>
              <View style={styles.quoteCard}>
                <Text  className="!font-sans" style={styles.quoteTitle}>انگیزه روزانه 💬</Text>
                <Text  className="!font-sans" style={styles.quoteText}>
                  موفقیت مجموع تلاش‌های کوچک است که هر روز تکرار می‌شود.
                </Text>
              </View>
            </View>

            {/* Attendance Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <SummaryCard label="روز های حاضر" value={20} color="#10B981" />
                <SummaryCard label="روز های غایب" value={2} color="#EF4444" />
                <SummaryCard
                  label="روز های با تاخیر"
                  value={1}
                  color="#F59E0B"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Loading>
  );
};

const SummaryCard = ({ label, value, color }) => {
  return (
    <View style={styles.summaryCard}>
      <Text className="!font-sans" style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text  className="!font-sans" style={styles.summaryLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
   
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row-reverse",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 36,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginLeft: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  profileTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
    color: "#1f2937",
    textAlign: "right",
    fontFamily: "IRANSansMobile",
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "right",
    fontFamily: "IRANSansMobile",
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
    alignItems: "center",
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  checkedInStatus: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  checkedOutStatus: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkedInText: {
    fontSize: 18,
    color: "#065f46",
    marginRight: 12,
    fontFamily: "IRANSansMobile_Bold",
  },
  checkedOutText: {
    fontSize: 18,
    color: "#92400e",
    marginRight: 12,
    fontFamily: "IRANSansMobile_Bold",
  },
  mainButton: {
    width: 176,
    height: 176,
    borderRadius: 88,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    position: "relative",
    transform: [{ rotate: "45deg" }],

  },
  checkInButton: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
  },
  checkOutButton: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
  },
  buttonShine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    
  },
  buttonInnerCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  checkInInner: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  checkOutInner: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontFamily: "IRANSansMobile_ExtraBold",
  },
  buttonIcon: {
    position: "absolute",
    bottom: 24,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  confetti: {
    width: 300,
    height: 300,
    // transform: [{ rotate: "45deg" }],

  },
  timeDisplay: {
    marginTop: 24,
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  timeContent: {
    flexDirection: "row-reverse",
    gap:'4',
    // justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    color: "#3730a3",
    fontSize: 16,
    fontFamily: "IRANSansMobile_Medium",
  },
  timeValue: {
    color: "#312e81",
    fontFamily: "IRANSansMobile_Bold",
  },
  quoteContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  quoteCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "right",
    fontFamily: "IRANSansMobile",
  },
  quoteText: {
    color: "#4b5563",
    textAlign: "right",
    fontFamily: "IRANSansMobile",
    lineHeight: 24,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
  },
  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "30%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "IRANSansMobile",
  },
  summaryLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    fontFamily: "IRANSansMobile",
  },
});

export default EmployeeDashboard;
