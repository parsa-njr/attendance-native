import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import LocationSkeleton from "../../../../components/loading/Skeleton/Admin/Location/LocationSkeleton";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import CardComponent from "@/components/shared/CardComponent";
import { Menu, Provider, Divider } from "react-native-paper";
import AddLocation from "../../../../components/admin/locations/AddLocation";
import EditLocation from "../../../../components/admin/locations/EditLocation";
import AddButton from "../../../../components/shared/buttons/AddButton";
import ApiService from "@/services/apiService";
import Loading from "../../../../components/loading/Loading";
import Alert from "../../../../components/shared/alert/Alert";
import { showMessage } from "react-native-flash-message";
const Index = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [addModalVisible, setaddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [locations, setLocations] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const [locationData, setLocationData] = useState();

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

  const handleDelete = async (id) => {
    try {
      const response = await ApiService.delete(`/customer/locations/${id}`);
      const message = response.data.message;

      showMessage({
        message: "موفقیت آمیز بود",
        description: `${message}`,
        type: "success",
        icon: "success",
      });

      setLocations((prevLocations) =>
        prevLocations.filter((location) => location._id !== id)
      );
    } catch (error) {
      const message =
        error?.response?.data?.errorDetails || "خطای ناشناخته‌ای رخ داده است.";
      showMessage({
        message: "مشکلی پیش آمد",
        description: message,
        type: "danger",
        icon: "danger",
      });
    }
  };

  const readyEditModal = (id, name, range, long, lat) => {
    setLocationData({
      id,
      name,
      range,
      long,
      lat,
    });
  };

  useFocusEffect(
    useCallback(() => {
      getLocations();
    }, [])
  );

  const onRefresh = () =>
    new Promise(() => {
      setRefreshing(true);
      getLocations();
    });

  const LocationCard = ({ item }) => {
    const isMenuVisible = openMenuUserId === item._id;
    const openMenu = () => setOpenMenuUserId(item._id);
    const closeMenu = () => setOpenMenuUserId(null);

    return (
      <View className="flex-row-reverse items-center px-4 py-4 bg-white rounded-2xl mx-4 my-2 shadow-md">
        {/* Map Thumbnail with slight press effect */}
        <View
          className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-sm ml-4"
          android_ripple={{ color: "#e0f2fe", borderless: false }}
          style={{
            borderRadius: 18,
          }}
        >
          <MapView
            style={{ flex: 1 }}
            mapType="standard"
            initialRegion={{
              latitude: item.latitude,
              longitude: item.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            liteMode={true}
          >
            <Marker
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
            />
          </MapView>
        </View>

        {/* Info */}
        <View className="flex-1 mr-2">
          <Text className="text-base font-sans text-gray-800 text-right mb-1">
            {item.name}
          </Text>

          <View className="flex-row-reverse items-center space-x-1 space-x-reverse">
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-500 text-right font-sans">
              {item.latitude.toFixed(4)} / {item.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Menu Icon */}
        <Menu
          visible={isMenuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} className="ml-1 p-2">
              <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          }
          contentStyle={{
            borderRadius: 14,
            backgroundColor: "#fff",
            elevation: 10,
          }}
        >
          <Menu.Item
            onPress={() => {}}
            title="مشاهده پروفایل"
            titleStyle={{
              fontWeight: "600",
              fontFamily: "sans",
              color: "#1F2937",
              textAlign: "right",
            }}
            leadingIcon={({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            )}
          />

          <Menu.Item
            onPress={() => {
              setEditModalVisible(true);
              closeMenu();
              readyEditModal(
                item?._id,
                item?.name,
                item?.range,
                item?.longitude,
                item?.latitude
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
              setDeleteLocationId(item._id);
              closeMenu();
              setShowDialog(true);
              setOpenMenuUserId(null);
            }}
            title="حذف"
            titleStyle={{
              fontWeight: "600",
              fontFamily: "sans",
              color: "#DC2626",
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

  if (refreshing) {
    return <LocationSkeleton />;
  }

  return (
    <Provider>

        <SafeAreaView className="flex-1 bg-gray-50 relative">
          <Loading onRefresh={onRefresh}>
            {() => (
              <>
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
                  ItemSeparatorComponent={() => (
                    <View className="h-px bg-gray-200 mx-5" />
                  )}
                  renderItem={({ item }) => <LocationCard item={item} />}
                />
              </>
            )}
          </Loading>

          {/* Floating Add Button - outside of scroll */}
          <AddButton onPress={() => setaddModalVisible(true)} />

          {/* Add Modal */}
          <AddLocation
            visible={addModalVisible}
            onSuccess={getLocations}
            onClose={() => setaddModalVisible(false)}
          />

          <EditLocation
            visible={editModalVisible}
            onSuccess={getLocations}
            onClose={() => setEditModalVisible(false)}
            locationData={locationData}
          />

          <Alert
            visible={showDialog}
            onDismiss={() => setShowDialog(false)}
            onConfirm={() => {
              setShowDialog(false);
              handleDelete(deleteLocationId);
            }}
            mode="warning" // animation for logout confirmation
            title="می خواهید این موقعیت را حذف کنید؟"
            cancelText="خیر"
            confirmText="بله، حذف کن"
          />
        </SafeAreaView>
   
    </Provider>
  );
};

export default Index;
