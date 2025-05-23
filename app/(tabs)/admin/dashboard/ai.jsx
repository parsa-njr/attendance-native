import { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const weeklyPredictions = {
  شنبه: { onTime: 0.8, late: 0.15, absent: 0.05 },
  یک‌شنبه: { onTime: 0.7, late: 0.2, absent: 0.1 },
  دوشنبه: { onTime: 0.6, late: 0.3, absent: 0.1 },
  سه‌شنبه: { onTime: 0.75, late: 0.15, absent: 0.1 },
  چهارشنبه: { onTime: 0.65, late: 0.25, absent: 0.1 },
  پنج‌شنبه: { onTime: 0.85, late: 0.1, absent: 0.05 },
  جمعه: { onTime: 0.5, late: 0.2, absent: 0.3 },
};

const AIDashboard = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-5 mt-9">
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-base text-gray-800 font-sans text-right">
              داشبورد هوش مصنوعی 🧠
            </Text>
            <Text className="text-sm text-gray-500 mt-1 font-sans text-right">
              پیش‌بینی حضور کارمندان برای هفته جاری
            </Text>
          </View>
        </View>

        {/* Weekly Predictions */}
        {Object.entries(weeklyPredictions).map(([day, predictions]) => (
          <View key={day} className="px-5 mt-8">
            <Text className="text-xl font-semibold text-gray-800 mb-4 text-right font-sans">
              {day}
            </Text>

            <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <ProgressChart
                data={{
                  labels: ["حضور", "تاخیر", "غیبت"],
                  data: [
                    predictions.onTime,
                    predictions.late,
                    predictions.absent,
                  ],
                }}
                width={screenWidth - 40}
                height={200}
                strokeWidth={16}
                radius={32}
                chartConfig={chartConfig}
                hideLegend={false}
              />
            </View>

            <PredictionCard
              label="احتمال حضور به موقع"
              value={predictions.onTime}
              color="text-green-500"
            />
            <PredictionCard
              label="احتمال ورود با تاخیر"
              value={predictions.late}
              color="text-yellow-500"
            />
            <PredictionCard
              label="احتمال غیبت"
              value={predictions.absent}
              color="text-red-500"
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const PredictionCard = ({ label, value, color }) => (
  <View className="bg-white p-4 rounded-2xl mb-3 shadow-sm">
    <Text className={`text-2xl font-bold ${color} font-sans text-right`}>
      {(value * 100).toFixed(0)}٪
    </Text>
    <Text className="text-gray-600 text-sm mt-1 font-sans text-right">
      {label}
    </Text>
  </View>
);

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: () => "#4B5563",
  strokeWidth: 2,
  useShadowColorFromDataset: false,
};

export default AIDashboard;
