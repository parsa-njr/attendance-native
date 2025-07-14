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
import ApiService from "@/services/apiService";
import SelectInput from "../../../../components/shared/inputs/SelectInput";
import moment from "moment-jalaali";
import CardComponent from "../../../../components/shared/CardComponent";
import Wraper from "../../../../components/shared/Wraper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const currentJalaliYear = moment().jYear();
  const years = Array.from({ length: 20 }, (_, i) => {
    const year = currentJalaliYear - i;
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
  const [finalReport, setFinalReport] = useState([]);

  const toJalaliDate = (isoDate) => {
    if (!isoDate) return "";
    return moment(isoDate).format("jYYYY/jMM/jDD");
  };

  const toggleExpand = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const getReport = async () => {
    try {
      setRefreshing(true);
      const response = await ApiService.get(
        `/user/reports?month=${selectedMonth}&year=${selectedYear}`
      );
      setFinalReport(response?.data?.finalReport);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const onRefresh = () =>
    new Promise(() => {
      setRefreshing(true);
      getReport();
    });

  useFocusEffect(
    useCallback(() => {
      const loadStoredFilters = async () => {
        try {
          const storedMonth = await AsyncStorage.getItem("selectedMonth");
          const storedYear = await AsyncStorage.getItem("selectedYear");

          if (storedMonth) setSelectedMonth(storedMonth);
          if (storedYear) setSelectedYear(storedYear);
        } catch (error) {
          console.error("Error loading saved filters:", error);
        }
      };

      setRefreshing(true);
      loadStoredFilters().finally(() => {
       getReport()
      });
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
    <Wraper className="flex-1 bg-gray-50 relative">
      <Loading onRefresh={onRefresh}>
        {() => (
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
                    onChange={(val) => {
                      setSelectedMonth(val);
                      AsyncStorage.setItem("selectedMonth", val);
                    }}
                    placeholder="ماه"
                  />
                </View>
                <View className="flex-1">
                  <SelectInput
                    options={years}
                    value={selectedYear}
                    onChange={(val) => {
                      setSelectedYear(val);
                      AsyncStorage.setItem("selectedYear", val);
                    }}
                    placeholder="سال"
                  />
                </View>
              </View>

              <View className="mx-6 mt-6">
                <TouchableOpacity
                  onPress={getReport}
                  className="bg-blue-600 rounded-xl py-3 items-center shadow-md"
                >
                  <Text className="text-white text-base font-semibold font-sans">
                    مشاهده
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="px-5 mt-10 space-y-4">
                {finalReport.map((day, index) => (
                  <CardComponent key={index} className="mb-3">
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
                          {toJalaliDate(day?.date)}
                        </Text>
                        <Text className="text-gray-500 text-sm font-sans">
                          {day.workedHours} کار شده
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {expandedDay === index && (
                      <View className="bg-gray-50 rounded-xl my-3 mx-4 px-4 py-3 shadow-sm">
                        <DetailRow label="ورود" value={day.actualCheckIn} />
                        <DetailRow label="خروج" value={day.actualCheckOut} />
                        <DetailRow
                          label="ساعات کاری"
                          value={day.actualMinutes}
                        />
                        <DetailRow label="غیبت" value={day.leaveMinutes} />
                      </View>
                    )}
                  </CardComponent>
                ))}
              </View>
            </>
          </ScrollView>
        )}
      </Loading>
    </Wraper>
  );
};

export default Index;
