import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
// import { ChevronDown } from "lucide-react-native";

// import PersianDatePicker from "react-native-persian-date-picker2";

const Index = () => {
  const currentYear = 2000;

  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "year" or "month"

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelect = (value) => {
    if (modalType === "year") setSelectedYear(value);
    else setSelectedMonth(value);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <Pressable
      className="py-3 px-5 border-b border-gray-100"
      onPress={() => handleSelect(item)}
    >
      <Text className="text-lg text-center">{item}</Text>
    </Pressable>
  );

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
      <Text className="text-sm text-gray-800 font-medium">{value}</Text>
      <Text className="text-sm text-gray-500">{label}:</Text>
    </View>
  );
  

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-10 ">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

      <Text className="text-lg text-right mt-8 mx-5 text-gray-600 tracking-tight leading-relaxed">
  بازه‌ی مورد نظر خود را انتخاب کنید
</Text>

        {/* Date Range Picker */}
        <View className="flex flex-row gap-2 justify-between mx-10 mt-10">
          {/* Year Select */}
          <TouchableOpacity
            className="bg-white px-4 py-2 rounded-lg shadow-md w-1/2  flex-row items-center justify-between"
            onPress={() => openModal("year")}
          >
            <Ionicons name="chevron-down-outline" size={20} color="gray" />
            {/* <View className="flex-col"> */}
              {/* <Text className=" text-right text-lg text-gray-500 mb-1">
                سال
              </Text> */}
              <Text className="text-lg text-gray-500">
                {selectedYear || "سال"}
              </Text>
            {/* </View> */}
          </TouchableOpacity>

          {/* Month Select */}
          <TouchableOpacity
            className="bg-white px-4  py-2 rounded-lg shadow-md w-1/2 flex-row items-center justify-between"
            onPress={() => openModal("month")}
          >
            <Ionicons name="chevron-down-outline" size={20} color="gray" />
            {/* <View className="flex-col"> */}
             
              <Text className="text-base text-gray-500">
                {selectedMonth || "ماه"}
              </Text>
            {/* </View> */}
          </TouchableOpacity>
        </View>

        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View className="bg-white rounded-t-3xl p-4 max-h-[60%]">
            <Text className="text-center text-lg font-semibold mb-4">
              {modalType === "year" ? "انتخاب سال" : "انتخاب ماه"}
            </Text>
            <FlatList
              data={modalType === "year" ? years : months}
              keyExtractor={(item, index) => String(item) + index}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Modal>

        <View className="flex-row justify-center gap-4 mt-8">
          {/* Save Button */}
          <TouchableOpacity
            // onPress={handleSave}
            className="flex-1 bg-blue-500 rounded-lg py-2 items-center mx-8 shadow-md"
          >
            <Text className="text-white text-base font-semibold">مشاهده</Text>
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
                  <Text className="text-gray-800 font-semibold">
                    1404/05/23
                  </Text>
                  <Text className="text-gray-500 text-sm text-right">
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
