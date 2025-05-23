import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SeparatorWithTitle = ({ title ="", className = "" , type="right"}) => {
  return (
    <View className={`${className}`} style={styles.container}>
      {type === "center" && (
        <>
        
        <View style={styles.line} />
        </>
      )}
      {title && (<>
      
      <Text
        className="text-sm text-center text-gray-500 mb-2 font-sans"
        style={styles.title}
      >
        {title}
      </Text>
      </>)}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  title: {
    marginHorizontal: 10,
    fontWeight: "400",
    fontSize: 18,
    color: "#6b7280",
  },
});

export default SeparatorWithTitle;
