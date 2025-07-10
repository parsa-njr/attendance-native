import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";

import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import Container from "../../shared/Container";
import moment from "moment-jalaali";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { showMessage } from "react-native-flash-message";
import ApiService from "../../../services/apiService";

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

const statusOptions = ["accepted", "rejected"];

const typeLabels = {
  leave: "مرخصی",
  overtime: "اضافه‌کار",
};

const getStatusProps = (status) => {
  return statusStyles[status?.toLowerCase()] || statusStyles.default;
};

const toJalaliDate = (isoDate) => {
  if (!isoDate) return "";
  return moment(isoDate).format("jYYYY/jMM/jDD");
};

const EditRequest = ({ visible, onClose, requestData, onSuccess }) => {
  const [currentStatus, setCurrentStatus] = useState("default");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusNote, setStatusNote] = useState("");
  const [finalNote, setFinalNote] = useState("");
  const [statusLocked, setStatusLocked] = useState(true);

  const status = getStatusProps(currentStatus);

  // 🛠 Reset state when requestData changes
  useEffect(() => {
    if (requestData) {
      const normalizedStatus = requestData?.status?.toLowerCase() || "default";
      setCurrentStatus(normalizedStatus);
      setSelectedStatus(null);
      setStatusNote("");
      setFinalNote("");
      setStatusLocked(normalizedStatus !== "pending");
    }
  }, [requestData]);

  const handleUpdateRequest = async () => {
    try {
      const data = {
        status: selectedStatus,
        customerNote: finalNote,
      };
      const response = await ApiService.post(
        `/customer/requests/${requestData?.id}`,
        data
      );

      showMessage({
        message: "موفقیت آمیز بود",
        description: response.data.message,
        type: "success",
        icon: "success",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      const message =
        error?.response?.data?.errorDetails || "خطایی رخ داده است";

      showMessage({
        message: "مشکلی پیش آمد",
        description: message,
        type: "danger",
        icon: "danger",
      });
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Container className="px-6 pt-6 pb-12 bg-gray-50 min-h-full rounded-t-3xl">
        <Header classname="mb-6" title="جزئیات درخواست" />

        {/* Request Info */}
        <View className="mb-4 px-6 py-5 rounded-2xl bg-white shadow-md border border-gray-100">
          <Text className="text-xs text-gray-400 mb-4 font-sans text-right">
            جزئیات درخواست
          </Text>

          <View className="mb-4 flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={20}
                color="#6b7280"
              />
              <Text className="text-xs text-gray-500 font-sans text-right">
                نوع درخواست
              </Text>
            </View>
            <Text className="text-base text-gray-900 font-sans font-semibold text-right">
              {typeLabels[requestData?.requestType] || "نامشخص"}
            </Text>
          </View>

          <View className="mb-4 flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              <Text className="text-xs text-gray-500 font-sans text-right">
                تاریخ شروع
              </Text>
            </View>
            <Text className="text-base text-gray-900 font-sans font-semibold text-right">
              {toJalaliDate(requestData?.startDate)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              <Text className="text-xs text-gray-500 font-sans text-right">
                تاریخ پایان
              </Text>
            </View>
            <Text className="text-base text-gray-900 font-sans font-semibold text-right">
              {toJalaliDate(requestData?.endDate)}
            </Text>
          </View>
        </View>

        {/* Status Display */}
        <TouchableOpacity
          disabled={statusLocked}
          onPress={() => setModalVisible(true)}
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
                : "#ca8a04"
            }
          />
          <View>
            <Text className="text-xs text-gray-500 mb-1 font-sans text-right">
              وضعیت درخواست {statusLocked ? "(غیر قابل تغییر)" : "(قابل تغییر)"}
            </Text>
            <Text
              className={`text-lg font-sans font-semibold text-right ${status.textColor}`}
            >
              {status.label}
            </Text>
          </View>
        </TouchableOpacity>

        {finalNote !== "" && (
          <View className="bg-white px-6 py-5 mt-3 rounded-2xl border-l-4 border-gray-400 shadow-md">
            <Text className="text-sm text-gray-700 font-sans font-semibold mb-2 text-right">
              یادداشت وضعیت جدید
            </Text>
            <Text className="text-sm text-gray-700 font-sans leading-7 text-right">
              {finalNote}
            </Text>
          </View>
        )}

        {currentStatus === "rejected" && requestData?.customerNote && (
          <View className="bg-white px-6 py-5 mt-3 rounded-2xl border-l-4 border-red-500 shadow-md">
            <Text className="text-sm text-red-600 font-sans font-semibold mb-2 text-right">
              دلیل رد درخواست
            </Text>
            <Text className="text-sm text-gray-700 font-sans leading-7 text-right">
              {requestData.customerNote}
            </Text>
          </View>
        )}

        {requestData?.userNote && (
          <View className="bg-white px-6 py-5 mt-3 rounded-2xl border-l-4 border-blue-500 shadow-md">
            <Text className="text-sm text-blue-600 font-sans font-semibold mb-2 text-right">
              یادداشت کارمند
            </Text>
            <Text className="text-sm text-gray-700 font-sans leading-7 text-right">
              {requestData.userNote}
            </Text>
          </View>
        )}

        {/* Select Status Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            className="flex-1 justify-center items-center px-6"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <View className="bg-white w-full max-w-md rounded-3xl p-6 shadow-lg">
              <View className="flex-row-reverse justify-between items-center mb-6">
                <Text className="text-gray-900 text-2xl font-extrabold font-sans">
                  تغییر وضعیت
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="p-1"
                >
                  <Ionicons name="close" size={28} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={statusOptions}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                className="max-h-[280px]"
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => {
                  const s = getStatusProps(item);
                  return (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        setSelectedStatus(item);
                        setModalVisible(false);
                        setConfirmVisible(true);
                      }}
                      className={`${s.bgColor} border border-gray-200 rounded-2xl py-4 px-5 mb-4 flex-row-reverse justify-between items-center shadow-md`}
                    >
                      <View className="flex-row-reverse items-center space-x-reverse space-x-4">
                        <Ionicons
                          name={s.icon}
                          size={26}
                          color={
                            s.textColor === "text-green-600"
                              ? "#16a34a"
                              : s.textColor === "text-red-600"
                              ? "#dc2626"
                              : "#4b5563"
                          }
                        />
                        <Text
                          className={`${s.textColor} font-semibold text-lg font-sans`}
                        >
                          {s.label}
                        </Text>
                      </View>
                      <Ionicons name="chevron-back" size={24} color="#9ca3af" />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          visible={confirmVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmVisible(false)}
        >
          <View
            className="flex-1 justify-center items-center px-6"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <View
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-lg"
              style={{ direction: "rtl" }}
            >
              <TouchableOpacity
                onPress={() => setConfirmVisible(false)}
                className="p-1"
              >
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>

              <Text className="text-gray-900 text-lg font-extrabold font-sans mb-2 ">
                آیا از تغییر وضعیت اطمینان دارید؟
              </Text>

              <Text className="text-gray-500 text-sm font-sans mb-2">
                (می‌توانید یادداشتی اضافه کنید)
              </Text>

              <TextInput
                multiline
                textAlignVertical="top"
                value={statusNote}
                onChangeText={setStatusNote}
                placeholder="یادداشت وضعیت"
                className="border border-gray-300 rounded-2xl px-4 py-3 text-right font-sans text-sm text-gray-900"
                style={{ minHeight: 100 }}
              />

              <View className="flex-row justify-start mt-6 space-x-4 space-x-reverse">
                <TouchableOpacity
                  className="bg-gray-100 px-5 py-3 rounded-2xl "
                  onPress={() => {
                    setConfirmVisible(false);
                    setSelectedStatus(null);
                    setStatusNote("");
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 font-sans text-base">لغو</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-100 px-5 py-3  rounded-2xl"
                 onPress={async () => {
  setCurrentStatus(selectedStatus);
  setFinalNote(statusNote);
  setStatusLocked(true);
  setConfirmVisible(false);
  setStatusNote("");
  setSelectedStatus(null);

  await handleUpdateRequest();
  onClose(); // 👈 This closes the entire EditRequest modal
}}
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 font-sans text-base">
                    تأیید
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    </BottomSheet>
  );
};

export default EditRequest;
