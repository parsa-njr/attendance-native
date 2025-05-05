import { useState } from "react";
import CheckInModal from "../../../../components/modals/CheckInModal";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

const EmployeeDashboard = () => {
  const [checkInModal, setCheckInModal] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile & Greeting */}
        <View className="px-5 pt-5">
          <View className="bg-white rounded-2xl p-5 flex-row-reverse items-center shadow-sm mt-9">
            <View className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden ml-4">
              <Image
                source={{ uri: "https://i.pravatar.cc/300?img=5" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg  text-gray-800 text-right fonst-sans">
                صبح بخیر سارا
              </Text>
              <Text className="text-sm text-gray-500 mt-1 text-right font-sans">
                {todayDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Status & Actions */}
        <View className="px-5 mt-8 items-center">
          <View className="bg-white rounded-2xl p-5 items-center shadow-sm w-full">
            <Text className="text-lg text-gray-800 mb-4 text-right font-sans">
              {isCheckedIn ? "حاضری زدید" : "شما حاضری نزدید"}
            </Text>

            <TouchableOpacity
              onPress={() => {
                if (isCheckedIn) {
                  handleCheckOut();
                  setCheckOutModal(true);
                } else {
                  setCheckInModal(true);
                  handleCheckIn();
                }
              }}
              className={`w-32 h-32 ${
                isCheckedIn ? "bg-red-500" : "bg-green-500"
              } rounded-full justify-center items-center shadow-md`}
            >
              <Text className="text-white text-lg font-sans">
                {isCheckedIn ? "خروج" : "ورود"}
              </Text>
            </TouchableOpacity>

            {isCheckedIn && (
              <Text className="text-gray-500 mt-4 text-sm text-right font-sans">
              ورود ثبت شده در {checkInTime}
            </Text>
            )}
          </View>
        </View>

        {/* Motivational Quote */}
        <View className="px-5 mt-8">
          <View className="bg-white p-5 rounded-2xl shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2 text-right font-sans">
              انگیزه روزانه 💬
            </Text>
            <Text className="text-gray-600 text-right font-sans">
              موفقیت مجموع تلاش‌های کوچک است که هر روز تکرار می‌شود.
            </Text>
          </View>
        </View>

        {/* Attendance Summary */}
        <View className="px-5 mt-8">
          <Text className="text-xl  text-gray-800 mb-4 text-right font-sans">
            خلاصه فعالیت
          </Text>
          <View className="flex-row-reverse justify-between">
            <SummaryCard
              label="روز های حاضر"
              value={20}
              color="text-green-500"
            />
            <SummaryCard label="روز های غایب" value={2} color="text-red-500" />
            <SummaryCard
              label="روز های با تاخیر"
              value={1}
              color="text-amber-500"
            />
          </View>
        </View>
      </ScrollView>
      <CheckInModal
        visible={checkInModal}
        onClose={() => setCheckInModal(false)}
      />
    </SafeAreaView>
  );
};

const SummaryCard = ({ label, value, color }) => {
  return (
    <View className="w-[30%] bg-white p-4 rounded-2xl shadow-sm items-center">
      <Text className={`text-2xl font-bold ${color} font-sans`}>{value}</Text>
      <Text className="text-gray-600 text-xs mt-2 text-center font-sans">
        {label}
      </Text>
    </View>
  );
};

export default EmployeeDashboard;
