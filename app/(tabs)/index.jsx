import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Replace with real auth logic
  const [userRole, setUserRole] = useState("admin"); // Replace with real user role logic
  const router = useRouter();

  // Simulate app initialization or loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isReady) {
      console.log("isAuthenticated:", isAuthenticated);
      console.log("userRole:", userRole);

      if (isAuthenticated) {
        if (userRole === "admin") {
          console.log("Redirecting to /admin/dashboard");
          router.replace("/admin/dashboard");
        } else if (userRole === "employee") {
          console.log("Redirecting to /employee/dashboard");
          router.replace("/employe");
        }
      } else {
        console.log("Redirecting to /Auth/login");
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

  return null; // Redirection happens, so nothing to render
};

export default Index;
