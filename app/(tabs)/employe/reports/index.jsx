import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SelectInput from "../../../../components/shared/inputs/SelectInput";

const Index = () => {
  const currentYear = 2000;

  const years = Array.from({ length: 20 }, (_, i) => {
    const year = currentYear - i;
    return {
      label: year.toString(),
      value: year.toString(), // You can keep value as string or number
    };
  });
  const months = [
    { label: "فروردین", value: "01" },
    { label: "اردیبهشت", value: "02" },
    { label: "خرداد", value: "03" },
    { label: "تیر", value: "04" },
    { label: "مرداد", value: "05" },
    { label: "مرداد", value: "05" },
    { label: "مرداد", value: "05" },
    { label: "مرداد", value: "05" },
    { label: "مرداد", value: "05" },
    { label: "مرداد", value: "05" },
    { label: "مرداد", value: "05" },
  ];
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

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
  const DetailRow = ({ label, value }) => (
    <View className="flex-row justify-between mb-1 border-b-[1px] border-gray-200 py-2">
      <Text className="text-sm text-gray-800 font-medium font-sans">
        {value}
      </Text>
      <Text className="text-sm text-gray-500 font-sans">{label}:</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-10">
      <ScrollView  contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="text-lg  text-right mt-8 mx-10 text-gray-600 tracking-tight leading-relaxed">
          بازه‌ی مورد نظر خود را انتخاب کنید
        </Text>

        <View className="flex flex-row gap-2 justify-between mx-10 mt-10">
          <SelectInput
            options={months}
            value={selectedMonth}
            onChange={setSelectedMonth}
            placeholder="ماه"
            className="w-1/2 bg-white"
          />
          <SelectInput
            options={years}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="سال"
            className="w-1/2 bg-white"
          />
        </View>

        <View className="flex-row justify-center gap-4 mt-8">
          {/* Save Button */}
          <TouchableOpacity
            // onPress={handleSave}
            className="flex-1 bg-blue-500 rounded-lg py-2 items-center mx-8 shadow-md"
          >
            <Text className="text-white text-base font-semibold font-sans">
              مشاهده
            </Text>
          </TouchableOpacity>
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
                  name={
                    expandedDay === index
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={24}
                  color="gray"
                />
                <View>
                  <Text className="text-gray-800 font-semibold font-sans">
                    1404/05/23
                  </Text>
                  <Text className="text-gray-500 text-sm text-right font-sans">
                    {day.workedHours} کار شده
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedDay === index && (
                <View className="bg-gray-50 rounded-xl my-3 mx-5 px-4 py-3 shadow-sm">
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
    </SafeAreaView>
  );
};

export default Index;
