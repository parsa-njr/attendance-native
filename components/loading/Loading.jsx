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
        {typeof children === "function" ? children({ refreshing }) : children}
      </ScrollView>

      
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
 
  },
});

export default Loading;
