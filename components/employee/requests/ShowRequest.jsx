import React from "react";
import { Text, View } from "react-native";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import Container from "../../shared/Container";
import moment from "moment-jalaali";
import Ionicons from "react-native-vector-icons/Ionicons";

const statusStyles = {
  accepted: {
    label: "پذیرفته شده",
    textColor: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    icon: "checkmark-circle",
  },
  rejected: {
    label: "رد شده",
    textColor: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    icon: "close-circle",
  },
  pending: {
    label: "در حال بررسی",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    icon: "time",
  },
  default: {
    label: "نامشخص",
    textColor: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    icon: "help-circle",
  },
};

const typeLabels = {
  leave: "مرخصی",
  overtime: "اضافه‌کار",
};

const getStatusProps = (status) => {
  return statusStyles[status?.toLowerCase()] || statusStyles.default;
};

const InfoCard = ({ label, value }) => (
  <View className="mb-4 px-6 py-4 rounded-2xl bg-white shadow-md border border-gray-200">
    <Text className="text-xs text-gray-400 mb-1 font-sans text-right">
      {label}
    </Text>
    <Text className="text-base text-gray-900 font-sans font-semibold text-right">
      {value}
    </Text>
  </View>
);

const ShowRequest = ({ visible, onClose, requestData }) => {
  const toJalaliDate = (isoDate) => {
    if (!isoDate) return "";
    return moment(isoDate).format("jYYYY/jMM/jDD");
  };

  const status = getStatusProps(requestData?.status);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Container className="px-6 pt-6 pb-12 bg-gray-50 min-h-full rounded-t-3xl">
        <Header classname="mb-6" title="جزئیات درخواست" />

        <InfoCard
          label="نوع درخواست"
          value={typeLabels[requestData?.type] || "نامشخص"}
        />
        <InfoCard
          label="تاریخ درخواست"
          value={toJalaliDate(requestData?.date)}
        />

        {/* Clean Status Card */}
        <View
          className={`mb-4 px-6 py-5 rounded-3xl shadow-md flex-row justify-between items-center ${status.bgColor} border border-gray-200`}
        >
          <Ionicons
            name={status.icon}
            size={36}
            color={
              status.textColor === "text-green-600"
                ? "#16a34a"
                : status.textColor === "text-red-600"
                ? "#dc2626"
                : status.textColor === "text-yellow-600"
                ? "#ca8a04"
                : "#4b5563"
            }
          />
          <View>
            <Text className="text-xs text-gray-500 mb-1 font-sans text-right">
              وضعیت درخواست
            </Text>
            <Text
              className={`text-lg font-sans text-right font-semibold ${status.textColor}`}
            >
              {status.label}
            </Text>
          </View>
        </View>

        {/* Rejection Reason */}
        {requestData?.status.toLowerCase() === "rejected" &&
          requestData?.note && (
            <View className="bg-white px-6 py-5 mt-3 rounded-2xl border-l-4 border-red-500 shadow-md">
              <Text className="text-sm text-red-600 font-sans font-semibold mb-2 text-right">
                دلیل رد درخواست
              </Text>
              <Text className="text-sm text-gray-700 font-sans leading-7 text-right">
                {requestData.note}
              </Text>
            </View>
          )}
      </Container>
    </BottomSheet>
  );
};

export default ShowRequest;
