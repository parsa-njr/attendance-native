import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import ProfileSkeleton from "../../../../components/loading/Skeleton/Employee/Dashboard/DashboardSkeleton";
import LottieView from "lottie-react-native";
import { showMessage } from "react-native-flash-message";
import {
  Menu,
  Divider,
  Provider,
  Dialog,
  Portal,
  Button,
} from "react-native-paper";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Loading from "../../../../components/loading/Loading";
import AddUser from "../../../../components/admin/users/AddUser";
import AddButton from "../../../../components/shared/buttons/AddButton";
import ApiService from "@/services/apiService";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = users?.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
      setUsers(filtered);
    } else {
      fetchUsers();
    }
  };

  const onRefresh = () =>
    new Promise((resolve) => {
      setRefreshing(true);
      setTimeout(() => {
        fetchUsers();
        setRefreshing(false);
        resolve();
      }, 150);
    });

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      const timeout = setTimeout(() => {
        fetchUsers();
        setRefreshing(false);
      }, 150);

      return () => clearTimeout(timeout);
    }, [])
  );

  const fetchUsers = () => {
    ApiService.get("/admin/get-users")
      .then((resp) => {
        setUsers(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    ApiService.delete(`/admin/delete-user/${id}`)
      .then((response) => {
        const message = response.data.message;
        showMessage({
          message: "موفقیت آمیز بود",
          description: `${message}`,
          type: "success",
          icon: "success",
        });

        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      })
      .catch((error) => {
        const message = error?.response?.data?.errorDetails;
        showMessage({
          message: "مشکلی پیش آمد",
          description: message,
          type: "danger",
          icon: "danger",
        });
      });
  };

  const renderUserItem = ({ item }) => {
    const isMenuVisible = openMenuUserId === item._id;
    const openMenu = () => setOpenMenuUserId(item._id);
    const closeMenu = () => setOpenMenuUserId(null);

    return (
      <View className="flex-row-reverse items-center px-4 py-4 bg-white rounded-2xl mx-4 my-2 shadow-md">
        <TouchableOpacity
          onPress={() => {}}
          className="w-16 h-16 rounded-full border-2 border-blue-500 overflow-hidden shadow-sm"
        >
          {item?.image ? (
            <Image
              source={{ uri: item.image }}
              className="w-full h-full rounded-full"
            />
          ) : (
            <View
              className="w-full h-full rounded-full bg-white justify-center items-center shadow-md"
              style={{
                backgroundColor: "#F3F4F6",
                shadowColor: "#E5E7EB",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Ionicons name="person-outline" size={32} color="#9CA3AF" />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-1 mr-4 border-b border-gray-100 pb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-gray-400 text-left font-light">
              9:58 AM
            </Text>
            <Text className="text-lg font-semibold text-gray-900 font-sans text-right">
              {item.name}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View />
            <Text className="text-sm text-gray-500 text-right">
              {item.phone}
            </Text>
          </View>
        </View>

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
            onPress={() => {}}
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

  if (refreshing) {
    return <ProfileSkeleton />;
  }

  return (
    <Provider>
      <Loading onRefresh={onRefresh}>
        {() => (
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

            {Array.isArray(users) && users.length === 0 ? (
              <View className="flex-1 justify-center items-center mt-10">
                <LottieView
                  source={require("../../../../assets/animations/Animation - 1745703881904 (1).json")} // Replace with your actual Lottie file
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />
                <Text className="text-gray-500 mt-4 text-lg font-sans">
                  هیچ کاربری یافت نشد
                </Text>
              </View>
            ) : (
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={users}
                keyExtractor={(item) => item._id.toString()}
                ItemSeparatorComponent={() => (
                  <View className="h-px bg-gray-200 mx-5" />
                )}
                renderItem={renderUserItem}
              />
            )}

            <AddButton onPress={() => setModalVisible(true)} />

            <AddUser
              onSuccess={() => {
                fetchUsers();
              }}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />

            {/* Delete Confirmation Dialog */}
            <Portal>
              <Dialog
                visible={showDialog}
                onDismiss={() => {
                  setShowDialog(false);
                  setDeleteUserId(null);
                }}
                style={{
                  borderRadius: 20,
                  backgroundColor: "#fff",
                  marginHorizontal: 20,
                  elevation: 4, // For Android shadow
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                }}
              >
                <Dialog.Content
                  style={{ alignItems: "center", paddingBottom: 0 }}
                >
                  <LottieView
                    source={require("../../../../assets/animations/Animation - 1748713787150.json")}
                    autoPlay
                    loop
                    style={{ width: 150, height: 150, marginBottom: -12 }}
                  />
                  <Text
                    style={{
                      fontFamily: "sans",
                      fontSize: 17,
                      color: "#1F2937", // Tailwind gray-800
                      textAlign: "center",
                      marginTop: 8,
                      marginBottom: 20,
                    }}
                  >
                    آیا از حذف این کاربر مطمئن هستید؟
                  </Text>
                </Dialog.Content>

                <Dialog.Actions
                  style={{
                    justifyContent: "space-around",
                    paddingBottom: 20,
                    paddingHorizontal: 10,
                  }}
                >
                  <Button
                    textColor="#6b7280"
                    onPress={() => {
                      setShowDialog(false);
                      setDeleteUserId(null);
                    }}
                    mode="outlined"
                    labelStyle={{
                      fontFamily: "sans",

                      fontSize: 15,
                    }}
                  >
                    لغو
                  </Button>

                  <Button
                    onPress={() => {
                      setShowDialog(false);
                      if (deleteUserId) {
                        handleDelete(deleteUserId);
                        setDeleteUserId(null);
                      }
                    }}
                    mode="contained"
                    labelStyle={{
                      fontFamily: "sans",

                      fontSize: 15,
                    }}
                  >
                    بله، حذف کن
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </SafeAreaView>
        )}
      </Loading>
    </Provider>
  );
};

export default Index;
