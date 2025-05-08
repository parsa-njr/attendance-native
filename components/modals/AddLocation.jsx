import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet from "../shared/BottomSheet";

const AddLocation = ({ visible, onClose }) => {
  const [location, setLocation] = useState(null);
  const [name, setName] = useState("");
  const [range, setRange] = useState(null); // New state for range
  const [locations, setLocations] = useState([]);
  const [address, setAddress] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 35.6892,
    longitude: 51.389,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Ask for location on mount
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

  const handleSelectLocation = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} extraHeight={350}>
      <View className="bg-white rounded-t-3xl p-8 relative">
        {/* Close button */}
        <TouchableOpacity
          className="absolute top-4 left-4 z-10"
          onPress={onClose}
        >
          <Text className="text-2xl text-gray-500">✕</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-xl text-center text-gray-800 mb-4 font-sans">
          انتخاب موقعیت روی نقشه
        </Text>

        {/* Name input */}
        <TextInput
          placeholder="نام مکان"
          placeholderTextColor="#aaa"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-4 text-right text-base text-gray-800 font-sans"
          value={name}
          onChangeText={setName}
        />

        {/* Range input */}
        <TextInput
          placeholder="فاصله (متر)"
          placeholderTextColor="#aaa"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-4 text-right text-base text-gray-800 font-sans"
          keyboardType="numeric"
          value={range}
          onChangeText={(value) => {
            // Only allow numbers and prevent negative values
            if (/^\d*$/.test(value)) {
              setRange(value);
            }
          }}
        />

        {/* Label */}
        <Text className="text-sm text-gray-600 mb-2 mt-4 font-sans text-right">
          موقعیت را روی نقشه انتخاب کنید:
        </Text>

        {/* Map Container */}
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
                ? { ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 }
                : initialRegion
            }
            onPress={handleSelectLocation}
            showsUserLocation={true}
            showsMyLocationButton={true}
            // cameraZoomRange={0}
            showsScale={false}
            showsBuildings
            showsCompass={false}
          >
            {location && (
              <>
                <Marker coordinate={location} />
                {/* Circle (Radius) */}
                {range && (

                  <>
                  <Circle
                    center={location}
                    radius={parseInt(range, 10)} // Convert range to number and use as radius
                    strokeColor="rgba(0, 0, 255, 0.5)"
                    fillColor="rgba(0, 0, 255, 0.1)"
                  />
                  </>

                )}
              </>
            )}
          </MapView>
        </View>

        {/* Coordinate + Address Card */}
        {location && (
          <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-gray-600 font-sans text-right">
              📍 مختصات انتخاب‌شده:{" "}
              <Text className="text-xs text-gray-500 font-sans">
                {location.latitude.toFixed(6)} / {location.longitude.toFixed(6)}
              </Text>
            </Text>
          </View>
        )}

        {/* Save button */}
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3"
          onPress={() => {
            if (name && location && range) {
              const newItem = {
                id: locations.length + 1,
                name,
                range: parseInt(range, 10), // Store range as number
                ...location,
              };
              setLocations([...locations, newItem]);
              setName("");
              setRange(""); // Clear the range input
              setLocation(null);
              onClose();
            }
          }}
        >
          <Text className="text-white text-center font-sans text-base">
            ذخیره موقعیت
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default AddLocation;
