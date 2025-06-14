import React from "react";
import { View, ScrollView } from "react-native";
import { Skeleton } from "moti/skeleton";

const RequestsSkeleton = () => {
  return (
    <View className="flex-1 bg-gray-50 px-5 pt-10">
      {/* Search Bar Skeleton */}
      <View className="px-5 pt-8 pb-4 bg-white shadow-sm mt-6">
        <Skeleton
          height={48}
          width="100%"
          radius={999}
          colorMode="light"
        />
      </View>

      {/* Scrollable list of cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            className="bg-white p-5 rounded-2xl shadow-md flex-row-reverse justify-between items-center mx-2 mt-3 border border-gray-100"
          >
            {/* Left Section (Status Badge) */}
            <Skeleton
              height={28}
              width={80}
              radius={999}
              colorMode="light"
            />

            {/* Right Section (Texts) */}
            <View className="flex-1 pr-4 space-y-2">
              <Skeleton
                height={20}
                width="70%"
                radius={6}
                colorMode="light"
              />
              <Skeleton
                height={16}
                width="50%"
                radius={6}
                colorMode="light"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RequestsSkeleton;
