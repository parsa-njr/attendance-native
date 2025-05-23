import React, { useState } from "react";
import BottomSheet from "../../shared/BottomSheet";
import { Text, TouchableOpacity, View } from "react-native";
import TextFeild from "../../shared/inputs/TextFeild";
import SelectInput from "../../shared/inputs/SelectInput";
import DatePicker from "react-native-jalali-persian-date-picker";
import DatePickerInput from "../../shared/inputs/DatePickerInput";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import Container from "../../shared/Container";
// import PersianDatePicker from "react-native-persian-date-picker2";

const RequestForm = ({ open, onClose }) => {
  const [requestType, setRequestType] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [description, setDescription] = useState("");
  const [typeOption, setTypeOption] = useState([
    { label: "مرخصی", vale: "leave" },
    { label: "دورکاری", vale: "remote" },
    { label: "اضافه کاری", vale: "overtime" },
    { label: "ماموریت", vale: "mission" },
  ]);
  return (
    <>
      <BottomSheet key="request_modal" visible={open} onClose={onClose}>
        <Container>

       
        <Header classname="mb-4"  title="افزودن درخواست جدید" />
      
        <View className="h-24 ">
          <SelectInput
            inputKey={`request_type`}
            value={requestType}
            onChange={(val) => setRequestType(val)}
            options={typeOption}
            key={requestType}
            className="h-12  mx-10"
            placeholder="نوع درخواست"
          />
        </View>
        <View className="h-24 flex flex-row justify-between mx-10 mt-5">
          <DatePickerInput
            inputKey="startTime"
            type="time"
            label="ساعت شروع"
            inputClassName="h-10 w-[48%]"
            value={startTime}
            onChange={(val) => {
              setStartTime(val);
            }}
          />
          <DatePickerInput
            inputKey="startDate"
            label="تاریخ شروع"
            inputClassName="h-10 w-[48%]"
            value={startDate}
            type="calender"
            onChange={(val) => {
              setStartDate(val);
            }}
          />
        </View>
        <View className="h-24 flex flex-row justify-between mx-10 mt-5">
          <DatePickerInput
            inputKey="endTime"
            type="time"
            label="ساعت پایان "
            inputClassName="h-10 w-[48%]"
            value={endTime}
            onChange={(val) => {
              setEndTime(val);
            }}
          />
          <DatePickerInput
            inputKey="endDate"
            label="تاریخ پایان"
            inputClassName="h-10 w-[48%]"
            value={endDate}
            type="calender"
            onChange={(val) => {
              setEndDate(val);
            }}
          />
        </View>

        <View className="h-24 mx-10 mt-5">
          <TextFeild
            value={description}
            onChangeText={(val) => {
              setDescription(val);
            }}
            placeholder="دلیل درخواست"
            className="h-32 w-full "
          />
        </View>
        <SubmitButton className="mx-10  mt-4"  title="ثبت درخواست" onPress={() => {}} />
        </Container>
      </BottomSheet>
    </>
  );
};

export default RequestForm;
