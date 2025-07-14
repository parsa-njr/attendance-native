import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import "../global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import "react-native-reanimated";
import FlashMessage from "react-native-flash-message";
import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    sans: require("../assets/fonts/IRANSansWeb.ttf"),
    vazir: require("../assets/fonts/Vazirmatn-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/admin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/employe" options={{ headerShown: false }} />
        <Stack.Screen name="Auth" options={{ headerShown: false }} />
        <Stack.Screen
          name="pages/requests"
          options={{
            headerShown: true,
            title: "داشبورد",
            headerTitleStyle: {
              fontFamily: "sans",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style="auto" />

      {/* FlashMessage styled wrapper */}

      <FlashMessage
        position="top"
        style={styles.flashStyle}
        titleStyle={styles.title}
        textStyle={styles.text}
      />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  flashStyle: {
    borderRadius: 10,
    marginTop: 60,
    elevation: 4,
    shadowColor: "#000",
  },
  title: {
    fontFamily: "sans",
    textAlign: "right",
    fontSize: 16,
  },
  text: {
    fontFamily: "sans",
    textAlign: "right",
    fontSize: 14,
  },
});
