import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import PersianDatePicker from "react-native-persian-date-picker2";

const Index = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);

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
  ];

  const toggleExpand = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-10">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Date Range Picker */}
        <View className="px-5 pt-5">
          {/* <Text className="text-xl font-semibold text-gray-800 mb-4">گزارش حضور و غیاب</Text> */}
          
          <View className="flex-row justify-between space-x-4">
            <TouchableOpacity
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center"
              onPress={() => setStartPickerVisible(true)}
            >
              <Text className="text-gray-500 text-sm mb-1">تاریخ شروع</Text>
              <Text className="font-semibold text-gray-800">{startDate || "انتخاب کنید"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center"
              onPress={() => setEndPickerVisible(true)}
            >
              <Text className="text-gray-500 text-sm mb-1">تاریخ پایان</Text>
              <Text className="font-semibold text-gray-800">{endDate || "انتخاب کنید"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Report List */}
        <View className="px-5 mt-8 space-y-4">
          {attendanceData.map((day, index) => (
            <View key={index} className="bg-white rounded-2xl mt-2 shadow-sm">
              <TouchableOpacity
                className="flex-row justify-between items-center p-3"
                onPress={() => toggleExpand(index)}
              >
                <Ionicons
                  name={expandedDay === index ? "chevron-up-outline" : "chevron-down-outline"}
                  size={24}
                  color="gray"
                />
                <View>
                  <Text className="text-gray-800 font-semibold">1404/05/23</Text>
                  <Text className="text-gray-500 text-sm text-right">{day.workedHours} کار شده</Text>
                </View>
              </TouchableOpacity>

              {expandedDay === index && (
                <View className="border-t border-gray-100 px-5 pb-5 space-y-2">
                  <Text className="text-gray-600 text-sm">ورود: {day.checkIn}</Text>
                  <Text className="text-gray-600 text-sm">خروج: {day.checkOut}</Text>
                  <Text className="text-gray-600 text-sm">ساعات کاری: {day.workedHours}</Text>
                  <Text className="text-gray-600 text-sm">غیبت: {day.absentHours}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Persian Date Pickers */}
      {/* {isStartPickerVisible && (
        <PersianDatePicker
          mode="date"
          onConfirm={(date) => {
            setStartDate(date.format("jYYYY/jMM/jDD"));
            setStartPickerVisible(false);
          }}
          onCancel={() => setStartPickerVisible(false)}
          title="انتخاب تاریخ شروع"
        />
      )}

      {isEndPickerVisible && (
        <PersianDatePicker
          mode="date"
          onConfirm={(date) => {
            setEndDate(date.format("jYYYY/jMM/jDD"));
            setEndPickerVisible(false);
          }}
          onCancel={() => setEndPickerVisible(false)}
          title="انتخاب تاریخ پایان"
        />
      )} */}
    </SafeAreaView>
  );
};

export default Index;
