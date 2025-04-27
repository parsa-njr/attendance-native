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
import AddUserModal from "../../../components/modals/AddUserModal";

const Index = () => {
  const data = [
    {
      id: 1,
      image: "https://bootdey.com/img/Content/avatar/avatar1.png",
      name: "Frank Odalthh",
      status: "Online",
    },
    {
      id: 2,
      image: "https://bootdey.com/img/Content/avatar/avatar6.png",
      name: "John DoeLink",
      status: "Offline",
    },
    {
      id: 3,
      image: "https://bootdey.com/img/Content/avatar/avatar7.png",
      name: "March SoulLaComa",
      status: "Busy",
    },
    {
      id: 4,
      image: "https://bootdey.com/img/Content/avatar/avatar2.png",
      name: "Finn DoRemiFaso",
      status: "Away",
    },
    {
      id: 5,
      image: "https://bootdey.com/img/Content/avatar/avatar3.png",
      name: "Maria More More",
      status: "Online",
    },
    {
      id: 6,
      image: "https://bootdey.com/img/Content/avatar/avatar4.png",
      name: "Clark June Boom!",
      status: "Offline",
    },
    {
      id: 7,
      image: "https://bootdey.com/img/Content/avatar/avatar5.png",
      name: "The Googler",
      status: "Online",
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState(data);
  const [search, setSearch] = useState("");

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
      case "online":
        return "text-green-500";
      case "offline":
        return "text-gray-400";
      case "busy":
        return "text-orange-500";
      case "away":
        return "text-sky-400";
      default:
        return "text-black";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 relative">
      {/* Search Bar */}
      <View className="px-5 pt-8 pb-4 bg-white shadow-sm mt-6 ">
        <TextInput
          className="h-12 bg-gray-100 rounded-full px-5 text-base text-gray-800 shadow-inner"
          placeholder="Search users..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* User List */}
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={users}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-200 mx-5" />
        )}
        renderItem={({ item }) => (
          <View className="flex-row items-center px-4 py-3 bg-white">
            <TouchableOpacity
              onPress={() => {}} // 👈 EMPTY, no navigation call
              className="w-14 h-14 rounded-full border-2 border-blue-500 overflow-hidden"
            >
              <Image
                source={{ uri: item.image }}
                className="w-full h-full rounded-full"
              />
            </TouchableOpacity>
        
            <View className="flex-1 ml-4 border-b border-gray-100 pb-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
                <Text className="text-xs text-gray-400">9:58 AM</Text>
              </View>
              <Text className={`text-sm mt-1 ${getStatusColor(item.status)}`}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
        
      />

      {/* Floating Add Button */}
      <TouchableOpacity
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
      </TouchableOpacity>

      {/* Add User Modal */}
      <AddUserModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
};

export default Index;
