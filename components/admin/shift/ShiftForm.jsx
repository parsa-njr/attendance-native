import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";
import DatePickerInput from "../../shared/inputs/DatePickerInput";
import SeparatorWithTitle from "../../shared/SeparatorWithTitle";
import { AntDesign } from "@expo/vector-icons";
import ErrorMessage from "../../validations/FormError";
import ApiService from "../../../services/apiService";
import { showMessage } from "react-native-flash-message";
import {
  convertToISODateTime,
  toJalaliDate,
} from "../../../utils/dateFunctions";
import { customToast } from "../../shared/toast/CustomeToast";

// Validation schema
const ShiftSchema = Yup.object().shape({
  shiftName: Yup.string().required("عنوان شیفت الزامی است"),
  period: Yup.number()
    .required("دوره شیفت الزامی است")
    .positive("باید عدد مثبت باشد")
    .integer("باید عدد صحیح باشد"),
  startDate: Yup.string().required("تاریخ شروع الزامی است"),
  endDate: Yup.string().required("تاریخ پایان الزامی است"),
  formalHolidays: Yup.boolean(),
  shiftDays: Yup.array().of(
    Yup.object().shape({
      day: Yup.number().required(),
      time: Yup.array().of(
        Yup.object().shape({
          startTime: Yup.string().required("ساعت شروع الزامی است"),
          endTime: Yup.string().required("ساعت پایان الزامی است"),
        })
      ),
    })
  ),
  exceptionDays: Yup.array().of(
    Yup.object().shape({
      date: Yup.string().required("تاریخ روز استثنا الزامی است"),
      time: Yup.array().of(
        Yup.object().shape({
          startTime: Yup.string().required("ساعت شروع الزامی است"),
          endTime: Yup.string().required("ساعت پایان الزامی است"),
        })
      ),
    })
  ),
});

const initialValues = {
  shiftName: "",
  period: 0,
  startDate: "",
  endDate: "",
  formalHolidays: false,
  shiftDays: [],
  exceptionDays: [],
};

