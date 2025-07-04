import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
// import AddUser from "../../../../components/admin/users/AddUser";
import AddButton from "../../../../components/shared/buttons/AddButton";
import ShiftForm from "../../../../components/admin/shift/ShiftForm";
import CardComponent from "../../../../components/shared/CardComponent";
import Wraper from "../../../../components/shared/Wraper";
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
  const [newUser, setNewUser] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
  });

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-500";

      case "inactive":
        return "text-orange-500";

      default:
        return "text-yellow-400";
    }
  };

  const translateStatus = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "فعال";
      case "inactive":
        return "غیرفعال";
      default:
        return "تعیین وظعیت نشده";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 relative">
      {/* Search Bar */}
      <View className="px-5 pt-8 pb-4 bg-white shadow-sm mt-6">
        <TextInput
          className="h-12 bg-gray-100 rounded-full px-5 text-base text-gray-800 shadow-inner text-right font-sans"
          placeholder="جستجو..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* User List */}
      {data?.map((item) => (
        <>
          <CardComponent
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow-sm flex-row-reverse justify-between items-center 
             mx-1 mt-3"
          >
            <View>
              <Text className="text-lg text-right font-sans text-gray-800">
                {item.name}
              </Text>
              <Text className="text-sm text-right text-gray-500 font-sans">
                {item.date}
              </Text>
            </View>
            <Text
              className={`text-sm font-sans ${getStatusColor(item.status)}`}
            >
              {translateStatus(item.status)}
            </Text>
          </CardComponent>
        </>
      ))}
      {/* <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={users}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-200 mx-5" />
        )}
        renderItem={({ item }) => (
          <View className="flex-row-reverse items-center px-4 py-3 bg-white">
            <View className="flex-1 mr-4 border-b border-gray-100 pb-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-gray-400 text-left">9:58 AM</Text>
                <Text className="text-base font-semibold text-gray-800 font-sans text-right">
                  {item.name}
                </Text>
              </View>
              <Text
                className={`text-sm mt-1 ${getStatusColor(
                  item.status
                )} text-right`}
              >
                {translateStatus(item.status)}
              </Text>
            </View>
          </View>
        )}
      /> */}

      {/* Floating Add Button */}
      <AddButton onPress={() => setModalVisible(true)} />

      {/* BottomSheet Modal */}
      <ShiftForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Index;
