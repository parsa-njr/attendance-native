import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Menu, Provider } from "react-native-paper";
import AddLocation from "../../../../components/admin/locations/AddLocation";
import AddButton from "../../../../components/shared/buttons/AddButton";

const Index = () => {
  const data = [
    {
      id: 1,
      name: "دفتر مرکزی",
      status: "Active",
      latitude: 35.6892,
      longitude: 51.389,
    },
    {
      id: 2,
      name: "انبار شمالی",
      status: "Inactive",
      latitude: 35.73,
      longitude: 51.45,
    },
    {
      id: 3,
      name: "کارگاه صنعتی",
      status: "Restricted",
      latitude: 35.7,
      longitude: 51.3,
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [locations, setLocations] = useState(data);
  const [search, setSearch] = useState("");
  const [menuVisibleId, setMenuVisibleId] = useState(null);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = data.filter((location) =>
        location.name.toLowerCase().includes(text.toLowerCase())
      );
      setLocations(filtered);
    } else {
      setLocations(data);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-500";
      case "inactive":
        return "text-gray-400";
      case "restricted":
        return "text-red-400";
      default:
        return "text-black";
    }
  };

  const handleDelete = (id) => {
    setLocations(locations.filter((item) => item.id !== id));
    setMenuVisibleId(null);
  };

  const handleEdit = (id) => {
    // Trigger edit logic here
    console.log("Edit location", id);
    setMenuVisibleId(null);
  };

  return (
    <Provider>
      <SafeAreaView className="flex-1 bg-gray-50 relative">
        {/* Search Bar */}
        <View className="px-5 pt-8 pb-4 bg-white shadow-sm mt-6">
          <TextInput
            className="h-12 bg-gray-100 rounded-full px-5 text-base text-gray-800 shadow-inner text-right font-sans"
            placeholder="جستجو مکان‌ها..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {/* Location List */}
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-200 mx-5" />
          )}
          renderItem={({ item }) => (
            <View className="flex-row-reverse items-center px-4 py-3 bg-white">
              {/* Map Thumbnail */}
              <View
                className="w-16 h-16 rounded-lg overflow-hidden border border-blue-400"
                style={{ marginLeft: 16 }}
              >
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                ></MapView>
              </View>

              <View className="flex-1 mr-2 border-b border-gray-100 pb-3">
                <View className="flex-row justify-between items-center">
                  <Menu
                    visible={menuVisibleId === item.id}
                    onDismiss={() => setMenuVisibleId(null)}
                    anchor={
                      <TouchableOpacity
                        onPress={() => setMenuVisibleId(item.id)}
                      >
                        <Text className="text-2xl text-gray-500">⋯</Text>
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      onPress={() => handleEdit(item.id)}
                      title="ویرایش"
                    />
                    <Menu.Item
                      onPress={() => handleDelete(item.id)}
                      title="حذف"
                    />
                  </Menu>
                  <Text className="text-base font-semibold text-gray-800 font-sans text-right">
                    {item.name}
                  </Text>

                  {/* Action Menu */}
                </View>
                <Text
                  className={`text-sm mt-1 ${getStatusColor(
                    item.status
                  )} text-right`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          )}
        />

        {/* Floating Add Button */}
        <AddButton  onPress={() => setModalVisible(true)}/>

        {/* <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-6 right-6 w-16 h-16 bg-blue-500 rounded-full justify-center items-center shadow-lg"
          style={{
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
        >
          <Text className="text-white text-4xl">+</Text>
        </TouchableOpacity> */}
        <AddLocation
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </Provider>
  );
};

export default Index;
