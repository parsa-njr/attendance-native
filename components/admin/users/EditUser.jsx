import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Formik } from "formik";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import { EditUserSchema } from "../../validations/schemas/userSchema";
import ErrorMessage from "../../validations/FormError";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";
import ApiService from "@/services/apiService";
import SelectInput from "../../shared/inputs/SelectInput";
import { showMessage } from "react-native-flash-message";

const EditUser = ({
  visible,
  onClose,
  onSuccess,
  locations = [],
  shifts = [],
  userData,
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
    name: userData?.name,
    phone: userData?.phone,
    password: "",
    location: userData?.location,
    shift: userData?.shift, // Formik will manage this now
  };

  const handleEditUser = async (values, { setSubmitting }) => {
    try {
      const data = {
        name: values.name,
        phone: values.phone,
        location: values.location,
        shift: values.shift,
      };

      if (values.password) {
        data.password = values.password;
      }

      const response = await ApiService.post(
        `/customer/users/${userData?.id}`,
        data
      );

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
        <Header classname="mb-4" title="ویرایش کارمند" />

        <Formik
          initialValues={initialValues}
          validationSchema={EditUserSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            const success = await handleEditUser(values, { setSubmitting });
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
                title="ویرایش"
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

export default EditUser;
