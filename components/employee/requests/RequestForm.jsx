import React, { useState } from "react";
import BottomSheet from "../../shared/BottomSheet";
import { Text, TouchableOpacity, View } from "react-native";
import TextFeild from "../../shared/inputs/TextFeild";
import SelectInput from "../../shared/inputs/SelectInput";
import DatePicker from "react-native-jalali-persian-date-picker";
// import PersianDatePicker from "react-native-persian-date-picker2";

const RequestForm = ({ open, onClose }) => {
  const [requestType, setRequestType] = useState("");
  const [value, setValue] = useState();
  const [typeOption, setTypeOption] = useState([
    { label: "مرخصی", vale: "leave" },
    { label: "دورکاری", vale: "remote" },
    { label: "اضافه کاری", vale: "overtime" },
    { label: "ماموریت", vale: "mission" },
  ]);
  return (
    <>
      <BottomSheet visible={open} onClose={onClose}>
        <View className="h-24 ">
          <SelectInput
            value={requestType}
            onChange={(val) => setRequestType(val)}
            options={typeOption}
            key={requestType}
            className="h-12 mt-10 mx-10"
            placeholder="نوع درخواست"
          />
        </View>
        <View className="h-24 flex flex-row justify-between mx-10 mt-5">
          <TextFeild
            value=""
            onChangeText={() => {}}
            placeholder="تاریخ شروع"
            className="h-12 w-[48%]" 
          />

<DatePicker value={value} onChange={(date) => setValue(date)} />
          {/* <PersianDatePicker
        visible
        onConfirm={(value)=>{console.log(value)}}
        defaultValue={[1370,7,5]}
        startYear={1330}
        endYear={1400}
        containerStyle={{}}
        pickercontainerStyle={{}}
        pickerWrapperStyle={{}}
        pickerItemStyle={{}}
        submitTextStyle={{}}
      /> */}
          <TextFeild
            value=""
            onChangeText={() => {}}
            placeholder="تاریخ پایان"
            className="h-12 w-[48%]"
          />
        </View>

        <View className="h-24 mx-10 mt-5">
          <TextFeild
            value=""
            onChangeText={() => {}}
            placeholder="دلیل درخواست"
            className="h-32 w-full "
          />
        </View>

        <View className="flex-row justify-center gap-4 mt-8">
          {/* Save Button */}
          <TouchableOpacity
            // onPress={handleSave}
            className="flex-1 bg-blue-500 rounded-lg py-2 items-center mx-8 shadow-md"
          >
            <Text className="text-white text-base font-semibold font-sans">
              ثبت درخواست
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
};

export default RequestForm;
