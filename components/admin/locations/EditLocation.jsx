import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Formik } from "formik";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import ErrorMessage from "../../validations/FormError";
import { showMessage } from "react-native-flash-message";
import locationSchema from "../../validations/schemas/locationSchema";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";
import ApiService from "@/services/apiService";

const EditLocation = ({ visible, onClose, onSuccess, locationData }) => {
  const [location, setLocation] = useState(
    locationData?.lat && locationData?.long
      ? { latitude: locationData.lat, longitude: locationData.long }
      : null
  );

  const [initialRegion, setInitialRegion] = useState({
    latitude: locationData?.lat || 35.6892,
    longitude: locationData?.long || 51.389,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  const initialValues = {
    name: locationData?.name || "",
    range: String(locationData?.range || ""),
    latitude: location?.latitude,
    longitude: location?.longitude,
  };

  const handleSelectLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const handleAddLocation = async (values, { setSubmitting }) => {
    try {
      const data = {
        name: values.name,
        range: values.range,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await ApiService.post("/customer/locations", data);

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
    <BottomSheet visible={visible} onClose={onClose} extraHeight={350}>
      <Container>
        <Header classname="mb-4" title="ویرایش مکان" />

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={locationSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            const success = await handleAddLocation(values, { setSubmitting });
            if (success) {
              resetForm();
              onClose();
            }
          }}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
            isValid,
          }) => (
            <>
              <TextFeild
                value={values.name}
                onChangeText={handleChange("name")}
                placeholder="نام مکان"
                className="mb-4"
              />
              <ErrorMessage error={errors.name} visible={touched.name} />

              <TextFeild
                value={values.range}
                onChangeText={(val) => {
                  if (/^\d*$/.test(val)) handleChange("range")(val);
                }}
                placeholder="فاصله (متر)"
                className="mb-4"
                keyboardType="numeric"
              />
              <ErrorMessage error={errors.range} visible={touched.range} />

              <Text className="text-sm text-gray-600 mb-2 mt-4 font-sans text-right">
                موقعیت را روی نقشه انتخاب کنید:
              </Text>

              <View
                style={{
                  height: Dimensions.get("window").height * 0.4,
                  backgroundColor: "#f9fafb",
                  borderRadius: 20,
                  padding: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  overflow: "hidden",
                }}
              >
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={initialRegion}
                  region={
                    location
                      ? {
                          ...location,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }
                      : initialRegion
                  }
                  onPress={handleSelectLocation}
                  showsUserLocation
                  showsMyLocationButton
                >
                  {location && (
                    <>
                      <Marker coordinate={location} />
                      {values.range && (
                        <Circle
                          center={location}
                          radius={parseInt(values.range, 10)}
                          strokeColor="rgba(0, 0, 255, 0.5)"
                          fillColor="rgba(0, 0, 255, 0.1)"
                        />
                      )}
                    </>
                  )}
                </MapView>
              </View>

              {location && (
                <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                  <Text className="text-sm text-gray-600 font-sans text-right">
                    مختصات انتخاب‌شده:
                    <Text className="text-xs text-gray-500">
                      {" "}
                      {location.latitude.toFixed(6)} /{" "}
                      {location.longitude.toFixed(6)}
                    </Text>
                  </Text>
                </View>
              )}

              <SubmitButton
                title="ویرایش موقعیت"
                className="mt-4"
                onPress={handleSubmit}
                loading={isSubmitting && isValid}
                disabled={isSubmitting || !isValid}
              />
            </>
          )}
        </Formik>
      </Container>
    </BottomSheet>
  );
};

export default EditLocation;
