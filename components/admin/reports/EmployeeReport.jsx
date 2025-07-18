import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import BottomSheet from "../../shared/BottomSheet";
import Ionicons from "@expo/vector-icons/Ionicons"; // or use from 'react-native-vector-icons/Ionicons'
import Header from "../../../components/shared/Header";
import { convertToJalali } from "../../../utils/dateFunctions";
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
    <View className="flex-row justify-between items-center border-b border-gray-200 py-2">
      <Text className="text-sm text-gray-800 font-medium font-sans">
        {value}
      </Text>
      <Text className="text-sm text-gray-500 font-sans">{label}:</Text>
    </View>
  );

const EmployeeReport = ({ visible, onClose, data,userData }) => {
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
        
          {userData?.image ? (
            <Image
              source={{ uri: userData.image }}
               style={{
              width: 96,
              height: 96,
              borderRadius: 48,
            }}
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
                
              width: 96,
              height: 96,
              borderRadius: 48,
          
              }}
            >
              <Ionicons name="person-outline" size={32} color="#9CA3AF" />
            </View>
          )}
          {/* <Text className="text-xl font-bold mt-3">{userData?.name}</Text> */}
          <Text className="text-xl text-gray-500 mt-1 font-sans">{userData?.name}</Text>
        </View>

        {/* Attendance Summary */}
        <View className="bg-gray-100 mx-5 rounded-2xl p-4">
          <Text className="text-lg font-sans text-center  font-semibold text-gray-800 mb-2">
            مجموع تردد ها
          </Text>
          <DetailRow
            label="مجموع ساعات حضور"
            value={data?.totalReport?.totalActualTime}
          />
          <DetailRow
            label="مجموع تاخیر "
            value={data?.totalReport?.totalDelay}
          />
          <DetailRow
            label="مجموع مرخصی "
            value={data?.totalReport?.totalLeaveTime}
          />
        </View>

        {/* Scrollable Attendance Cards */}
        <View className="px-5 mt-6 mb-6 space-y-4">
          {data?.finalReport.map((day, index) => (
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
                    {convertToJalali(day.date)}
                  </Text>
                  <Text className="text-gray-500 text-sm font-sans">
                    {day.actualMinutes} کار شده
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedDay === index && (
                <View className="bg-gray-50 rounded-xl my-3 mx-4 px-4 py-3 shadow-sm">
                  <DetailRow label="ورود" value={day.actualCheckIn} />
                  <DetailRow label="خروج" value={day.actualCheckOut} />
                  <DetailRow label="ساعات کاری" value={day.actualMinutes} />
                  <DetailRow label="تاخیر" value={day.delayMinutes} />
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
