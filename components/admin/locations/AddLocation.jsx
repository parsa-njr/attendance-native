import React, { useState, useEffect } from "react";
import { Text, View, Dimensions } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Formik } from "formik";
import BottomSheet from "../../shared/BottomSheet";
import Header from "../../shared/Header";
import SubmitButton from "../../shared/buttons/SubmitButton";
import ErrorMessage from "../../validations/FormError";
import { showMessage } from "react-native-flash-message";
import { AddUserSchema } from "../../validations/schemas/userSchema";
import TextFeild from "../../shared/inputs/TextFeild";
import Container from "../../shared/Container";

const AddLocation = ({ visible, onClose }) => {
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 35.6892,
    longitude: 51.389,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLocation({ latitude, longitude });
    })();
  }, []);

  const handleSelectLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} extraHeight={350}>
      <Container>
        <Header classname="mb-4" title="افزودن مکان جدید" />

        <Formik
          initialValues={{ name: "", range: "" }}
          onSubmit={(values, { resetForm }) => {
            if (location && values.name && values.range) {
              const newItem = {
                id: locations.length + 1,
                name: values.name,
                range: parseInt(values.range, 10),
                ...location,
              };
              setLocations([...locations, newItem]);
              resetForm();
              setLocation(null);
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
                value={values.name}
                onChangeText={handleChange("name")}
                placeholder="نام مکان"
                className="mb-4"
              />

              <TextFeild
                value={values.range}
                onChangeText={(val) => {
                  if (/^\d*$/.test(val)) handleChange("range")(val);
                }}
                placeholder="فاصله (متر)"
                className="mb-4"
                keyboardType="numeric"
              />

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
                  style={{ flex: 1, borderRadius: 16 }}
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
                  showsScale={false}
                  showsBuildings
                  showsCompass={false}
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
                    📍 مختصات انتخاب‌شده:{" "}
                    <Text className="text-xs text-gray-500 font-sans">
                      {location.latitude.toFixed(6)} /{" "}
                      {location.longitude.toFixed(6)}
                    </Text>
                  </Text>
                </View>
              )}

              <SubmitButton
                title="ذخیره موقعیت"
                className="mt-4"
                onPress={handleSubmit}
              />
            </>
          )}
        </Formik>
      </Container>
    </BottomSheet>
  );
};

export default AddLocation;
