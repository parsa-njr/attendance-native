import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";

const ProfileSkeleton = () => {
  return (
    <>
      {/* Profile image skeleton */}
      <View className="px-5 pt-8 items-center mt-5">
        <Skeleton height={100} width={100} radius={"round"} colorMode="light" />
      </View>

      {/* Form section skeletons */}
      <View className="px-5 mt-8 space-y-5 flex">
        <View className="mt-3">
          <Skeleton
            height={90}
            width="100%"
            borderRadius={20}
            colorMode="light"
          />
        </View>
        <View className="mt-3">
          <Skeleton
            height={90}
            width="100%"
            borderRadius={20}
            colorMode="light"
          />
        </View>
        <View className="mt-3">
          <Skeleton
            height={90}
            width="100%"
            borderRadius={20}
            colorMode="light"
          />
        </View>
        <View className="mt-8">
          <Skeleton
            height={50}
            width="100%"
            borderRadius={12}
            colorMode="light"
          />
        </View>
      </View>
    </>
  );
};

export default ProfileSkeleton;
