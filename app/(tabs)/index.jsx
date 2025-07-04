import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Index = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authDataStr = await AsyncStorage.getItem("authData");
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          if (authData.token && authData.user) {
            setIsAuthenticated(true);
            setUserRole("customer"); // adjust this if your user role key is different
          } else {
            setIsAuthenticated(false);
            setUserRole(null);
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error reading auth data:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isReady) {
      if (isAuthenticated) {
        if (userRole === "customer") {
          router.replace("/admin/dashboard");
        } else if (userRole === "user") {
          router.replace("/employe/dashboard");
        } else {
          // fallback if role unknown
          router.replace("/Auth/login");
        }
      } else {
        router.replace("/Auth/login");
      }
    }
  }, [isReady, isAuthenticated, userRole]);

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
};

export default Index;
