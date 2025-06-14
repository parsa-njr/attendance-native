import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import CardComponent from "@/components/shared/CardComponent";
import { Menu, Provider, Divider } from "react-native-paper";
import AddLocation from "../../../../components/admin/locations/AddLocation";
import AddButton from "../../../../components/shared/buttons/AddButton";
import ApiService from "@/services/apiService";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locations, setLocations] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenuUserId, setOpenMenuUserId] = useState(null);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = locations?.filter((location) =>
        location?.name.toLowerCase().includes(text.toLowerCase())
      );
      setLocations(filtered);
    } else {
      getLocations();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  const getLocations = async () => {
    try {
      setRefreshing(true);
      const response = await ApiService.get("/customer/locations");
      setLocations(response.data.data);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const handleDelete = (id) => {
    setLocations(locations.filter((item) => item.id !== id));
    setMenuVisibleId(null);
  };

  const handleEdit = (id) => {
    console.log("Edit location", id);
    setMenuVisibleId(null);
  };

  useFocusEffect(
    useCallback(() => {
      getLocations();
    }, [])
  );

  const LocationCard = ({ item }) => {
    const isMenuVisible = openMenuUserId === item._id;
    const openMenu = () => setOpenMenuUserId(item._id);
    const closeMenu = () => setOpenMenuUserId(null);
    return (
      <View className="bg-white mx-4 my-[1px] p-4 rounded-2xl shadow-md flex-row-reverse items-center space-x-4 space-x-reverse">
        {/* Map Thumbnail */}
        <View className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm ml-4">
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
          />
        </View>

        {/* Info & Actions */}
        <View className="flex-1 mr-1">
          <View className="flex-row-reverse justify-between items-center mb-1">
            <Text className="text-base  text-gray-800 font-sans text-right">
              {item.name}
            </Text>
          </View>

          <Text
            className={`text-sm font-medium ${getStatusColor(
              item.status
            )} text-right`}
          >
            {item.status}
          </Text>
        </View>

        {/* Action Menu */}
        <Menu
          visible={isMenuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} className="ml-2 p-2">
              <Ionicons name="ellipsis-vertical" size={26} color="#9CA3AF" />
            </TouchableOpacity>
          }
          contentStyle={{
            borderRadius: 12,
            backgroundColor: "#fff",
            elevation: 6,
          }}
        >
          <Menu.Item
            onPress={() => {}}
            title="مشاهده پروفایل"
            titleStyle={{
              fontWeight: "600",
              color: "#1F2937",
              fontFamily: "sans",
              textAlign: "right",
            }}
            leadingIcon={({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            )}
          />
          <Menu.Item
            onPress={() => {
              seteditModalVisible(true);
              closeMenu();
              readyEditModal(
                item?._id,
                item?.name,
                item?.phone,
                item?.location._id,
                item?.shift._id
              );
            }}
            title="ویرایش"
            titleStyle={{
              fontWeight: "600",
              color: "#1F2937",
              fontFamily: "sans",
              textAlign: "right",
            }}
            leadingIcon={({ size, color }) => (
              <Ionicons name="pencil-outline" size={size} color={color} />
            )}
          />

          <Divider />
          <Menu.Item
            onPress={() => {
              setDeleteUserId(item._id);
              setOpenMenuUserId(null);
              closeMenu();
              setShowDialog(true);
            }}
            title="حذف"
            titleStyle={{
              fontWeight: "600",
              color: "#DC2626",
              fontFamily: "sans",
              textAlign: "right",
            }}
            leadingIcon={({ size }) => (
              <Ionicons name="trash-outline" size={size} color="#DC2626" />
            )}
          />
        </Menu>
      </View>
    );
  };

  return (
    <Provider>
      <SafeAreaView className="flex-1 bg-gray-50 relativ">
        {/* Search Bar */}
        <View className="px-5 pt-8 pb-4 mb-4 bg-white shadow-sm">
          <TextInput
            className="h-12 bg-gray-100 rounded-full px-5 text-base text-gray-800 shadow-inner text-right font-sans mt-6"
            placeholder="جستجو..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {/* Location List */}
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={locations}
          keyExtractor={(item) => item._id.toString()}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => <LocationCard item={item} />}
        />

        {/* Floating Add Button */}
        <AddButton onPress={() => setModalVisible(true)} />

        {/* Add Modal */}
        <AddLocation
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </Provider>
  );
};

export default Index;
