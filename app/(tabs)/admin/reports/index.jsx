import React, { useState, useCallback, useEffect } from "react";
import { useRef } from "react";
import { Animated, Easing, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DayReport from "../../../../components/admin/reports/DayReport";
import EmployeeReport from "../../../../components/admin/reports/EmployeeReport";

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import DatePickerInput from "../../../../components/shared/inputs/DatePickerInput";
import SelectInput from "../../../../components/shared/inputs/SelectInput";
import SubmitButton from "../../../../components/shared/buttons/SubmitButton";
import Loading from "../../../../components/loading/Loading";
import CardComponent from "../../../../components/shared/CardComponent";

const Index = () => {
  const locations = [
    { label: "انبار 1", value: "01" },
    { label: "کارگاه شمالی", value: "02" },
    { label: "کارگاه غربی", value: "03" },
    { label: "شرکت", value: "04" },
    { label: "اداره", value: "05" },
    { label: "مغازه اول", value: "06" },
  ];

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [users, setUsers] = useState(data);
  const animatedHeight = useRef(new Animated.Value(1)).current;

  const toggleFilters = () => {
    setFiltersExpanded((prev) => !prev);
    Animated.timing(animatedHeight, {
      toValue: filtersExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const attendanceData = [
    {
      date: "2025-04-20",
      workedHours: "8h 15m",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:15 PM",
    },
    {
      date: "2025-04-21",
      workedHours: "7h 30m",
      absentHours: "30m",
      checkIn: "09:30 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
    {
      date: "2025-04-22",
      workedHours: "8h",
      absentHours: "0h",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
    },
  ];

  const data = [
    {
      id: 1,
      image: "https://bootdey.com/img/Content/avatar/avatar1.png",
      name: "پارسا نجات پور",
      status: "Online",
    },
    {
      id: 2,
      image: "https://bootdey.com/img/Content/avatar/avatar6.png",
      name: "علی اصلانی",
      status: "Offline",
    },
    {
      id: 3,
      image: "https://bootdey.com/img/Content/avatar/avatar7.png",
      name: "ارسلان اسدی",
      status: "Busy",
    },
    {
      id: 4,
      image: "https://bootdey.com/img/Content/avatar/avatar2.png",
      name: "امیر علی نوروزی",
      status: "Away",
    },
    {
      id: 5,
      image: "https://bootdey.com/img/Content/avatar/avatar3.png",
      name: "حسن شماعی زاده",
      status: "Online",
    },
    {
      id: 6,
      image: "https://bootdey.com/img/Content/avatar/avatar4.png",
      name: "داریوش اقبالی",
      status: "Offline",
    },
    {
      id: 7,
      image: "https://bootdey.com/img/Content/avatar/avatar5.png",
      name: "عمو حسن",
      status: "Online",
    },
  ];

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
      setFormSubmitted(false);
      setRefreshing(true);
      const timeout = setTimeout(() => {
        setRefreshing(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }, [])
  );

  useEffect(() => {
    const loadFilters = async () => {
      const storedStartDate = await AsyncStorage.getItem("startDate");
      const storedEndDate = await AsyncStorage.getItem("endDate");
      const storedLocation = await AsyncStorage.getItem("selectedLocation");

      if (storedStartDate) setStartDate(storedStartDate);
      if (storedEndDate) setEndDate(storedEndDate);
      if (storedLocation) setSelectedLocation(storedLocation);
    };

    loadFilters();
  }, []);

  const handleSubmit = () => {
    setFormSubmitted(true);
  };

  useEffect(() => {
    if (startDate) {
      AsyncStorage.setItem("startDate", startDate);
      setFormSubmitted(false);
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      AsyncStorage.setItem("endDate", endDate);
      setFormSubmitted(false);
    }
  }, [endDate]);

  useEffect(() => {
    if (selectedLocation) {
      AsyncStorage.setItem("selectedLocation", selectedLocation);
      setFormSubmitted(false);
    }
  }, [selectedLocation]);

  const renderReport = () => {
    if (!startDate || !endDate || !selectedLocation || !formSubmitted) {
      return (
        <View className="mt-20  items-center justify-center px-6">
          <Ionicons
            name="information-circle-outline"
            size={64}
            color="#94a3b8"
          />
          <Text className="text-gray-500 text-center mt-4 font-sans leading-6">
            برای مشاهده گزارش، ابتدا فیلترهای بالا را پر کرده و دکمه "مشاهده" را
            بزنید.
          </Text>
        </View>
      );
    }

    return activeTab === "daily" ? (
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {attendanceData.map((day, index) => (
          <CardComponent className="mx-2 px-4 py-5  mb-3">
            <TouchableOpacity
              key={index}
              // className="bg-white rounded-xl shadow-md px-4 py-5 border border-gray-100 mb-3"
              activeOpacity={0.8}
              onPress={() => {
                setDayModalVisible(true);
              }}
            >
              <View className="flex-row items-center justify-end border-b border-gray-200 pb-2 mb-3">
                <Ionicons name="calendar-outline" size={18} color="#334155" />
                <Text className="ml-3 font-sans text-sm text-gray-700">
                  تاریخ: ۱۴۰۳/۰۲/۲۳
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <View className="flex-row items-center">
                  <Ionicons name="log-in-outline" size={18} color="#334155" />
                  <Text className="text-sm text-gray-600 font-sans text-right ml-2">
                    ورود: {day.checkIn}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="log-out-outline" size={18} color="#334155" />
                  <Text className="text-sm text-gray-600 font-sans text-right ml-2">
                    خروج: {day.checkOut}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="timer-outline" size={18} color="#334155" />
                  <Text className="text-sm text-gray-600 font-sans text-right ml-2">
                    کارکرد: {day.workedHours}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 font-sans text-right ml-2">
                    غیبت: {day.absentHours}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </CardComponent>
        ))}
      </ScrollView>
    ) : (
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {data.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              setEmployeeModalVisible(true);
            }}
            className="flex-row-reverse items-center px-4 py-3 bg-white"
          >
            <View className="w-14 h-14 rounded-full border-2 border-blue-500 overflow-hidden">
              <Image
                source={{ uri: item.image }}
                className="w-full h-full rounded-full"
              />
            </View>

            <View className="flex-1 mr-4 border-b border-gray-100 pb-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-gray-400 text-left">9:58 AM</Text>
                <Text className="text-base font-semibold text-gray-800 font-sans text-right">
                  {item.name}
                </Text>
              </View>
              <Text className={`text-sm mt-1 text-right`}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Loading onRefresh={onRefresh}>
      {() => (
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            className="mt-8"
          >
            {/* FILTER SECTION */}

            <View className="mx-4 mt-4">
              {/* Toggle Button */}
              <TouchableOpacity
                className="flex-row-reverse items-center justify-between bg-gray-200 px-4 py-3 rounded-xl text-right"
                onPress={toggleFilters}
              >
                <Text className="font-sans text-gray-800 text-right">
                  فیلترها
                </Text>
                <Ionicons
                  name={filtersExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#334155"
                />
              </TouchableOpacity>

              {/* Collapsible Filters */}
              <Animated.View
                style={{
                  overflow: "hidden",
                  height: animatedHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 320], // Adjusted height
                  }),
                }}
              >
                <View className="p-4 bg-gray-100 rounded-2xl shadow-sm space-y-6 mt-3">
                  {/* Date Pickers */}
                  <View>
                    <View className="flex-row-reverse flex-wrap justify-between gap-6">
                      <View style={{ flex: 1, minWidth: "45%" }}>
                        {/* Start Date Picker */}
                        
                        <DatePickerInput
                          label="تاریخ شروع"
                          placeholder="تاریخ شروع"
                          value={startDate}
                          onChange={setStartDate}
                        />
                      </View>

                      <View style={{ flex: 1, minWidth: "45%" }}>
                        {/* End Date Picker */}
                    
                        <DatePickerInput
                          label="تاریخ پایان"
                          placeholder="تاریخ پایان"
                          value={endDate}
                          onChange={setEndDate}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Location Selector */}
                  <View className="mt-2">
                    <SelectInput
                      placeholder="انتخاب موقعیت"
                      value={selectedLocation}
                      onChange={setSelectedLocation}
                      options={locations}
                    />
                  </View>

                  {/* Tab Selector */}
                  <View>
                    <View className="flex-row justify-between mt-2">
                      {[
                        { key: "daily", label: "روزانه" },
                        { key: "employee", label: "کارمند" },
                      ].map((tab) => (
                        <TouchableOpacity
                          key={tab.key}
                          className={`flex-1 mx-1 py-3 rounded-xl  ${
                            activeTab === tab.key
                              ? "bg-blue-600"
                              : "bg-white border border-gray-300"
                          }`}
                          onPress={() => {
                            setActiveTab(tab.key);
                            setFormSubmitted(false);
                          }}
                        >
                          <Text
                            className={`text-center font-semibold font-sans ${
                              activeTab === tab.key
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {tab.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Submit Button */}
                  <SubmitButton
                    title="📊 مشاهده گزارش"
                    onPress={!formSubmitted ? handleSubmit : null}
                    disabled={formSubmitted}
                    className={`mt-2 rounded-xl px-4 py-3 font-semibold text-center ${
                      formSubmitted
                        ? "bg-gray-300 text-gray-500"
                        : "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                    }`}
                  />
                </View>
              </Animated.View>
            </View>

            {/* REPORT SECTION */}
            <View className="mt-6 px-4">{renderReport()}</View>
            <DayReport
              visible={dayModalVisible}
              onClose={() => {
                setDayModalVisible(false);
              }}
              users={[
                {
                  id: 1,
                  name: "علی رضایی",
                  avatar: "https://i.pravatar.cc/150?img=3",
                  status: "present", // or "late" or "absent"
                  checkIn: "08:45",
                  checkOut: "17:00",
                  date: "۱۴۰۳/۰۲/۲۴",
                  notes: "جلسه مهم داشت.",
                },
                {
                  id: 2,
                  name: "سارا محمدی",
                  avatar: "https://i.pravatar.cc/150?img=4",
                  status: "late",
                  checkIn: "09:30",
                  checkOut: "16:50",
                  date: "۱۴۰۳/۰۲/۲۴",
                },
              ]}
            />

            <EmployeeReport
              visible={employeeModalVisible}
              onClose={() => {
                setEmployeeModalVisible(false);
              }}
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </Loading>
  );
};

export default Index;
