import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { height } = Dimensions.get('window');

const BottomSheet = ({ visible, onClose, children }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
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
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent animationType="none" visible={visible}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet Container */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '60%',
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 16,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;
