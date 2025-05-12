import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ReportsSkeleton from "../../../../components/loading/Skeleton/Employee/Reports/ReportsSkeleton";
import Loading from "../../../../components/loading/Loading";
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
    return { label: year.toString(), value: year.toString() };
  });

  const months = [
    { label: "فروردین", value: "01" },
    { label: "اردیبهشت", value: "02" },
    { label: "خرداد", value: "03" },
    { label: "تیر", value: "04" },
    { label: "مرداد", value: "05" },
    { label: "شهریور", value: "06" },
    { label: "مهر", value: "07" },
    { label: "آبان", value: "08" },
    { label: "آذر", value: "09" },
    { label: "دی", value: "10" },
    { label: "بهمن", value: "11" },
    { label: "اسفند", value: "12" },
  ];

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const DetailRow = ({ label, value }) => (
    <View className="flex-row justify-between items-center border-b border-gray-200 py-2">
      <Text className="text-sm text-gray-800 font-medium font-sans">
        {value}
      </Text>
      <Text className="text-sm text-gray-500 font-sans">{label}:</Text>
    </View>
  );
  if (refreshing) {
    return <ReportsSkeleton />;
  }
  return (
    <Loading onRefresh={onRefresh}>
      {() => (
        <SafeAreaView className="flex-1 bg-gray-50">
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <>
              <Text className="text-lg mt-20 mx-6 text-gray-700 font-sans text-center">
                بازه‌ی مورد نظر خود را انتخاب کنید
              </Text>

              <View className="flex-row gap-4 justify-between mx-6 mt-6">
                <View className="flex-1">
                  <SelectInput
                    options={months}
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    placeholder="ماه"
                  />
                </View>
                <View className="flex-1">
                  <SelectInput
                    options={years}
                    value={selectedYear}
                    onChange={setSelectedYear}
                    placeholder="سال"
                  />
                </View>
              </View>

              <View className="mx-6 mt-6">
                <TouchableOpacity className="bg-blue-600 rounded-xl py-3 items-center shadow-md">
                  <Text className="text-white text-base font-semibold font-sans">
                    مشاهده
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="px-5 mt-10 space-y-4">
                {attendanceData.map((day, index) => (
                  <View
                    key={index}
                    className="bg-white rounded-2xl shadow-lg mb-3"
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
                        size={24}
                        color="gray"
                      />
                      <View className="flex-col items-end">
                        <Text className="text-gray-800 font-semibold font-sans">
                          1404/05/23
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
            </>
          </ScrollView>
        </SafeAreaView>
      )}
    </Loading>
  );
};

export default Index;
