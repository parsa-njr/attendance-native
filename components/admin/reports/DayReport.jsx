import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import BottomSheet from "../../shared/BottomSheet";

// Enable layout animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DayReport = ({ visible, onClose, users = [] }) => {
  const [expandedUserIds, setExpandedUserIds] = useState([]);

  const toggleExpand = (userId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const renderUser = ({ item }) => {
    const isExpanded = expandedUserIds.includes(item.id);

    const statusColor =
      {
        present: "#22c55e",
        late: "#eab308",
        absent: "#ef4444",
      }[item.status] || "#94a3b8";

    return (
      <TouchableOpacity
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.9}
      >
        <View className="flex-row-reverse items-center px-4 py-3 bg-white">
          <TouchableOpacity
            onPress={() => {}}
            className="w-14 h-14 rounded-full border-2 border-blue-500 overflow-hidden"
          >
            <Image
              source={{ uri: item.avatar }}
              className="w-full h-full rounded-full"
            />
          </TouchableOpacity>

          <View className="flex-1 mr-4 border-b border-gray-100 pb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-gray-400 text-left">9:58 AM</Text>
              <Text className="text-base font-semibold text-gray-800 font-sans text-right">
                {item.name}
              </Text>
            </View>
            <Text className="text-sm mt-1 text-right">{item.status}</Text>

            {isExpanded && (
              <View className="mt-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs text-gray-500 text-right">
                    ساعت ورود:
                  </Text>
                  <Text className="text-xs text-slate-700">9:58 AM</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs text-gray-500 text-right">
                    ساعت خروج:
                  </Text>
                  <Text className="text-xs text-slate-700">5:45 PM</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs text-gray-500 text-right">
                    موقعیت مکانی:
                  </Text>
                  <Text className="text-xs text-slate-700">
                    تهران، دفتر مرکزی
                  </Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs text-gray-500 text-right">
                    دستگاه ورود:
                  </Text>
                  <Text className="text-xs text-slate-700">
                    Android - Chrome
                  </Text>
                </View>
                <View className="mt-2">
                  <Text className="text-xs text-gray-500 text-right mb-1">
                    توضیحات:
                  </Text>
                  <Text className="text-xs text-slate-600 leading-5 text-right">
                    امروز با 10 دقیقه تاخیر وارد شد به دلیل ترافیک سنگین در مسیر
                    خانه تا دفتر.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} extraHeight={350}>
      <View style={styles.container}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderUser}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BottomSheet>
  );
};

export default DayReport;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
