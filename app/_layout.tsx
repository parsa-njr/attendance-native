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
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  I18nManager,
  Platform,
} from "react-native";
import FlashMessage from "react-native-flash-message";
import { useColorScheme } from "@/hooks/useColorScheme";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Force RTL (only once)
if (Platform.OS === "android" && !I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // ❗ On first run, you need to clear the build or reinstall app for it to take effect.
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    sans: require("../assets/fonts/IRANSansWeb.ttf"),
    vazir: require("../assets/fonts/Vazirmatn-Regular.ttf"),
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ready, setReady] = useState(false);

  const slides = [
    {
      key: "one",
      title: "به اپ ما خوش آمدید",
      text: "دستیار هوشمند برای انجام سریع کارها",
      image: require("../assets/images/icon.png"),
    },
    {
      key: "two",
      title: "مدیریت کارها",
      text: "سازماندهی وظایف و افزایش بهره‌وری",
      image: require("../assets/images/icon.png"),
    },
    {
      key: "three",
      title: "همیشه متصل",
      text: "در ارتباط و هماهنگ با تیم خود بمانید",
      image: require("../assets/images/icon.png"),
    },
  ];

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        if (!seen) setShowOnboarding(true);
      } catch (err) {
        console.error("Error checking onboarding:", err);
      } finally {
        setReady(true);
      }
    };
    checkOnboarding();
  }, []);

  const onDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  const renderSlide = ({ item, index }: any) => (
    <ImageBackground
      source={item.image}
      style={styles.slide}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        {index === slides.length - 1 && (
          <TouchableOpacity style={styles.button} onPress={onDone}>
            <Text style={styles.buttonText}>بزن بریم 🚀</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );

  useEffect(() => {
    if (loaded && ready && !showOnboarding) {
      SplashScreen.hideAsync();
    }
  }, [loaded, ready, showOnboarding]);

  if (!loaded || !ready) return null;

  if (showOnboarding) {
    return (
      <AppIntroSlider
        data={slides}
        renderItem={renderSlide}
        showSkipButton={false}
        showDoneButton={false}
        showNextButton={false}
        dotStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          width: 10,
          height: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        activeDotStyle={{
          backgroundColor: "#fff",
          width: 22,
          height: 10,
          borderRadius: 6,
          marginBottom: 20,
        }}
      />
    );
  }

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
  slide: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    fontFamily: "sans",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "sans",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  flashStyle: {
    borderRadius: 10,
    marginTop: 60,
    elevation: 4,
    shadowColor: "#000",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "sans",
  },
});
