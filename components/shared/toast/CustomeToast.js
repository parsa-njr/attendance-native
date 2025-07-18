// CustomToast.js
import { showMessage } from "react-native-flash-message";

export const customToast = ({
  title = "پیام پیش‌فرض",
  type = "success",
  delay = 0, // ⏱️ delay in ms, default: no delay
  description = "",
}) => {
  const toastConfig = {
    message: title,
    type: type,
    color: "#fff",
    description: description,
    icon: type, // or null
    backgroundColor:
      type === "success"
        ? "#4BB543"
        : type === "danger"
        ? "#FF3B30"
        : "#323232",
    style: {
      borderRadius: 8,
      marginHorizontal: 20,
      marginTop: 70,
      paddingVertical: 10,
    },
    titleStyle: {
      fontSize: 14,
      textAlign: "center",
      fontFamily: "sans",
    },
  };

  if (delay > 0) {
    setTimeout(() => {
      showMessage(toastConfig);
    }, delay);
  } else {
    showMessage(toastConfig);
  }
};
