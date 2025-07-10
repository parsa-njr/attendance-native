import React from "react";
import { View, Text } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import LottieView from "lottie-react-native";

// Put your animation files here
const animations = {
  logout: require("../../../assets/animations/Animation - 1745700345349 (1).json"),
  success: require("../../../assets/animations/Animation - 1745700345349 (1).json"),
  error: require("../../../assets/animations/Animation - 1745700345349 (1).json"),
  warning: require("../../../assets/animations/Animation - 1749528438789.json"),
  warning1: require("../../../assets/animations/Animation - 1749528585928.json"),
};

const Alert = ({
  visible,
  onDismiss,
  onConfirm,
  mode = "warning",
  title = "آیا مطمئن هستید؟",
  cancelText = "خیر",
  confirmText = "بله",
  styles: customStyles = {},
}) => {
  const animationSource = animations[mode] || animations.warning;

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          paddingVertical: 20,
          paddingHorizontal: 20,
          elevation: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          marginHorizontal: 40,
          minWidth: 280,
          ...customStyles.dialog,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 12,
            ...customStyles.animationContainer,
          }}
        >
          <LottieView
            source={animationSource}
            autoPlay
            loop
            style={{
              width: 120,
              height: 120,
              marginBottom: -8,
              ...customStyles.animation,
            }}
          />
        </View>
        <Dialog.Content>
          <Text
            style={{
              textAlign: "center",
              fontSize: 17,
              fontWeight: "600",
              fontFamily: "sans",
              color: "#1c1c1e",
              marginBottom: 16,
              lineHeight: 22,
              ...customStyles.title,
            }}
          >
            {title}
          </Text>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopWidth: 1,
            borderTopColor: "#c7c7cc",
            marginTop: 6,
            paddingHorizontal: 0,
            ...customStyles.actions,
          }}
        >
          <Button
            textColor="#007aff"
            onPress={onDismiss}
            mode="text"
            labelStyle={{
              fontFamily: "sans",
              fontSize: 17,
              fontWeight: "600",
              ...customStyles.cancelLabel,
            }}
            style={{ flex: 1, borderRadius: 0, ...customStyles.cancelButton }}
          >
            {cancelText}
          </Button>
          <Button
            onPress={onConfirm}
            mode="text"
            labelStyle={{
              fontFamily: "sans",
              fontSize: 17,
              fontWeight: "600",
              color: "#ff3b30",
              ...customStyles.confirmLabel,
            }}
            style={{ flex: 1, borderRadius: 0, ...customStyles.confirmButton }}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Alert;
