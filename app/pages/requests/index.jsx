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
import EditRequest from "../../../components/admin/requests/EditRequest";
import Loading from "../../../components/loading/Loading";
import CardComponent from "../../../components/shared/CardComponent";
import ApiServiece from "../../../services/apiService";
import RequestsSkeleton from "../../../components/loading/Skeleton/Admin/Requests/RequestsSkeleton";
import Wraper from "../../../components/shared/Wraper";

const Index = () => {
  const [addmodalVisible, setAddModalVisible] = useState(false);
  const [showModalVisible, setShowModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [requestData, setRequestData] = useState();

  const toJalaliDate = (isoDate) => {
    if (!isoDate) return "";
    return moment(isoDate).format("jYYYY/jMM/jDD");
  };

  const getRequests = async () => {
    setRefreshing(true);
    try {
      const response = await ApiServiece.get("/customer/requests");
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

const prepareModal = (
  id,
  requestType,
  startDate,
  endDate,
  status,
  customerNote,
  userNote
) => {
  setRequestData({
    id,
    requestType,
    startDate,
    endDate,
    status,
    customerNote,
    userNote,
  });
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
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              {requests.map((req) => (
                <TouchableOpacity
                  key={req._id}
                  onPress={() => {
                    setShowModalVisible(true);
                    prepareModal(
                      req?._id,
                      req?.requestType,
                      req?.startDate,
                      req?.endDate,
                      req?.status,
                      req?.customerNote,
                      req?.userNote
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

                      {/* ✅ NEW: Creator name */}
                      <Text className="text-xs mt-1 text-right text-gray-500 font-sans">
                        درخواست توسط: {req?.user?.name || "نامشخص"}
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

      <EditRequest
        visible={showModalVisible}
        onClose={() => setShowModalVisible(false)}
        requestData={requestData}
        onSuccess={getRequests}
      />
    </Wraper>
  );
};

export default Index;
