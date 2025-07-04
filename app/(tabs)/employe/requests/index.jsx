import React, { useState, useCallback } from "react";
import moment from "moment-jalaali";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AddRequest from "../../../../components/employee/requests/AddRequest";
import ShowRequest from "../../../../components/employee/requests/ShowRequest";
import Loading from "../../../../components/loading/Loading";
import AddButton from "../../../../components/shared/buttons/AddButton";
import CardComponent from "../../../../components/shared/CardComponent";
import ApiServiece from "../../../../services/apiService";
import RequestsSkeleton from "../../../../components/loading/Skeleton/Employee/Requests/RequestsSkeleton";
import Wraper from "../../../../components/shared/Wraper";

const Index = () => {
  const [addmodalVisible, setAddModalVisible] = useState(false);
  const [showModalVisible, setShowModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [requestData, setRequestData] = useState();
  const [search, setSearch] = useState("");

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = requests.filter((item) =>
        item.type.toLowerCase().includes(text.toLowerCase())
      );
      setRequests(filtered);
    } else {
      getRequests(); // fallback
    }
  };

  const toJalaliDate = (isoDate) => {
    if (!isoDate) return "";
    return moment(isoDate).format("jYYYY/jMM/jDD");
  };

  const getRequests = async () => {
    setRefreshing(true);
    try {
      const response = await ApiServiece.get("/user/requests");
      const data = response.data.data;
      setRequests(data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setRefreshing(false);
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
        return "تعیین وضعیت نشده";
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getRequests();
  };

  const prepareModal = (type, date, status, note) => {
    setRequestData({ type, date, status, note });
  };

  useFocusEffect(
    useCallback(() => {
      getRequests();
    }, [])
  );

  if (refreshing) return <RequestsSkeleton />;

  return (
    <Wraper className="flex-1 bg-gray-50 relative">
      <Loading onRefresh={onRefresh}>
        {() => (
          <>
            {/* Search Bar */}
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
              {requests.map((req) => (
                <TouchableOpacity
                  key={req.id}
                  onPress={() => {
                    setShowModalVisible(true);
                    prepareModal(
                      req?.requestType,
                      req?.createdAt,
                      req?.status,
                      req?.customer_note
                    );
                  }}
                  activeOpacity={0.8}
                  className="mx-2 mt-3"
                >
                  <CardComponent className="bg-white p-5 rounded-2xl shadow-md flex-row-reverse justify-between items-center border border-gray-100">
                    <View className="flex-1 pr-4">
                      <Text className="text-lg font-semibold text-right text-gray-900 font-sans">
                        {req?.requestType === "overtime"
                          ? "اضافه کاری"
                          : req?.requestType === "leave"
                          ? "مرخصی"
                          : "نامشخص"}
                      </Text>
                      <Text className="text-xs mt-1 text-right text-gray-400 font-sans">
                        تاریخ درخواست: {toJalaliDate(req.createdAt)}
                      </Text>
                    </View>

                    <View
                      className={`px-3 py-1 rounded-full ${
                        req.status === "accepted"
                          ? "bg-green-100"
                          : req.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium font-sans ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {translateStatus(req.status)}
                      </Text>
                    </View>
                  </CardComponent>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </Loading>

      <AddButton onPress={() => setAddModalVisible(true)} />

      <AddRequest
        visible={addmodalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={getRequests}
      />

      <ShowRequest
        visible={showModalVisible}
        onClose={() => setShowModalVisible(false)}
        requestData={requestData}
      />
    </Wraper>
  );
};

export default Index;
