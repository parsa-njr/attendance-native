import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontFamily: "sans", // <-- replace with actual font name
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "خانه",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "پرفایل",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="users/index"
        options={{
          title: "کاربران",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="location/index"
        options={{
          title: "موقعیت",
          tabBarIcon: ({ color }) => (
            <Ionicons name="location-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports/index"
        options={{
          title: "گزارش",
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shift/index"
        options={{
          title: "شیفت",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
