import React from "react";
import { View, ScrollView } from "react-native";
import { Skeleton } from "moti/skeleton";

const LocationsSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Search bar skeleton */}
      <View className="px-5 pt-12 pb-3 mb-4 bg-white shadow-sm">
        <Skeleton height={48} width="100%" colorMode="light" radius="round" />
      </View>

      {/* Repeat location card skeletons */}
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          className="bg-white mx-4 my-2 px-5 py-4 rounded-3xl border border-gray-200 flex-row-reverse items-center"
          style={{
            elevation: 2,
          }}
        >
          {/* Map thumbnail skeleton */}
          <View className="w-16 h-16 rounded-2xl overflow-hidden  shadow-sm ml-4">
            <Skeleton
              height={"100%"}
              width={"100%"}
              radius={16}
              colorMode="light"
            />
          </View>

          {/* Text skeletons */}
          <View className="flex-1 mr-1 space-y-2">
            <View className="mb-1">
              <Skeleton
                height={14}
                width={"60%"}
                colorMode="light"
                radius="round"
              />
            </View>

            <View>
              <Skeleton
                height={12}
                width={"40%"}
                colorMode="light"
                radius="round"
              />
            </View>
          </View>

          {/* Menu icon skeleton */}
        </View>
      ))}
    </ScrollView>
  );
};

export default LocationsSkeleton;
