import React from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Skeleton } from "moti/skeleton";

const EmployeeDashboardSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5 space-y-8">
        {/* Profile Header */}
        <View className="flex-row-reverse items-center space-x-reverse space-x-4 bg-white p-5 rounded-2xl shadow-lg elevation-6 mt-10">
          <Skeleton width={64} height={64} radius="round" colorMode="light" />
          <View className="flex-1 space-y-2">
            <View className="mb-4">
              <Skeleton
                height={20}
                width={"70%"}
                radius="round"
                colorMode="light"
              />
            </View>
            <View className="mb-4">
              <Skeleton
                height={16}
                width={"50%"}
                radius="round"
                colorMode="light"
              />
            </View>
          </View>
        </View>

        {/* Check-in Section */}
        <View className="bg-white p-5 rounded-2xl shadow-lg elevation-6 items-center mt-8">
          <View className="mb-3">
            <Skeleton
              height={20}
              width={160}
              radius="round"
              colorMode="light"
            />
          </View>
          <Skeleton width={105} height={105} radius="round" colorMode="light" />
        </View>

        {/* Motivational Quote */}
        <View className="bg-white p-5 rounded-2xl shadow-lg elevation-6 mt-8">
          <View className="mb-4">
            <Skeleton
              height={24}
              width={160}
              radius="round"
              colorMode="light"
            />
          </View>
          <View className="mb-2">
            <Skeleton
              height={16}
              width={"100%"}
              radius="round"
              colorMode="light"
            />
          </View>
          <View className="mb-2">
            <Skeleton
              height={16}
              width={"90%"}
              radius="round"
              colorMode="light"
            />
          </View>
        </View>

        {/* Summary Cards */}
        <View className="flex-row-reverse mt-8">
          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              className="flex-1 bg-white p-4 rounded-2xl shadow-lg elevation-6 items-center space-y-2 mx-3"
            >
              <View className="mb-2">
                <Skeleton
                  height={28}
                  width={30}
                  radius="round"
                  colorMode="light"
                />
              </View>
              <View>
                <Skeleton
                  height={12}
                  width={50}
                  radius="round"
                  colorMode="light"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeDashboardSkeleton;
