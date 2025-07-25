import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Formik } from "formik";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import { AddUserSchema } from "../../validations/schemas/userSchema";
import ErrorMessage from "../../validations/FormError";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";
import ApiService from "@/services/apiService";
import SelectInput from "../../shared/inputs/SelectInput";
import { showMessage } from "react-native-flash-message";

const AddUser = ({
  visible,
  onClose,
  onSuccess,
  locations = [],
  shifts = [],
}) => {
  // Format options from location props
  const locationOptions = useMemo(() => {
    return locations.map((loc) => ({
      label: loc.name,
      value: loc._id,
    }));
  }, [locations]);

  const shiftOptions = useMemo(() => {
    return shifts.map((shif) => ({
      label: shif.shiftName,
      value: shif._id,
    }));
  }, [shifts]);

  const initialValues = {
    name: "",
    phone: "",
    password: "",
    location: "",
    shift: "", // Formik will manage this now
  };

  const handleAddUser = async (values, { setSubmitting }) => {
    try {
      const data = {
        name: values.name,
        phone: values.phone,
        password: values.password,
        location: values.location,
        shift: values.shift,
      };

      const response = await ApiService.post("/customer/users", data);

      showMessage({
        message: "موفقیت آمیز بود",
        description: response.data.message,
        type: "success",
        icon: "success",
      });

      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
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
    <BottomSheet visible={visible} onClose={onClose}>
      <Container>
        <Header classname="mb-4" title="افزودن کارمند جدید" />

        <Formik
          initialValues={initialValues}
          validationSchema={AddUserSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            const success = await handleAddUser(values, { setSubmitting });
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
              <TextFeild
                placeholder="نام"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                className="mb-4"
              />
              <ErrorMessage error={errors.name} visible={touched.name} />

              <TextFeild
                placeholder="شماره تماس"
                keyboardType="phone-pad"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                className="mb-4"
              />
              <ErrorMessage error={errors.phone} visible={touched.phone} />

              <TextFeild
                placeholder="رمز عبور"
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

              <SelectInput
                placeholder="انتخاب موقعیت"
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
                value={values.shift}
                onChange={(val) => setFieldValue("shift", val)}
                options={shiftOptions}
                className="mb-4"
              />
              <ErrorMessage error={errors.shift} visible={touched.shift} />

              <SubmitButton
                title="افزودن"
                className="mt-4"
                loading={isSubmitting && isValid}
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

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-start",
  },
});

export default AddUser;
