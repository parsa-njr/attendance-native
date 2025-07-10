import React from "react";
import { View } from "react-native";
import { Formik } from "formik";
import BottomSheet from "../../shared/BottomSheet";
import TextFeild from "../../shared/inputs/TextFeild";
import TextArea from "../../shared/inputs/TextArea";
import SelectInput from "../../shared/inputs/SelectInput";
import DatePickerInput from "../../shared/inputs/DatePickerInput";
import Header from "../../shared/Header";
import RequestValidationSchema from "../../validations/schemas/RequestScema";
import ErrorMessage from "../../validations/FormError";
import SubmitButton from "../../shared/buttons/SubmitButton";
import Container from "../../shared/Container";
import { showMessage } from "react-native-flash-message";
import ApiService from "@/services/apiService";
import moment from "moment-jalaali";

const RequestForm = ({ visible, onClose, onSuccess }) => {
  const typeOption = [
    { label: "مرخصی", value: "leave" },
    { label: "دورکاری", value: "remote" },
    { label: "اضافه کاری", value: "overtime" },
    { label: "ماموریت", value: "mission" },
  ];

  const initialValues = {
    requestType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    note: "",
  };

  const convertToISODateTime = (jalaliDate, time) => {
    if (!jalaliDate || !time) return "";
    const gregorian = moment(jalaliDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
    const normalizedTime = moment(time, "HH:mm").format("HH:mm");
    return `${gregorian}T${normalizedTime}:00Z`;
  };

  const handleAddRequest = async (values, { setSubmitting }) => {
    try {
      const startDateIso = convertToISODateTime(
        values.startDate,
        values.startTime
      );
      const endDateIso = convertToISODateTime(values.endDate, values.endTime);

      

      const data = {
        requestType: values.requestType,
        startDate: startDateIso,
        endDate: endDateIso,
        userNote: values.note,
      };

      const response = await ApiService.post("/user/requests", data);

      showMessage({
        message: "موفقیت آمیز بود",
        description: response.data.message,
        type: "success",
        icon: "success",
      });

      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.errorDetails || "خطایی رخ داده است";

      showMessage({
        message: "مشکلی پیش آمد",
        description: message,
        type: "danger",
        icon: "danger",
      });

      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheet key="request_modal" visible={visible} onClose={onClose}>
      <Container>
        <Header classname="mb-4" title="افزودن درخواست جدید" />

        <Formik
          initialValues={initialValues}
          validationSchema={RequestValidationSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            const success = await handleAddRequest(values, { setSubmitting });
            if (success) {
              resetForm();
              onClose();
            }
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
            isSubmitting,
            isValid,
          }) => (
            <>
              {/* Select Input */}
              <View className="mx-10 mb-5">
                <SelectInput
                  inputKey="request_type"
                  value={values.requestType}
                  onChange={(val) => setFieldValue("requestType", val)}
                  options={typeOption}
                  className="mb-4"
                  placeholder="نوع درخواست"
                />
                <ErrorMessage
                  error={errors.requestType}
                  visible={touched.requestType}
                />
              </View>

              {/* Start Date & Start Time */}
              <View className="flex flex-row justify-between mx-10 mb-5">
                <View className="w-[48%]">
                  <DatePickerInput
                    inputKey="startTime"
                    type="time"
                    label="ساعت شروع"
                    inputClassName="mb-4"
                    value={values.startTime}
                    onChange={(val) => setFieldValue("startTime", val)}
                  />
                  <ErrorMessage
                    error={errors.startTime}
                    visible={touched.startTime}
                  />
                </View>

                <View className="w-[48%]">
                  <DatePickerInput
                    inputKey="startDate"
                    label="تاریخ شروع"
                    type="calendar"
                    inputClassName="mb-4"
                    value={values.startDate}
                    onChange={(val) => setFieldValue("startDate", val)}
                  />
                  <ErrorMessage
                    error={errors.startDate}
                    visible={touched.startDate}
                  />
                </View>
              </View>

              {/* End Date & End Time */}
              <View className="flex flex-row justify-between mx-10 mb-5">
                <View className="w-[48%]">
                  <DatePickerInput
                    inputKey="endTime"
                    type="time"
                    label="ساعت پایان"
                    inputClassName="mb-4"
                    value={values.endTime}
                    onChange={(val) => setFieldValue("endTime", val)}
                  />
                  <ErrorMessage
                    error={errors.endTime}
                    visible={touched.endTime}
                  />
                </View>

                <View className="w-[48%]">
                  <DatePickerInput
                    inputKey="endDate"
                    label="تاریخ پایان"
                    type="calendar"
                    inputClassName="mb-4"
                    value={values.endDate}
                    onChange={(val) => setFieldValue("endDate", val)}
                  />
                  <ErrorMessage
                    error={errors.endDate}
                    visible={touched.endDate}
                  />
                </View>
              </View>

              {/* Note */}
              <View className="mx-10 mb-6">
                <TextArea
                  label="توضیحات"
                  placeholder="توضیحات خود را وارد کنید"
                  value={values.note}
                  onChangeText={handleChange("note")}
                  className="mb-4"
                />
                <ErrorMessage error={errors.note} visible={touched.note} />
              </View>

              {/* Submit */}
              <SubmitButton
                title="افزودن"
                className="mt-2"
                loading={isSubmitting && isValid}
                onPress={handleSubmit}
              />
            </>
          )}
        </Formik>
      </Container>
    </BottomSheet>
  );
};

export default RequestForm;
