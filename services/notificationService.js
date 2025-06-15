// notificationService.js

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert, Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert("فقط روی دستگاه واقعی کار می‌کند");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("اجازه ارسال نوتیف داده نشد");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
