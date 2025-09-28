import React, { useState, useCallback, useEffect } from "react";
import { useRef } from "react";
import { Animated, Easing, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DayReport from "../../../../components/admin/reports/DayReport";
import EmployeeReport from "../../../../components/admin/reports/EmployeeReport";
import Wraper from "../../../../components/shared/Wraper";
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
import ApiService from "../../../../services/apiService";
import { convertToJalali } from "../../../../utils/dateFunctions";
import { customToast } from "../../../../components/shared/toast/CustomeToast";
import NoItemFound from "../../../../components/shared/NoItemFound";

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
  const [singleUserData, setSingleUserData] = useState(null);

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

  const [dailyReportData, setDailyReportData] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(null);
  const [dayReportUserList, setDayReportUserList] = useState(null);

  const getDateBaseReport = async () => {
    setDailyLoading(true);
    try {
      const response = await ApiService.get(
        "/customer/get-date-base-report?startDate=2025-05-22T00:00:00.000%2B00:00&endDate=2025-06-20T00:00:00.000%2B00:00&location=687514947b1fbc256cdd306a"
      );
      const data = response.data;

      console.log("shiftData : ", data);
      setDailyReportData(data);
      setDailyLoading(false);
    } catch (error) {
      console.log("error", error);
      setDailyLoading(false);
    }
  };

  const [userList, setUserList] = useState(null);
  const [usersLoading, setUsersLoading] = useState(null);
  const getUserList = async () => {
    setUsersLoading(true);
    try {
      const response = await ApiService.get(
        "/customer/get-location-users/687514947b1fbc256cdd306a"
      );
      const data = response.data.data;

      console.log("shiftData : ", data);
      setUserList(data);
      setUsersLoading(false);
    } catch (error) {
      console.log("error", error);
      setUsersLoading(false);
    }
  };
  const [userReportLoading, setUserReportLoading] = useState(false);
  const [userReportData, setUserReportData] = useState(null);

  const getReportBaseUser = async (id) => {
    setUserReportLoading(true);
    console.log("bbbbbbbbbbbbbbbbbbb");
    try {
      const response = await ApiService.get(
        `/customer/get-user-base-report/?userId=${id}&startDate=2025-06-02T00:00:00.000%2B00:00&endDate=2025-06-02T00:00:00.000%2B00:00`
      );
      // console.log("response : ", response);
      const data = response.data;

      console.log("data : ", data);
      setUserReportData(data);
      setUserReportLoading(false);
      setEmployeeModalVisible(true);
    } catch (error) {
      console.log("error", error);
      setUserReportLoading(false);
      customToast({
        title: "مشکلی پیش آمد",
        type: "danger",
        description: message,
        delay: 300, // ⏱️ delay in ms
      });
    }
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
    if (activeTab === "daily") {
      getDateBaseReport();
    } else if (activeTab === "employee") {
      getUserList();
    }
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
        {dailyReportData?.length > 0 ? (
          <>
            {dailyReportData.map((item, index) => (
              <CardComponent className="mb-3">
                <TouchableOpacity
                  key={index}
                  className="   p-4"
                  // className="bg-white rounded-xl shadow-md px-4 py-5 border border-gray-100 mb-3"
                  activeOpacity={0.8}
                  onPress={() => {
                    setDayModalVisible(true);
                    setDayReportUserList(item?.users);
                  }}
                >
                  <View className="flex-row items-center justify-end ">
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#334155"
                    />
                    <Text className="text-gray-800 font-semibold font-sans">
                      {convertToJalali(item?.date)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </CardComponent>
            ))}
          </>
        ) : (
          <>
            <NoItemFound title="موردی یافت نشد" />
          </>
        )}
      </ScrollView>
    ) : (
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {userList?.length > 0 ? (
          <>
            {userList.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  getReportBaseUser(item._id);
                  setSingleUserData(item);
                  console.log("helloooooo");
                }}
                className="flex-row-reverse items-center px-4 py-4 bg-white rounded-2xl mx-4 my-2 shadow-md"
              >
                <TouchableOpacity className="w-16 h-16 rounded-full border-2 border-blue-500 overflow-hidden shadow-sm">
                  {item?.image ? (
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-full rounded-full"
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

                <View className="flex-1 mr-4 border-b border-gray-100 pb-3">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs text-gray-400 text-left font-light">
                      9:58 AM
                    </Text>
                    <Text className="text-lg font-semibold text-gray-900 font-sans text-right">
                      {item.name}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View />
                    <Text className="text-sm text-gray-500 text-right">
                      {item.phone}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <NoItemFound title="موردی یافت نشد" />
          </>
        )}
      </ScrollView>
    );
  };

  return (
    <Wraper className="flex-1 bg-gray-50 relative">
      <Loading onRefresh={onRefresh}>
        {() => (
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
                    onPress={handleSubmit}
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
              users={dayReportUserList || []}
            />

            <EmployeeReport
              visible={employeeModalVisible}
              onClose={() => {
                setEmployeeModalVisible(false);
              }}
              data={userReportData}
              userData={singleUserData}
            />
          </ScrollView>
        )}
      </Loading>
    </Wraper>
  );
};

export default Index;
