import React, { useMemo } from "react";
import { Formik } from "formik";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import {
  AddUserSchema,
  EditUserSchema,
} from "../../validations/schemas/userSchema";
import ErrorMessage from "../../validations/FormError";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";
import ApiService from "@/services/apiService";
import SelectInput from "../../shared/inputs/SelectInput";
import { customToast } from "@/components/shared/toast/CustomeToast";

const UserForm = ({
  visible,
  onClose,
  getList,
  mode = "add",
  formData,
  locations,
  shifts,
}) => {
  // Format options from location props
  const locationOptions = useMemo(() => {
    return locations?.map((loc) => ({
      label: loc.name,
      value: loc._id,
    }));
  }, [locations]);

  const shiftOptions = useMemo(() => {
    return shifts?.map((shif) => ({
      label: shif.shiftName,
      value: shif._id,
    }));
  }, [shifts]);

  const initialValues = {
    name: "",
    phone: "",
    password: "",
    location: null,
    shift: null, // Formik will manage this now
  };

  const data =
    mode === "edit"
      ? {
          name: formData?.name,
          phone: formData?.phone,
          location: formData?.location?._id,
          shift: formData?.shift?._id, // Formik will manage this now
        }
      : initialValues;

  const handleUserSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        location: values.location || null,
        shift: values.shift || null,
        password: values.password,
      };

      const apiUrl =
        mode === "edit"
          ? `/customer/users/${formData?._id}`
          : "/customer/users";

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
    <BottomSheet visible={visible} onClose={onClose}>
      <Container>
        <Header
          classname="mb-4"
          title={`${mode === "edit" ? "ویرایش کارمند" : "افزودن کارمند"}`}
        />

        <Formik
          initialValues={data}
          enableReinitialize
          validationSchema={mode === "edit" ? EditUserSchema : AddUserSchema}
          onSubmit={(values) => {
            handleUserSubmit(values);
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
              <TextFeild
                placeholder="نام"
                label="نام "
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                className="mb-4"
              />
              <ErrorMessage error={errors.name} visible={touched.name} />

              <TextFeild
                placeholder="شماره تماس"
                label="شماره تماس"
                keyboardType="phone-pad"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                className="mb-4"
              />
              <ErrorMessage error={errors.phone} visible={touched.phone} />

              {mode === "add" && (
                <>
                  <TextFeild
                    placeholder="رمز عبور"
                    label="رمز عبور"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    className="mb-4"
                    type="password"
                  />
                  <ErrorMessage
                    error={errors.password}
                    visible={touched.password}
                  />
                </>
              )}

              <SelectInput
                placeholder="انتخاب موقعیت"
                label="انتخاب موقعیت"
                value={values.location}
                onChange={(val) => setFieldValue("location", val)}
                options={locationOptions}
                className="mb-4"
              />
              <ErrorMessage
                error={errors.location}
                visible={touched.location}
              />

              <SelectInput
                placeholder="انتخاب شیفت"
                label="انتخاب شیفت"
                value={values.shift}
                onChange={(val) => setFieldValue("shift", val)}
                options={shiftOptions}
                className="mb-4"
              />
              <ErrorMessage error={errors.shift} visible={touched.shift} />

              <SubmitButton
                title={mode === "edit" ? "ویرایش" : "افزودن"}
                className="mt-4"
                loading={isSubmitting}
                disabled={isSubmitting || !isValid}
                onPress={handleSubmit}
              />
            </>
          )}
        </Formik>
      </Container>
    </BottomSheet>
  );
};

// const styles = StyleSheet.create({
//   backgroundContainer: {
//     flex: 1,
//     position: "relative",
//     justifyContent: "flex-start",
//   },
// });

export default UserForm;
