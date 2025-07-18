import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, I18nManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabBarBackground() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: 60 + insets.bottom,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
      }}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // تعریف تب‌ها داخل آرایه
  const tabs = [
    {
      name: "dashboard/index",
      title: "خانه",
      icon: "home-outline",
    },
    {
      name: "reports/index",
      title: "گزارش",
      icon: "document-text-outline",
    },
    {
      name: "profile/index",
      title: "پروفایل",
      icon: "person-outline",
    },
    {
      name: "requests/index",
      title: "درخواست",
      icon: "clipboard-outline",
    },
  ];

  const isRTL = I18nManager.isRTL;
  const orderedTabs = !isRTL ? tabs : tabs.slice().reverse();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            borderTopWidth: 0,
            backgroundColor: "transparent",
            elevation: 0,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
          },
          default: {
            height: 60,
          },
        }),
        tabBarLabelStyle: {
          fontFamily: "sans",
          fontSize: 11,
        },
      }}
    >
      {orderedTabs.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <Ionicons name={icon} size={28} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
