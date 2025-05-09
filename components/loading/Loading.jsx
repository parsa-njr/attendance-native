import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const Loading = ({ children, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    setRefreshing(false);
  };

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {children}
      </ScrollView>

      {/* Only show the loader when refreshing */}
      {refreshing && (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loader: {
    position: "absolute", 
    top: "50%",
  },
});

export default Loading;
