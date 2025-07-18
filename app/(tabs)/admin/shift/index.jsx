import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AddButton from "../../../../components/shared/buttons/AddButton";
import ShiftForm from "../../../../components/admin/shift/ShiftForm";
import CardComponent from "../../../../components/shared/CardComponent";
import Wraper from "../../../../components/shared/Wraper";
import Alert from "../../../../components/shared/modal/Alert";

import Wrapper from "../../../../components/shared/Wraper";
import Loading from "../../../../components/loading/Loading";
import RequestsSkeleton from "../../../../components/loading/Skeleton/Employee/Requests/RequestsSkeleton";
import { useFocusEffect } from "@react-navigation/native";
import ApiService from "@/services/apiService";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider, Menu } from "react-native-paper";
import moment from "moment-jalaali";
import { showMessage } from "react-native-flash-message";
import { toJalaliDate } from "../../../../utils/dateFunctions";
import { customToast } from "../../../../components/shared/toast/CustomeToast";

const Index = () => {
  const data = [
    {
      id: 1,
      name: "شیفت اصلی",
      status: "active",
      startDate: "1/1/1403",
      endDate: "1/11404",
    },
    {
      id: 2,
      name: "شیفت فرعی",
      status: "active",
      startDate: "1/1/1403",
      endDate: "1/11404",
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState(data);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mode, setMode] = useState(null);

  const getShiftList = async () => {
    try {
      const response = await ApiService.get("/customer/shifts");
      const data = response.data.data;

      console.log("shiftData : ", data);
      setShiftList(data);
      setRefreshing(false);
    } catch (error) {
      console.log("error", error);
      setRefreshing(false);
    }
  };
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = data.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
      setUsers(filtered);
    } else {
      setUsers(data);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await ApiService.delete(`/customer/shifts/${id}`);

      customToast({
        title: "حذف با موفقیت انجام شد",
        type: "success",
        delay: 400, // ⏱️ delay in ms
      });

      getShiftList();
    } catch (error) {
      const message =
        error?.response?.data?.errorDetails || "خطای ناشناخته‌ای رخ داده است.";
      customToast({
        title: "مشکلی پیش آمد",
        type: "danger",
        description: message,
        delay: 300, // ⏱️ delay in ms
      });
    }
  };

  const onRefresh = () => {
    getShiftList();
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      getShiftList();
    }, [])
  );
  const [isMenuOpen, setIsMenuOpen] = useState(null);

  const renderShiftItem = ({ item }) => {
    const isMenuVisible = isMenuOpen === item._id;
    const openMenu = () => setIsMenuOpen(item._id);
    const closeMenu = () => setIsMenuOpen(null);

    return (
      <View className="px-4 py-4 bg-white rounded-2xl mx-4 my-2 shadow-md">
        <View className="flex-row-reverse justify-between items-start">
          {/* Texts */}
          <View className="flex-1 ml-4">
            {/* Shift Name */}
            <Text className="text-lg font-semibold text-gray-900 mb-3 text-right font-sans">
              {item.shiftName}
            </Text>

            {/* Divider */}
            <View className="h-px bg-gray-200 opacity-70 mb-3" />

            {/* Dates */}
            <View className="flex-row-reverse justify-between">
              <View className="flex-col items-end">
                <Text className="text-sm text-gray-400 mb-1 font-sans">
                  از تاریخ
                </Text>
                <Text className="text-md text-gray-500 font-medium">
                  {toJalaliDate(item?.startDate)}
                </Text>
              </View>

              <View className="flex-col items-end">
                <Text className="text-sm text-gray-400 mb-1 font-sans">
                  تا تاریخ
                </Text>
                <Text className="text-md text-gray-500 font-medium">
                  {toJalaliDate(item?.endDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Icon */}
          <Menu
            visible={isMenuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} className="p-2">
                <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            }
            contentStyle={{
              borderRadius: 12,
              backgroundColor: "#fff",
              elevation: 6,
            }}
          >
            <Menu.Item
              onPress={() => {
                setFormData(item);
                setMode("edit");
                setModalVisible(true);
                closeMenu();
              }}
              title="ویرایش"
              titleStyle={{
                fontWeight: "500",
                color: "#1F2937",
                textAlign: "right",
                fontFamily: "sans",
              }}
              leadingIcon={({ size, color }) => (
                <Ionicons name="pencil-outline" size={size} color={color} />
              )}
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setDeleteUserId(item._id);
                // setOpenMenuUserId(null);
                closeMenu();
                setShowDialog(true);
              }}
              title="حذف"
              titleStyle={{
                fontWeight: "500",
                color: "#DC2626",
                textAlign: "right",
                fontFamily: "sans",
              }}
              leadingIcon={({ size }) => (
                <Ionicons name="trash-outline" size={size} color="#DC2626" />
              )}
            />
          </Menu>
        </View>
      </View>
    );
  };
  if (refreshing) return <RequestsSkeleton />;

  return (
    <>
      <Wrapper className="flex-1 bg-gray-50 relative">
        <Loading onRefresh={onRefresh}>
          {() => (
            <>
              <SafeAreaView className="flex-1 bg-gray-50 relative">
                <View className="px-5 pt-8 pb-4 bg-white shadow-sm ">
                  <TextInput
                    className="h-12 bg-gray-100 rounded-full px-5 text-base text-gray-800 shadow-inner text-right font-sans mt-6"
                    placeholder="جستجو..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={handleSearch}
                  />
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                  {Array.isArray(shiftList) && shiftList.length === 0 ? (
                    <>
                      <View className="flex-1 justify-center items-center mt-10">
                        <LottieView
                          source={require("../../../../assets/animations/Animation - 1745703881904 (1).json")} // Replace with your actual Lottie file
                          autoPlay
                          loop
                          style={{ width: 200, height: 200 }}
                        />
                        <Text className="text-gray-500 mt-4 text-lg font-sans">
                          موردی یافت نشد
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <FlatList
                        contentContainerStyle={{ paddingBottom: 100 }}
                        data={shiftList}
                        keyExtractor={(item) => item._id.toString()}
                        ItemSeparatorComponent={() => (
                          <View className="h-px bg-gray-200 mx-5" />
                        )}
                        renderItem={renderShiftItem}
                      />
                    </>
                  )}
                </ScrollView>
              </SafeAreaView>
            </>
          )}
        </Loading>
        {/* Floating Add Button */}
        <AddButton
          onPress={() => {
            setModalVisible(true);
            setMode("add");
          }}
        />

        {/* BottomSheet Modal */}
        <ShiftForm
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          mode={mode || null}
          formData={formData || null}
          getList={() => getShiftList()}
        />

        {/* Delete Confirmation Dialog */}
        <Alert
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          onConfirm={() => {
            setShowDialog(false);
            handleDelete(deleteUserId);
          }}
          mode="warning"
          title="آیا از حذف این شیفت اطمینان دارید ؟"
          cancelText="خیر"
          confirmText="بله، حذف کن"
        />
      </Wrapper>
    </>
  );
};

export default Index;
