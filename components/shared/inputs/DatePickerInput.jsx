import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

const DatePickerInput = ({
  inputKey,
  label,
  placeholder,
  inputClassName = "",
  value,
  onChange,
  type = "calendar", // "calendar" or "time"
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState(Date.now());
  const [tempDate, setTempDate] = useState(value || "");

  const handleOpenModal = () => {
    setDatePickerKey(Date.now());
    setModalOpen(true);
    setTempDate(value || "");
  };

  const confirmDate = () => {
    onChange(tempDate);
    setModalOpen(false);
  };

  const handleDateChange = (date) => {
    if (type === "calendar") {
      setTempDate(date); // Don't close yet
    } else {
      onChange(date);
      setModalOpen(false);
    }
  };

  return (
    <View className={`mb-6 ${inputClassName}`}>
      {label && (
        <Text className="mb-2 text-sm text-right text-gray-500 font-sans px-4">
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleOpenModal}
        className="rounded-xl px-4 py-3 text-base text-right font-sans bg-white border border-gray-200"
      >
        <Text className="text-base text-gray-600 text-right font-sans">
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              className="absolute top-2 left-3 z-10"
              onPress={() => setModalOpen(false)}
            >
              <Text className="text-2xl text-gray-400">✕</Text>
            </TouchableOpacity>

            <DatePicker
              key={`${inputKey}_picker_${datePickerKey}`}
              isGregorian={false}
              mode={type}
              minuteInterval={5}
              selectorStartingYear={1380}
              minimumDate="1300/01/01"
              selected={getFormatedDate(new Date(), "jYYYY/jMM/jDD")}
              onDateChange={handleDateChange}
              onTimeChange={handleDateChange}
              onSelectedChange={() => {}} // to avoid warning
              onMonthYearChange={() => {}}
              options={{
                textHeaderColor: "#000",
                textDefaultColor: "#000",
                selectedTextColor: "#fff",
                mainColor: "#467FD0",
                textSecondaryColor: "#000",
                borderColor: "rgba(0,0,0,0.1)",
              }}
              style={{ borderRadius: 10 }}
            />

            {/* ✅ Show انتخاب button ONLY for date mode */}
            {type === "calendar" && (
              <TouchableOpacity
                onPress={confirmDate}
                style={{
                  marginTop: 20,
                  backgroundColor: "#467FD0",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
                >
                  انتخاب
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    height: Platform.OS === "ios" ? "50%" : 450,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default DatePickerInput;
