import React from "react";
import { SafeAreaView } from "react-native";
import { Provider } from "react-native-paper";

const Wrapper = ({ children, className }) => {
  return (
    <Provider>
      <SafeAreaView className={className}>{children}</SafeAreaView>
    </Provider>
  );
};

export default Wrapper;
