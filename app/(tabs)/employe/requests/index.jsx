import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import RequestForm from "../../../../components/employee/requests/RequestForm";
import AddButton from "../../../../components/shared/buttons/AddButton";

const mockRequests = [
  { id: 1, type: "مرخصی", date: "1404/02/15", status: "pending" },
  { id: 2, type: "دورکاری", date: "1404/02/12", status: "accepted" },
  { id: 3, type: "دورکاری", date: "1404/02/12", status: "accepted" },
  { id: 4, type: "دورکاری", date: "1404/02/12", status: "pending" },
];

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [requestList, setRequestList] = useState(mockRequests);
  const [search, setSearch] = useState("");

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = requestList.filter((item) =>
        item.type.toLowerCase().includes(text.toLowerCase())
      );
      setRequestList(filtered);
    } else {
        setRequestList(mockRequests);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "text-green-500";
      case "rejected":
        return "text-red-400";
      case "pending":
        return "text-yellow-500";

      default:
        return "text-gray-500";
    }
  };
  const translateStatus = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "پذیرفته شده";
      case "rejected":
        return "رد شده";
      case "pending":
        return "در حال بررسی";

      default:
        return "تعیین وظعیت نشده";
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 pt-10">
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

      <ScrollView className="space-y-4">
        {requestList.map((req) => (
          <View
            key={req.id}
            className="bg-white p-4 rounded-2xl shadow-sm flex-row-reverse justify-between items-center 
            my-1"
          >
            <View>
              <Text className="text-lg text-right font-sans text-gray-800">
                {req.type}
              </Text>
              <Text className="text-sm text-right text-gray-500 font-sans">
                {req.date}
              </Text>
            </View>
            <Text className={`text-sm font-sans ${getStatusColor(
                  req.status
                )}`}>
              {translateStatus(req.status) }
            </Text>
          </View>
        ))}
      </ScrollView>


      <AddButton  onPress={() => setModalVisible(true)}/>
      <RequestForm
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Index;
