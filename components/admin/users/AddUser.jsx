import React from "react";
import { View, StyleSheet } from "react-native";
import { Formik } from "formik";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import AddUserSchema from "../../validations/schemas/AddUserSchema";
import ErrorMessage from "../../validations/FormError";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";
import ApiService from "@/services/apiService";
import { showMessage } from "react-native-flash-message";

const AddUser = ({ visible, onClose, onSuccess }) => {
  const initialValues = {
    name: "",
    phone: "",
    password: "",
  };

  const handleAddUser = async (values, { setSubmitting }) => {
    try {
      const data = {
        name: values.name,
        phone: values.phone,
        password: values.password,
      };
      const response = await ApiService.post("/admin/create-user", data);
      const message = response.data.message;

      showMessage({
        message: "موفقیت آمیز بود",
        description: `${message}`,
        type: "success",
        icon: "success",
      });

      if (onSuccess) onSuccess();

      return true; // ✅ indicate success
    } catch (error) {
      const message =
        error?.response?.data?.errorDetails || "خطایی رخ داده است";

      showMessage({
        message: "مشکلی پیش آمد",
        description: message,
        type: "danger",
        icon: "danger",
      });

      return false; // ❌ indicate failure
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
                error={touched.phone && errors.phone}
              />
              <ErrorMessage error={errors.phone} visible={touched.phone} />

              <TextFeild
                placeholder="رمز عبور"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                className="mb-4"
                type="password"
                error={touched.password && errors.password}
              />
              <ErrorMessage
                error={errors.password}
                visible={touched.password}
              />

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
