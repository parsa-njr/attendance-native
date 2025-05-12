import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import TextFeild from "./TextFeild";

const DatePickerInput = ({
  inputKey,
  label,
  inputClassName,
  value,
  onChange,
  type
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState(Date.now());

  const handleOpenModal = () => {
    setDatePickerKey(Date.now());
    setModalOpen(true);
  };

  return (
    <>
      <TouchableOpacity
        key={`${inputKey}_handler_${datePickerKey}`}
        onPress={handleOpenModal}
        className={`border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-right text-[#6b7280] font-sans  ${inputClassName}`}
      >
        <Text
          style={{
            color: "#6b7280",
          }}
          className="text-right text-[#6b7280]   font-sans"
        >
          {value || label}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
        // key={`${inputKey}_picker_${datePickerKey}`}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              className=" w-5 h-5 p-10 my-10 mx-24 "
              onPress={() => setModalOpen(false)}
            >
              <Text className="text-2xl text-gray-500">✕</Text>
            </TouchableOpacity>
            <DatePicker
              key={`${inputKey}_picker_${datePickerKey}`}
              isGregorian={false}
              minuteInterval={5}
              minimumDate="1300/01/01" // Persian calendar support
              selectorStartingYear={1380}
              mode={type || "calendar"}
              selected={getFormatedDate(new Date(), "jYYYY/jMM/jDD")}
              onDateChange={(date) => {
                onChange(date);
                setModalOpen(false);
              }}
              options={{
                textHeaderColor: "#000",
                textDefaultColor: "#000",
                selectedTextColor: "#fff",
                mainColor: "#467FD0",
                textSecondaryColor: "#000",
                borderColor: "rgba(0,0,0,0.1)",
              }}
              style={{ borderRadius: 10 }}
              onMonthYearChange={(date) => {
                onChange(date);
              }}
              onSelectedChange={(date) => {
                onChange(date);
              }}
              onTimeChange={(date) => {
                onChange(date);
                setModalOpen(false);

              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    height: "50%",
    minHeight: 400,
    maxWidth: 400,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default DatePickerInput;
