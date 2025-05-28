import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import BottomSheet from "../../shared/BottomSheet";
import Ionicons from "@expo/vector-icons/Ionicons"; // or use from 'react-native-vector-icons/Ionicons'
import Header from "../../../components/shared/Header";
const attendanceData = [
  {
    date: "1404/05/23",
    checkIn: "08:55 AM",
    checkOut: "05:20 PM",
    workedHours: "8h 25m",
    absentHours: "0h",
  },
   {
    date: "1404/05/23",
    checkIn: "08:55 AM",
    checkOut: "05:20 PM",
    workedHours: "8h 25m",
    absentHours: "0h",
  },


];

const DetailRow = ({ label, value }) => (
  <View className="flex-row justify-between mb-2">
    <Text className="text-gray-600">{label}:</Text>
    <Text className="text-gray-800 font-medium">{value}</Text>
  </View>
);

const EmployeeReport = ({ visible, onClose }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleExpand = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} extraHeight={400}>
      
      <ScrollView className="bg-white rounded-t-3xl">
        {/* Profile Section */}
        <Header title={"گزارش حضور"} onClose={onClose} />
        <View className="p-5 items-center">
          <Image
            source={{
              uri: "https://bootdey.com/img/Content/avatar/avatar1.png",
            }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
            }}
          />
          <Text className="text-xl font-bold mt-3">John Doe</Text>
          <Text className="text-sm text-gray-500 mt-1">Software Engineer</Text>
        </View>

        {/* Attendance Summary */}
        <View className="bg-gray-100 mx-5 rounded-2xl p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Today's Summary
          </Text>
          <DetailRow label="Check-In" value="09:05 AM" />
          <DetailRow label="Check-Out" value="05:30 PM" />
          <DetailRow label="Working Hours" value="8h 25m" />
          <DetailRow label="Status" value="Present" />
        </View>

        {/* Scrollable Attendance Cards */}
        <View className="px-5 mt-6 mb-6 space-y-4">
          {attendanceData.map((day, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <TouchableOpacity
                className="flex-row justify-between items-center p-4"
                onPress={() => toggleExpand(index)}
              >
                <Ionicons
                  name={
                    expandedDay === index
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={22}
                  color="gray"
                />
                <View className="flex-col items-end">
                  <Text className="text-gray-800 font-semibold font-sans">
                    {day.date}
                  </Text>
                  <Text className="text-gray-500 text-sm font-sans">
                    {day.workedHours} کار شده
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedDay === index && (
                <View className="bg-gray-50 rounded-xl my-3 mx-4 px-4 py-3 shadow-sm">
                  <DetailRow label="ورود" value={day.checkIn} />
                  <DetailRow label="خروج" value={day.checkOut} />
                  <DetailRow label="ساعات کاری" value={day.workedHours} />
                  <DetailRow label="غیبت" value={day.absentHours} />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default EmployeeReport;