const ShiftForm = ({ visible, onClose, getList, mode = "add", formData }) => {
  console.log("formData : ", formData);
  const data =
    mode === "edit"
      ? {
          shiftName: formData?.shiftName,
          period: formData?.shiftDays?.length,
          startDate: toJalaliDate(formData?.startDate),
          endDate: toJalaliDate(formData?.endDate),
          formalHolidays: formData?.formalHolidays,
          shiftDays: formData?.shiftDays.map((item) => ({
            day: item.day,
            isOffDay: item?.isOffDay,
            time: item.time.map((subItem) => ({
              startTime: subItem.startTime,
              endTime: subItem.endTime,
            })),
          })),
          exceptionDays: formData?.exceptionDays.map((item) => ({
            date: toJalaliDate(item?.date),
            time: item.time.map((subItem) => ({
              startTime: subItem.startTime,
              endTime: subItem.endTime,
            })),
          })),
        }
      : initialValues;

  const handleShiftSubmit = async (values) => {
    try {
      const payload = {
        shiftName: values.shiftName,
        startDate: convertToISODateTime(values.startDate),
        endDate: convertToISODateTime(values.endDate),
        formalHolidays: values.formalHolidays,
        shiftDays: values.shiftDays,
        exceptionDays: values?.exceptionDays.map((item) => ({
          date: convertToISODateTime(item?.date),
          time: item.time.map((subItem) => ({
            startTime: subItem.startTime,
            endTime: subItem.endTime,
          })),
        })),
      };
      const apiUrl =
        mode === "edit"
          ? `/customer/shifts/${formData?._id}`
          : "/customer/shifts";

      console.log("apiUrl :: ", apiUrl);

      const response =
        mode === "edit"
          ? await ApiService.put(apiUrl, payload)
          : await ApiService.post(apiUrl, payload);

      console.log("responseee : ", response);
      onClose();

      customToast({
        title: "عملیات با موفقیت انجام شد",
        type: "success",
        delay: 700, // ⏱️ delay in ms
      });

      getList();
    } catch (error) {
      const message =
        error?.response?.data?.errorDetails || "خطایی رخ داده است";
      console.log("responseee Errorr : ", error);

      customToast({
        title: "مشکلی پیش آمد",
        type: "danger",
        description: message,
        delay: 300, // ⏱️ delay in ms
      });
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} extraHeight={170}>
      <Container>
        <Header classname="mb-4" title="تعریف شیفت" onClose={onClose} />

        <Formik
          initialValues={data}
          enableReinitialize
          validationSchema={ShiftSchema}
          onSubmit={(values) => {
            console.log("values :: ", values?.shiftDays[0]?.time);
            handleShiftSubmit(values);
            // onSubmit(values);
            // onClose();
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              {console.log("values :: ", values)}
              {/* Name input */}
              <View className="h-24 flex flex-row justify-between mx-10 mb-5"></View>
              <TextFeild
                value={values.shiftName}
                onChangeText={handleChange("shiftName")}
                onBlur={handleBlur("shiftName")}
                placeholder="عنوان شیفت"
                className="mb-4"
                // error={touched.shiftName && errors.shiftName}
              />
              <ErrorMessage
                error={errors.shiftName}
                visible={touched.shiftName}
              />
              <TextFeild
                value={
                  values?.period
                    ? values?.period?.toString()
                    : values?.shiftDays.length
                }
                onChangeText={(value) => {
                  if (/^\d*$/.test(value)) {
                    setFieldValue("period", value);
                  }
                }}
                placeholder="دوره شیفت (تعداد روز هر شیفت)"
                className="mb-4"
                keyboardType="numeric"
                error={touched.period && errors.period}
              />
              <ErrorMessage error={errors.period} visible={touched.period} />

              <View className="h-24 flex gap-4 flex-row justify-between mx-10 mb-5">
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <DatePickerInput
                    inputKey="endDate"
                    label="تاریخ پایان شیفت"
                    value={values.endDate}
                    type="calender"
                    onChange={(val) => setFieldValue("endDate", val)}
                    error={touched.endDate && errors.endDate}
                  />
                  <ErrorMessage
                    error={errors.endDate}
                    visible={touched.endDate}
                  />
                </View>
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <DatePickerInput
                    inputKey="startDate"
                    label="تاریخ شروع شیفت"
                    value={values.startDate}
                    type="calender"
                    onChange={(val) => setFieldValue("startDate", val)}
                    error={touched.startDate && errors.startDate}
                  />
                  <ErrorMessage
                    error={errors.startDate}
                    visible={touched.startDate}
                  />
                </View>
              </View>

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
                  status={values.formalHolidays ? "checked" : "unchecked"}
                  onPress={() => {
                    setFieldValue("formalHolidays", !values.formalHolidays);
                  }}
                />
                <Text className="font-sans text-[#6b7280]">
                  تبعیت از تعطیلات رسمی
                </Text>
              </View>

              <SubmitButton
                title="ساخت شیفت"
                className="mt-4"
                onPress={() => {
                  if (values.period > 0) {
                    const newShiftDays = Array.from(
                      { length: parseInt(values.period) },
                      (_, index) => ({
                        day: index + 1,
                        isOffDay: false,
                        time: [
                          {
                            startTime: "",
                            endTime: "",
                          },
                        ],
                      })
                    );
                    setFieldValue("shiftDays", newShiftDays);
                  }
                }}
              />

              <FieldArray name="shiftDays">
                {({ push, remove, form }) => (
                  <>
                    {form.values.shiftDays?.length > 0 && (
                      <>
                        <SeparatorWithTitle
                          type="center"
                          title="روز های شیفت"
                          className="mt-10"
                        />
                      </>
                    )}

                    {form.values.shiftDays.map((item, index) => (
                      <React.Fragment key={`shiftDay-${index}`}>
                        <SeparatorWithTitle
                          title={`روز ${item.day}`}
                          className="mt-10"
                        />
                        <View className="h-24 flex flex-row justify-between mx-10 mb-5 gap-4">
                          <View style={{ flex: 1, minWidth: "45%" }}>
                            <DatePickerInput
                              inputKey={`shiftDays.${index}.time.0.endTime`}
                              type="time"
                              label="ساعت خروج"
                              inputClassName="h-10"
                              value={item.time[0].endTime}
                              onChange={(val) => {
                                console.log("timeVal :: ", val);
                                setFieldValue(
                                  `shiftDays.${index}.time.0.endTime`,
                                  val
                                );
                              }}
                            />
                            <ErrorMessage
                              error={
                                errors.shiftDays?.[index]?.time?.[0]?.endTime
                              }
                              visible={
                                touched.shiftDays?.[index]?.time?.[0]?.endTime
                              }
                            />
                          </View>
                          <View style={{ flex: 1, minWidth: "45%" }}>
                            <DatePickerInput
                              inputKey={`shiftDays.${index}.time.0.startTime`}
                              type="time"
                              label="ساعت ورود"
                              inputClassName="h-10"
                              value={item.time[0].startTime}
                              onChange={(val) =>
                                setFieldValue(
                                  `shiftDays.${index}.time.0.startTime`,
                                  val
                                )
                              }
                            />
                            <ErrorMessage
                              error={
                                errors.shiftDays?.[index]?.time?.[0]?.startTime
                              }
                              visible={
                                touched.shiftDays?.[index]?.time?.[0]?.startTime
                              }
                            />
                          </View>
                        </View>
                        <View className="h-24 flex flex-row justify-between mx-10 mb-5 gap-4">
                          {index > 0 && (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  maxWidth: "45%",
                                }}
                              >
                                <SubmitButton
                                  icon={
                                    <Feather
                                      name="copy"
                                      size={24}
                                      color="white"
                                    />
                                  }
                                  title="کپی از روز قبل"
                                  className=""
                                  onPress={() => {
                                    setFieldValue(
                                      `shiftDays.${index}.time`,
                                      form.values.shiftDays[index - 1]?.time
                                    );
                                  }}
                                />
                              </View>
                            </>
                          )}
                          <View
                            className="  flex items-center justify-start text-right"
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              direction: "rtl",
                              color: "#6b7280",
                              flex: 1,
                              width: "50%",
                            }}
                          >
                            <Checkbox
                              color="#3b82f6"
                              status={
                                item.time[0].isOffDay ? "checked" : "unchecked"
                              }
                              onPress={() => {
                                setFieldValue(
                                  `shiftDays.${index}.time.0.isOffDay`,
                                  !item.time[0].isOffDay
                                );
                              }}
                            />
                            <Text className="font-sans text-[#6b7280]">
                              روز تعطیل شیفت
                            </Text>
                          </View>
                        </View>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </FieldArray>

              <FieldArray name="exceptionDays">
                {({ push, remove, form }) => (
                  <>
                    {form.values.shiftDays?.length > 0 && (
                      <>
                        <SeparatorWithTitle
                          type="center"
                          title="روز های استثنا"
                          className="mt-10"
                        />
                      </>
                    )}

                    {form.values.exceptionDays.map((item, index) => (
                      <React.Fragment key={`exceptionDay-${index}`}>
                        <SeparatorWithTitle
                          title={`روز ${index + 1}`}
                          className="mt-10"
                        />
                        <View className="h-24 flex flex-row justify-between mx-10 gap-4 flex-wrap">
                          <View style={{ flex: 1, minWidth: "45%" }}>
                            <DatePickerInput
                              inputKey={`exceptionDays.${index}.time.0.startTime`}
                              type="time"
                              label="ساعت ورود"
                              inputClassName="h-10"
                              value={item.time[0].startTime}
                              onChange={(val) =>
                                setFieldValue(
                                  `exceptionDays.${index}.time.0.startTime`,
                                  val
                                )
                              }
                              error={
                                touched.exceptionDays?.[index]?.time?.[0]
                                  ?.startTime &&
                                errors.exceptionDays?.[index]?.time?.[0]
                                  ?.startTime
                              }
                            />
                            <ErrorMessage
                              error={
                                errors.exceptionDays?.[index]?.time?.[0]
                                  ?.startTime
                              }
                              visible={
                                touched.exceptionDays?.[index]?.time?.[0]
                                  ?.startTime
                              }
                            />
                          </View>
                          <View style={{ flex: 1, minWidth: "45%" }}>
                            <DatePickerInput
                              inputKey={`exceptionDays.${index}.date`}
                              label="تاریخ روز استثنا"
                              type="calender"
                              value={item.date}
                              onChange={(val) =>
                                setFieldValue(
                                  `exceptionDays.${index}.date`,
                                  val
                                )
                              }
                            />
                            <ErrorMessage
                              error={errors.exceptionDays?.[index]?.date}
                              visible={touched.exceptionDays?.[index]?.date}
                            />
                          </View>
                        </View>

                        <View className=" flex flex-row justify-between mx-10 !h-24 mt-5">
                          <View style={{ flex: 1, width: "45%" }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: "#ef4444",
                                height: 40,
                                width: "60%",
                                marginTop: 18,
                                textAlign: "right",
                                direction: "rtl",
                              }}
                              onPress={() => remove(index)}
                              className="text-right bg-red-500 rounded-lg items-center shadow-md"
                            >
                              <AntDesign
                                name="delete"
                                size={24}
                                color="white"
                                className="mt-2"
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={{ flex: 1, width: "45%" }}>
                            <DatePickerInput
                              inputKey={`exceptionDays.${index}.time.0.endTime`}
                              type="time"
                              label="ساعت خروج"
                              value={item.time[0].endTime}
                              onChange={(val) =>
                                setFieldValue(
                                  `exceptionDays.${index}.time.0.endTime`,
                                  val
                                )
                              }
                            />
                            <ErrorMessage
                              error={
                                errors.exceptionDays?.[index]?.time?.[0]
                                  ?.endTime
                              }
                              visible={
                                touched.exceptionDays?.[index]?.time?.[0]
                                  ?.endTime
                              }
                            />
                          </View>
                        </View>
                      </React.Fragment>
                    ))}

                    {form.values.shiftDays?.length > 0 && (
                      <>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#22c55e",
                            marginTop: 30,
                            width: "45%",
                            textAlign: "right",
                            direction: "rtl",
                          }}
                          onPress={() =>
                            push({
                              date: "",
                              time: [
                                {
                                  startTime: "",
                                  endTime: "",
                                },
                              ],
                            })
                          }
                          className="mt-4 text-right  bg-green-500 rounded-lg py-3 items-center  shadow-md "
                        >
                          <Text className="text-white text-[14px] font-semibold font-sans items-center">
                            افزودن روز استثنا
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}
              </FieldArray>

              {values.shiftDays?.length > 0 && (
                <>
                  <SeparatorWithTitle type="center" className="mt-10" />
                  <SubmitButton
                    title="ثبت شیفت"
                    className="mt-4"
                    onPress={handleSubmit}
                  />
                </>
              )}
            </>
          )}
        </Formik>
      </Container>
    </BottomSheet>
  );
};

export default ShiftForm;

// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
// } from "react-native";
// import { Checkbox } from "react-native-paper";
// import MapView, { Marker, Circle } from "react-native-maps";
// import * as Location from "expo-location";
// import BottomSheet from "../../shared/BottomSheet";
// import Header from "../../shared/Header";
// import SubmitButton from "../../shared/buttons/SubmitButton";
// import TextFeild from "../../shared/inputs/TextFeild";
// import Container from "../../shared/Container";
// import DatePickerInput from "../../shared/inputs/DatePickerInput";
// import SeparatorWithTitle from "../../shared/SeparatorWithTitle";
// import { AntDesign } from "@expo/vector-icons";

// const ShiftForm = ({ visible, onClose }) => {
//   const handleGenerateShiftDays = (count) => {
//     const newShiftDays = Array.from({ length: count }, (_, index) => ({
//       day: index + 1,
//       time: [
//         {
//           startTime: "",
//           endTime: "",
//         },
//       ],
//     }));

//     setFormData((prev) => ({
//       ...prev,
//       shiftDays: newShiftDays,
//     }));
//   };
//   const handleGenerateExeptionDays = () => {
//     setFormData((prev) => {
//       const newDay = {
//         day: (prev.exceptionDays?.length || 0) + 1,
//         date: "",
//         time: [
//           {
//             startTime: "",
//             endTime: "",
//           },
//         ],
//       };

//       return {
//         ...prev,
//         exceptionDays: [...(prev.exceptionDays || []), newDay],
//       };
//     });
//   };

//   const [period, setPeriod] = useState(0);
//   const [formData, setFormData] = useState({
//     shiftName: "",
//     startDate: "", // Fixed typo here too (was: startData)
//     endDate: "",
//     formalHolidays: false,
//     shiftDays: [],
//     exceptionDays: [], // Fixed typo here too (was: exeptionDays)
//   });

//   const handleDeleteExceptionDay = (indexToDelete) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       exceptionDays: prevData.exceptionDays.filter(
//         (_, idx) => idx !== indexToDelete
//       ),
//     }));
//   };

//   return (
//     <BottomSheet visible={visible} onClose={onClose} extraHeight={450}>
//       <Container>
//         <Header classname="mb-4" title="تعریف شیفت" />

//         {/* Name input */}
//         <View className="h-24 flex flex-row justify-between mx-10 mb-5"></View>
//         <TextFeild
//           value={formData?.shiftName}
//           onChangeText={(val) =>
//             setFormData((prev) => ({ ...prev, shiftName: val }))
//           }
//           placeholder="عنوان شیفت"
//           className="mb-4"
//         />
//         <TextFeild
//           value={period}
//           onChangeText={(value) => {
//             setPeriod(value);
//           }}
//           placeholder="دوره شیفت (تعداد روز هر شیفت)"
//           className="mb-4"
//           keyboardType="numeric"
//         />
//         <View className="h-24 flex gap-4 flex-row justify-between mx-10 mb-5">
//           <View style={{ flex: 1, minWidth: "45%" }}>
//             <DatePickerInput
//               inputKey="endDate"
//               label="تاریخ پایان شیفت"
//               // placeholder="تاریخ پایان شیفت"
//               // inputClassName=" w-[48%]"
//               value={formData?.endDate}
//               type="calender"
//               onChange={(val) => {
//                 setFormData((prev) => ({ ...prev, endDate: val }));
//               }}
//             />
//           </View>
//           <View style={{ flex: 1, minWidth: "45%" }}>
//             <DatePickerInput
//               inputKey="startDate"
//               label="تاریخ شروع شیفت"
//               // inputClassName=" w-[48%]"
//               value={formData?.startDate}
//               type="calender"
//               onChange={(val) => {
//                 setFormData((prev) => ({ ...prev, startDate: val }));
//               }}
//             />
//           </View>
//         </View>

//         {/* Range input */}
//         {/* <TextFeild
//           value={range}
//           onChangeText={(value) => {
//             // Only allow numbers and prevent negative values
//             if (/^\d*$/.test(value)) {
//               setRange(value);
//             }
//           }}
//           placeholder="فاصله (متر)"
//           className="mb-4"
//           keyboardType="numeric"
//         /> */}
//         <View
//           className="flex items-center justify-start text-right mt-4"
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             direction: "rtl",
//             color: "#6b7280",
//           }}
//         >
//           <Checkbox
//             color="#3b82f6"
//             status={formData?.formalHolidays ? "checked" : "unchecked"}
//             onPress={() => {
//               const newValue = !formData?.formalHolidays;
//               // setChecked(newValue);
//               console.log("New checkbox value:", newValue);
//               setFormData((prev) => ({ ...prev, formalHolidays: newValue }));
//               // You can use `newValue` here however you want
//             }}
//           />
//           <Text className="font-sans text-[#6b7280]">
//             تبعیت از تعطیلات رسمی
//           </Text>
//         </View>
//         <SubmitButton
//           title="ساخت شبفت"
//           className="mt-4"
//           onPress={() => {
//             handleGenerateShiftDays(period);
//           }}
//         />
//         {formData.shiftDays?.length > 0 && (
//           <>
//             <SeparatorWithTitle
//               type="center"
//               title="روز های شیفت"
//               className="mt-10"
//             />
//           </>
//         )}

//         {formData.shiftDays.map((item, index) => (
//           <>
//             <SeparatorWithTitle title={`روز ${item?.day}`} className="mt-10" />
//             <View className="h-24 flex flex-row justify-between mx-10 mb-5 gap-4">
//               <View style={{ flex: 1, minWidth: "45%" }}>
//                 <DatePickerInput
//                   inputKey={`end_time_${index + 2}`}
//                   type="time"
//                   label="ساعت خروج"
//                   inputClassName="h-10 "
//                   value={""}
//                   onChange={(val) => {
//                     // setStartTime(val);
//                   }}
//                 />
//               </View>
//               <View style={{ flex: 1, minWidth: "45%" }}>
//                 <DatePickerInput
//                   inputKey={`start_time_${index + 2}`}
//                   type="time"
//                   label="ساعت ورود"
//                   inputClassName="h-10 "
//                   value={""}
//                   onChange={(val) => {
//                     // setStartTime(val);
//                   }}
//                 />
//               </View>
//             </View>
//             {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Checkbox status="checked" onPress={() => {}} />
//               <Text>Subscribe</Text>
//             </View> */}
//           </>
//         ))}
//         {formData.shiftDays?.length > 0 && (
//           <>
//             <SeparatorWithTitle
//               type="center"
//               title="روز های استثنا"
//               className="mt-10"
//             />
//           </>
//         )}
//         {formData.exceptionDays.map((item, index) => (
//           <>
//             <SeparatorWithTitle title={`روز ${item?.day}`} className="mt-10" />
//             <View className="h-24 flex flex-row justify-between mx-10 gap-4 flex-wrap">
//               <View style={{ flex: 1, minWidth: "45%" }}>
//                 <DatePickerInput
//                   inputKey={`start_time_${index + 2}`}
//                   type="time"
//                   label="ساعت ورود"
//                   inputClassName="h-10 "
//                   value={""}
//                   onChange={(val) => {
//                     // setStartTime(val);
//                   }}
//                 />
//               </View>
//               <View style={{ flex: 1, minWidth: "45%" }}>
//                 <DatePickerInput
//                   inputKey="item.date"
//                   label="تاریخ روز استثنا "
//                   // inputClassName=" w-[48%]"
//                   // value={formData?.endDate}
//                   type="calender"
//                   onChange={(val) => {
//                     // setFormData((prev) => ({ ...prev, endDate: val }));
//                   }}
//                 />
//               </View>
//             </View>

//             <View className=" flex flex-row justify-between mx-10 !h-24 mt-5">
//               <View style={{ flex: 1, width: "45%" }}>
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: "#ef4444",
//                     height: 40,
//                     width: "60%",
//                     marginTop: 18,
//                     textAlign: "right",
//                     direction: "rtl",
//                   }}
//                   onPress={() => handleDeleteExceptionDay(index)}
//                   className="text-right bg-red-500 rounded-lg items-center shadow-md"
//                 >
//                   <AntDesign
//                     name="delete"
//                     size={24}
//                     color="white"
//                     className="mt-2"
//                   />
//                 </TouchableOpacity>
//               </View>

//               <View style={{ flex: 1, width: "45%" }}>
//                 <DatePickerInput
//                   inputKey={`end_time_${index + 2}`}
//                   type="time"
//                   label="ساعت خروج"
//                   // inputClassName=" w-[48%]"
//                   value={""}
//                   onChange={(val) => {
//                     // setStartTime(val);
//                   }}
//                 />
//               </View>
//             </View>
//           </>
//         ))}
//         {formData.shiftDays?.length > 0 && (
//           <>
//             <TouchableOpacity
//               style={{
//                 backgroundColor: "#22c55e",
//                 // height: 10,
//                 marginTop: 30,
//                 width: "45%",
//                 textAlign: "right",
//                 direction: "rtl",
//               }}
//               onPress={handleGenerateExeptionDays}
//               className="mt-4 text-right  bg-green-500 rounded-lg py-3 items-center  shadow-md "
//             >
//               <Text className="text-white text-[14px] font-semibold font-sans items-center">
//                 افزودن روز استثنا
//               </Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {formData.shiftDays?.length > 0 && (
//           <>
//             <SeparatorWithTitle
//               type="center"
//               // title="روز های شیفت"
//               className="mt-10"
//             />

//             <SubmitButton
//               title="ثبت شیفت"
//               className="mt-4"
//               onPress={() => {
//                 // handleGenerateShiftDays(period);
//               }}
//             />
//           </>
//         )}
//       </Container>
//     </BottomSheet>
//   );
// };

// export default ShiftForm;
