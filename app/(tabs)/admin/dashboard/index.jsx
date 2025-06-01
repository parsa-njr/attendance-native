import { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import CardComponent from "../../../../components/shared/CardComponent";
import Loading from "../../../../components/loading/Loading";
import { router } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import DashboardSkeleton from "../../../../components/loading/Skeleton/Admin/Dashboard/DashboardSkeleton";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isAuthenticated = true;

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      const timeout = setTimeout(() => {
        setRefreshing(false);
      }, 1500);
      setIsReady(true);
      return () => clearTimeout(timeout);
    }, [])
  );

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/Auth/login");
    }
  }, [isReady, isAuthenticated]);

  const onRefresh = () =>
    new Promise((resolve) => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        resolve();
      }, 1500);
    });

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (refreshing) {
    return <DashboardSkeleton />;
  }

  return (
    <Loading onRefresh={onRefresh}>
      {() => (
        <SafeAreaView className="flex-1 bg-gray-50 relative">
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Profile Section */}
            <View className="px-5 pt-5 mt-9">
              <CardComponent className="bg-white rounded-2xl p-5 flex-row items-center shadow-sm">
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
              </CardComponent>
            </View>

            {/* Stats Section */}
            <View className="px-5 mt-5">
              <View className="flex-row flex-wrap justify-between mt-9">
                <StatCard
                  label="کارمندان حاضر"
                  value={42}
                  color="text-green-500"
                />
                <StatCard
                  label="کارمندان غایب"
                  value={5}
                  color="text-red-500"
                />
                <StatCard
                  label="ورود های با تاخیر"
                  value={3}
                  color="text-amber-500"
                />
                <StatCard
                  label="کارمندان معلق"
                  value={2}
                  color="text-blue-500"
                />
              </View>
            </View>

            {/* Charts Section */}
            <View className="px-5 mt-8">
              <Text className="text-xl font-semibold text-gray-800 mb-4 text-right font-sans">
                وضعیت کارمندان
              </Text>
              <CardComponent className="bg-white p-4 rounded-2xl mb-8 shadow-sm">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Pie Chart */}
                  <PieChart
                    data={[
                      { name: "حاضر", population: 42, color: "#34D399" },
                      { name: "غایب", population: 5, color: "#F87171" },
                      {
                        name: "ورود دیرهنگام",
                        population: 3,
                        color: "#FBBF24",
                      },
                    ]}
                    width={screenWidth * 0.53} // about half width for chart
                    height={200}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="25"
                    absolute
                    hasLegend={false}
                  />

                  {/* Legend next to chart */}
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      
                      // For RTL
                      writingDirection: "rtl",
                      
                      height: 220,
                    }}
                  >
                    {[
                      { label: "حاضر", color: "#34D399" },
                      { label: "غایب", color: "#F87171" },
                      { label: "ورود دیرهنگام", color: "#FBBF24" },
                    ].map((item) => (
                      <View
                        key={item.label}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginVertical: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: item.color,
                            borderRadius: 4,
                            marginLeft: 8,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#4B5563",
                            fontFamily: "sans-serif",
                            writingDirection: "rtl",
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </CardComponent>
            </View>

            {/* Latest Activity */}
            <View className="px-5 mt-8">
              <Text className="text-xl font-semibold text-gray-800 mb-4 text-right font-sans">
                آخرین فعالیت‌ها
              </Text>
              {[
                { id: 1, text: "جان دو در ساعت ۹:۰۳ صبح ورود زد" },
                { id: 2, text: "سارا اسمیت درخواست مرخصی داد" },
                { id: 3, text: "مایک جانسون در ساعت ۴:۵۷ بعدازظهر خروج زد" },
              ].map((activity) => (
                <CardComponent key={activity.id} className="bg-white p-4 mb-4">
                  <Text className="text-sm text-gray-700 text-right font-sans">
                    {activity.text}
                  </Text>
                </CardComponent>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Loading>
  );
};

const StatCard = ({ label, value, color }) => {
  return (
    <CardComponent className="w-[48%] bg-white p-4 rounded-2xl mb-4 shadow-sm">
      <Text className={`text-3xl font-bold ${color} font-sans text-right`}>
        {value}
      </Text>
      <Text className="text-gray-600 text-sm mt-2 font-sans text-right">
        {label}
      </Text>
    </CardComponent>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

export default Dashboard;
