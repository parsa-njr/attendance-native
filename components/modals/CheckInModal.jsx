import React, { useState } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Button,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";

const AddUserModal = ({ visible, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleAddUser = () => {
    onClose();
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          {/* Added some padding to the animation view */}
          <View style={styles.animationContainer}>
            <LottieView
              source={require("../../assets/animations/Animation - 1745703881904 (1).json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>

          {/* Ensure the modal content does not get cramped */}
          <Text style={styles.modalTitle}>Check In?</Text>

          <Button title="Accept" onPress={handleAddUser} />
        </View>
      </Animated.View>
    </Modal>
  );
};

export default AddUserModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#ccc",
    fontWeight: "bold",
  },
  animationContainer: {
    width: "100%", 
    height: 150,  // Ensures the animation is visible but does not take up the entire space
    marginBottom: 20, // Add space between the animation and other elements
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});
