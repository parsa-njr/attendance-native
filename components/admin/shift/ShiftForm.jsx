import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";
import DatePickerInput from "../../shared/inputs/DatePickerInput";
import SeparatorWithTitle from "../../shared/SeparatorWithTitle";
import { AntDesign } from "@expo/vector-icons";

const ShiftForm = ({ visible, onClose }) => {
  const handleGenerateShiftDays = (count) => {
    const newShiftDays = Array.from({ length: count }, (_, index) => ({
      day: index + 1,
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    }));

    setFormData((prev) => ({
      ...prev,
      shiftDays: newShiftDays,
    }));
  };
  const handleGenerateExeptionDays = () => {
    setFormData((prev) => {
      const newDay = {
        day: (prev.exceptionDays?.length || 0) + 1,
        date: "",
        time: [
          {
            startTime: "",
            endTime: "",
          },
        ],
      };

      return {
        ...prev,
        exceptionDays: [...(prev.exceptionDays || []), newDay],
      };
    });
  };

  const [period, setPeriod] = useState(0);
  const [formData, setFormData] = useState({
    shiftName: "",
    startDate: "", // Fixed typo here too (was: startData)
    endDate: "",
    formalHolidays: false,
    shiftDays: [],
    exceptionDays: [], // Fixed typo here too (was: exeptionDays)
  });

  const handleDeleteExceptionDay = (indexToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      exceptionDays: prevData.exceptionDays.filter(
        (_, idx) => idx !== indexToDelete
      ),
    }));
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} extraHeight={450}>
      <Container>
        <Header classname="mb-4" title="تعریف شیفت" />

        {/* Name input */}
        <View className="h-24 flex flex-row justify-between mx-10 mb-5"></View>
        <TextFeild
          value={formData?.shiftName}
          onChangeText={(val) =>
            setFormData((prev) => ({ ...prev, shiftName: val }))
          }
          placeholder="عنوان شیفت"
          className="mb-4"
        />
        <TextFeild
          value={period}
          onChangeText={(value) => {
            setPeriod(value);
          }}
          placeholder="دوره شیفت (تعداد روز هر شیفت)"
          className="mb-4"
          keyboardType="numeric"
        />
        <View className="h-24 flex flex-row justify-between mx-10 mb-5">
          <DatePickerInput
            inputKey="endDate"
            label="تاریخ پایان شیفت"
            inputClassName=" w-[48%]"
            value={formData?.endDate}
            type="calender"
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, endDate: val }));
            }}
          />
          <DatePickerInput
            inputKey="startDate"
            label="تاریخ شروع شیفت"
            inputClassName=" w-[48%]"
            value={formData?.startDate}
            type="calender"
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, startDate: val }));
            }}
          />
        </View>

        {/* Range input */}
        {/* <TextFeild
          value={range}
          onChangeText={(value) => {
            // Only allow numbers and prevent negative values
            if (/^\d*$/.test(value)) {
              setRange(value);
            }
          }}
          placeholder="فاصله (متر)"
          className="mb-4"
          keyboardType="numeric"
        /> */}
        <View
          className="flex items-center justify-start text-right mt-4"
          style={{
            flexDirection: "row",
            alignItems: "center",
            direction: "rtl",
            color: "#6b7280",
          }}
        >
          <Checkbox
            color="#3b82f6"
            status={formData?.formalHolidays ? "checked" : "unchecked"}
            onPress={() => {
              const newValue = !formData?.formalHolidays;
              // setChecked(newValue);
              console.log("New checkbox value:", newValue);
              setFormData((prev) => ({ ...prev, formalHolidays: newValue }));
              // You can use `newValue` here however you want
            }}
          />
          <Text className="font-sans text-[#6b7280]">
            تبعیت از تعطیلات رسمی
          </Text>
        </View>
        <SubmitButton
          title="ساخت شبفت"
          className="mt-4"
          onPress={() => {
            handleGenerateShiftDays(period);
          }}
        />
        {formData.shiftDays?.length > 0 && (
          <>
            <SeparatorWithTitle
              type="center"
              title="روز های شیفت"
              className="mt-10"
            />
          </>
        )}

        {formData.shiftDays.map((item, index) => (
          <>
            <SeparatorWithTitle title={`روز ${item?.day}`} className="mt-10" />
            <View className="h-24 flex flex-row justify-between mx-10 mb-5">
              <DatePickerInput
                inputKey={`start_time_${index + 2}`}
                type="time"
                label="ساعت ورود"
                inputClassName="h-10 w-[48%]"
                value={""}
                onChange={(val) => {
                  // setStartTime(val);
                }}
              />
              <DatePickerInput
                inputKey={`end_time_${index + 2}`}
                type="time"
                label="ساعت خروج"
                inputClassName="h-10 w-[48%]"
                value={""}
                onChange={(val) => {
                  // setStartTime(val);
                }}
              />
            </View>
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox status="checked" onPress={() => {}} />
              <Text>Subscribe</Text>
            </View> */}
          </>
        ))}
        {formData.shiftDays?.length > 0 && (
          <>
            <SeparatorWithTitle
              type="center"
              title="روز های استثنا"
              className="mt-10"
            />
          </>
        )}
        {formData.exceptionDays.map((item, index) => (
          <>
            <SeparatorWithTitle title={`روز ${item?.day}`} className="mt-10" />
            <View className="h-24 flex flex-row justify-between mx-10 flex-wrap">
              <DatePickerInput
                inputKey={`start_time_${index + 2}`}
                type="time"
                label="ساعت ورود"
                inputClassName="h-10 w-[48%]"
                value={""}
                onChange={(val) => {
                  // setStartTime(val);
                }}
              />
              <DatePickerInput
                inputKey="item.date"
                label="تاریخ روز استثنا "
                inputClassName=" w-[48%]"
                // value={formData?.endDate}
                type="calender"
                onChange={(val) => {
                  // setFormData((prev) => ({ ...prev, endDate: val }));
                }}
              />
            </View>
            <View className=" flex flex-row justify-between mx-10 !h-24 mt-5">
              <TouchableOpacity
                style={{
                  backgroundColor: "#ef4444",
                  height: 40,
                  width: "20%",
                  textAlign: "right",
                  direction: "rtl",
                }}
                onPress={() => handleDeleteExceptionDay(index)}
                className="text-right bg-red-500 rounded-lg items-center shadow-md"
              >
                <AntDesign
                  name="delete"
                  size={24}
                  color="white"
                  className="mt-2"
                />
              </TouchableOpacity>

              <DatePickerInput
                inputKey={`end_time_${index + 2}`}
                type="time"
                label="ساعت خروج"
                inputClassName=" w-[48%]"
                value={""}
                onChange={(val) => {
                  // setStartTime(val);
                }}
              />
              {/* <DatePickerInput
                inputKey={`end_time_${index + 2}`}
                type="time"
                label="ساعت خروج"
                inputClassName=" w-[48%]"
                value={""}
                onChange={(val) => {
                  // setStartTime(val);
                }}
              /> */}
            </View>
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox status="checked" onPress={() => {}} />
              <Text>Subscribe</Text>
            </View> */}
          </>
        ))}
        {formData.shiftDays?.length > 0 && (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: "#22c55e",
                // height: 10,
                marginTop: 30,
                width: "45%",
                textAlign: "right",
                direction: "rtl",
              }}
              onPress={handleGenerateExeptionDays}
              className="mt-4 text-right  bg-green-500 rounded-lg py-3 items-center  shadow-md "
            >
              <Text className="text-white text-[14px] font-semibold font-sans items-center">
                افزودن روز استثنا
              </Text>
            </TouchableOpacity>
          </>
        )}

        {formData.shiftDays?.length > 0 && (
          <>
            <SeparatorWithTitle
              type="center"
              // title="روز های شیفت"
              className="mt-10"
            />

            <SubmitButton
              title="ثبت شیفت"
              className="mt-4"
              onPress={() => {
                // handleGenerateShiftDays(period);
              }}
            />
          </>
        )}
      </Container>
    </BottomSheet>
  );
};

export default ShiftForm;
