import React from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Skeleton } from "moti/skeleton";

const ReportsSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5 space-y-8">
        {/*Date Selection */}
        <View className="bg-white p-5 rounded-2xl shadow-lg elevation-6 mt-10">
          <View className="flex-row gap-4 justify-between mx-6">
            <View className="flex-1">
              <Skeleton
                height={50}
                width="100%"
                radius="round"
                colorMode="light"
              />
            </View>
            <View className="flex-1">
              <Skeleton
                height={50}
                width="100%"
                radius="round"
                colorMode="light"
              />
            </View>
          </View>
        </View>

        {/* Attendance Records Section */}
        <View className="mt-8">
          {[...Array(2)].map((_, index) => (
            <View
              key={index}
              className="bg-white p-5 rounded-2xl shadow-lg elevation-6 mb-8"
            >
              {/* Expandable Details (Worked Hours, Absent Hours, etc.) */}
              <View className="mt-4 items-center justify-center">
                <View className="mb-3 w-[80%]">
                  <Skeleton
                    height={20}
                    width="100%"
                    radius="round"
                    colorMode="light"
                  />
                </View>
                <View className="mb-3 w-[80%]">
                  <Skeleton
                    height={20}
                    width="100%"
                    radius="round"
                    colorMode="light"
                  />
                </View>
                <View className="mb-3 w-[80%]">
                  <Skeleton
                    height={20}
                    width="100%"
                    radius="round"
                    colorMode="light"
                  />
                </View>
                <View className="w-[80%]">
                  <Skeleton
                    height={20}
                    width="100%"
                    radius="round"
                    colorMode="light"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsSkeleton;
