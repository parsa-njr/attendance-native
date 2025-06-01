import React from "react";
import { View, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { Skeleton } from "moti/skeleton";

const screenWidth = Dimensions.get("window").width;

const DashboardSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="p-5 space-y-8 mt-9"
      >
        {/* Greeting Card */}
        <View className="bg-white p-5 rounded-2xl flex-row-reverse items-center shadow-sm mb-3">
          <Skeleton width={64} height={64} radius="round" colorMode="light" />
          <View className="flex-1 mr-4">
            <View className="mb-2">
              <Skeleton
                height={20}
                width={"70%"}
                radius="round"
                colorMode="light"
              />
            </View>
            <Skeleton
              height={16}
              width={"50%"}
              radius="round"
              colorMode="light"
            />
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between">
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              className="w-[48%] bg-white p-4 rounded-2xl mb-4 shadow-sm"
            >
              <View className="mb-2">
                <Skeleton
                  height={32}
                  width={"40%"}
                  radius="round"
                  colorMode="light"
                />
              </View>
              <Skeleton
                height={16}
                width={"60%"}
                radius="round"
                colorMode="light"
                className="mt-3"
              />
            </View>
          ))}
        </View>

        {/* Chart Skeleton */}
        <View>
         
          <View className="bg-white p-4 rounded-2xl shadow-sm mb-2">
            <Skeleton
              height={220}
              width={screenWidth - 40}
              radius="round"
              colorMode="light"
            />
          </View>
        </View>

        {/* Latest Activity */}
        <View>
        
          {[...Array(3)].map((_, i) => (
            <View key={i} className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
              <Skeleton
                height={16}
                width={"90%"}
                radius="round"
                colorMode="light"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardSkeleton;
