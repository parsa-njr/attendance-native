import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import { PieChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = true;

  const dashboardData = {
    activeEmployees: 42,
    absentEmployees: 5,
    lateCheckIns: 3,
    pendingApprovals: 2,
    latestActivity: [
      { id: 1, text: "جان دو در ساعت ۹:۰۳ صبح ورود زد" },
      { id: 2, text: "سارا اسمیت درخواست مرخصی داد" },
      { id: 3, text: "مایک جانسون در ساعت ۴:۵۷ بعدازظهر خروج زد" },
    ],
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/Auth/login");
    }
  }, [isReady, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 relative">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Manager Profile Section */}
        {/* Profile & Greeting Section */}
        <View className="px-5 pt-5 mt-9">
          <View className="bg-white rounded-2xl p-5 flex-row items-center shadow-sm">
            <View className="flex-1">
              <Text className="text-base  text-gray-800 text-right font-sans">
                سلام مدیر عزیز 👋
              </Text>
              <Text className="text-sm text-gray-500 mt-1 text-right font-sans">
                داشبورد امروز شما اینجاست.
              </Text>
            </View>
            <View className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden ml-4">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/32.jpg",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-5 mt-5">
          <View className="flex-row flex-wrap justify-between mt-9">
            <StatCard
              label="کارمندان حاضر"
              value={dashboardData.activeEmployees}
              color="text-green-500"
            />
            <StatCard
              label="کارمندان غایب"
              value={dashboardData.absentEmployees}
              color="text-red-500"
            />
            <StatCard
              label="ورود های با تاخیر"
              value={dashboardData.lateCheckIns}
              color="text-amber-500"
            />
            <StatCard
              label="کارمندان معلق"
              value={dashboardData.lateCheckIns}
              color="text-blue-500"
            />
          </View>
        </View>

        {/* Charts Section */}
        <View className="px-5 mt-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4 text-right font-sans">
            وضعیت کارمندان
          </Text>
          <View className="bg-white p-4 rounded-2xl mb-8 shadow-sm">
            <PieChart
              data={[
                {
                  name: "حاضر",
                  population: dashboardData.activeEmployees,
                  color: "#34D399",
                  legendFontColor: "#4B5563",
                  legendFontSize: 14,
                },
                {
                  name: "غایب",
                  population: dashboardData.absentEmployees,
                  color: "#F87171",
                  legendFontColor: "#4B5563",
                  legendFontSize: 14,
                },
                {
                  name: "ورود دیرهنگام",
                  population: dashboardData.lateCheckIns,
                  color: "#FBBF24",
                  legendFontColor: "#4B5563",
                  legendFontSize: 14,
                },
              ]}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* Latest Activity */}
        <View className="px-5 mt-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4 text-right font-sans">
            آخرین فعالیت‌ها
          </Text>
          {dashboardData.latestActivity.map((activity) => (
            <View
              key={activity.id}
              className="bg-white p-4 rounded-2xl mb-4 shadow-sm"
            >
              <Text className="text-sm text-gray-700 text-right font-sans">
                {activity.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ label, value, color }) => {
  return (
    <View className="w-[48%] bg-white p-4 rounded-2xl mb-4 shadow-sm">
      <Text className={`text-3xl font-bold ${color} font-sans text-right`}>
        {value}
      </Text>
      <Text className="text-gray-600 text-sm mt-2 font-sans text-right">
        {label}
      </Text>
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // pure black for better readability
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

export default Dashboard;
