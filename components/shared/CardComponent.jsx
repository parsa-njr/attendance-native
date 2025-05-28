// components/Card/Card.js
import { View, StyleSheet } from "react-native";

const CardComponent = ({ children, style, className = "" }) => {
  return (
    <View className={className} style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default CardComponent;
