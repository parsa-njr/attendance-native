import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

const { height } = Dimensions.get("window");

const BottomSheet = ({ visible, onClose, children, extraHeight = 0 }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // ⬅️ Wait for animation to finish before hiding modal
        setModalVisible(false);
      });
    }
  }, [visible]);

  if (!modalVisible) return null;

  return (
    <Modal transparent animationType="none" visible={modalVisible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <View
            style={{
              maxHeight: (height + extraHeight) * 0.6,
              backgroundColor: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 16,
              paddingTop: 20,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;
