import React, { useState, useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@rneui/themed";
import { AuthProvider } from "./src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import HomeScreen from "./src/views/screens/HomeScreen";
import LoginScreen from "./src/views/screens/Beautician/LoginScreen";
import RegisterScreen from "./src/views/screens/Beautician/RegisterScreen";
import CustomerRegisterScreen from "./src/views/screens/Customer/CustomerRegisterScreen";
import BeauticianDetailsScreen from "./src/views/screens/Beautician/BeauticianDetailsScreen";
import CustomerProfileScreen from "./src/views/screens/Customer/CustomerProfileScreen";
import AddSchedule from "./src/views/components/AddSchedule";
import CustomerLoginScreen from "./src/views/screens/Customer/CustomerLoginScreen";
import EditProfileScreen from "./src/views/screens/Beautician/EditProfileScreen";
import CustomerBookingScreen from "./src/views/screens/Customer/CustomerBookingScreen";
import Header, { HeaderText } from "./src/views/components/Header";

import ProfileScreen from "./src/views/screens/Beautician/ProfileScreen";
import Details from "./src/views/screens/ModelRecruitment/Details";
import Home from "./src/views/screens/ModelRecruitment/Home";
import ScheduleScreen from "./src/views/screens/ScheduleScreen";
import CustomerChooseServicesScreen from "./src/views/screens/Customer/CustomerChooseServicesScreen";
import GetRecruitment from "./src/views/screens/ModelRecruitment/GetRecruitment";

import CreateShopScreen from "./src/views/screens/Shop/CreateShopScreen";
import BeautyShopLoginScreen from "./src/views/screens/Shop/BeautyShopLoginScreen";
import BeautyShopProfileScreen from "./src/views/screens/Shop/BeautyShopProfileScreen";

import { useFonts } from "expo-font";
import CreatePost from "./src/views/screens/ModelRecruitment/CreatePost";
import EditSchedule from "./src/views/components/EditSchedule";
import PersonalPost from "./src/views/screens/ModelRecruitment/PersonalPost";
import EditPost from "./src/views/screens/ModelRecruitment/EditPost";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomerBookingHistoryScreen from "./src/views/screens/Customer/CustomerBookingHistoryScreen";
import HomeProduct from "./src/views/screens/Shop/Product/HomeProduct";
import ProductInfo from "./src/views/screens/Shop/Product/ProductInfo";
import CreateProduct from "./src/views/screens/Shop/Product/CreateProduct";
import EditProduct from "./src/views/screens/Shop/Product/EditProduct";
import HomeStore from "./src/views/screens/Shop/Store/HomeStore";
import StoreInfo from "./src/views/screens/Shop/Store/StoreInfo";
import CreateStore from "./src/views/screens/Shop/Store/CreateStore";
import EditStore from "./src/views/screens/Shop/Store/EditStore";
import RateListScreen from "./src/views/screens/Customer/RateListScreen";
import CreateRateScreen from "./src/views/screens/Customer/CreateRateScreen";
import BeauticianBookingHistoryScreen from "./src/views/screens/Beautician/BeauticianBookingHistoryScreen";
import RecruitmentHistory from "./src/views/screens/Customer/RecruitmentHistory";
import ServiceDetailsComponent from "./src/views/components/ServiceDetailsComponent";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FavoriteListScreen from "./src/views/screens/Customer/FavoriteListScreen";
import RateListBeauticianScreen from "./src/views/components/RateListBeauticianScreen";
import IncomeScreen from "./src/views/screens/Beautician/IncomeScreen";
import RateListHistoryScreen from "./src/views/screens/Beautician/RateListHistoryScreen";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [loaded] = useFonts({
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterLight: require("./assets/fonts/Inter-Light.ttf"),
  });
  const [tokenDevice, setTokenDevice] = useState("");
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setTokenDevice(token);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log("notification", notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider tokenDevice={tokenDevice}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="AppNavigator"
                component={AppNavigator}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="BeauticianLogin"
                component={LoginScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="CustomerLoginScreen"
                component={CustomerLoginScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Hồ sơ" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>

              <Stack.Screen
                name="RateListScreen"
                component={RateListScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Đánh giá" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="RateListHistoryScreen"
                component={RateListHistoryScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Lịch sử đánh giá" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="ServiceDetailsComponent"
                component={ServiceDetailsComponent}
                options={({ navigation }) => ({
                  headerShown: false,
                  headerTitle: () => <HeaderText name="Chi tiết dịch vụ" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                })}
              ></Stack.Screen>
              <Stack.Screen
                name="CreateRateScreen"
                component={CreateRateScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Đánh giá dịch vụ" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="EditProfileScreen"
                component={EditProfileScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Chỉnh sửa thông tin" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="CustomerProfileScreen"
                component={CustomerProfileScreen}
                options={{
                  headerShown: true,
                  title: "",
                  headerTintColor: "#fff",
                  headerBackTitle: "Quay lại",
                  headerStyle: { backgroundColor: "#FF9494" },
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="CustomerBookingHistoryScreen"
                component={CustomerBookingHistoryScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="BeauticianBookingHistoryScreen"
                component={BeauticianBookingHistoryScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="IncomeScreen"
                component={IncomeScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Thu Nhập" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="CustomerRegisterScreen"
                component={CustomerRegisterScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="BeauticianDetails"
                component={BeauticianDetailsScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <Header name="Beauty NEM" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              />
              <Stack.Screen
                name="RateListBeauticianScreen"
                component={RateListBeauticianScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Đánh giá" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="ScheduleScreen"
                component={ScheduleScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddSchedule"
                component={AddSchedule}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditSchedule"
                component={EditSchedule}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CustomerBookingScreen"
                component={CustomerBookingScreen}
                options={{
                  headerShown: true,
                  title: "",
                  headerTintColor: "#fff",
                  headerBackTitle: "Quay lại",
                  headerStyle: { backgroundColor: "#FF9494" },
                }}
              />
              <Stack.Screen
                name="CustomerChooseServicesScreen"
                component={CustomerChooseServicesScreen}
                options={{
                  headerShown: true,
                  title: "",
                  headerTintColor: "#fff",
                  headerBackTitle: "Quay lại",
                  headerStyle: { backgroundColor: "#FF9494" },
                }}
              />
              <Stack.Screen
                name="FavoriteListScreen"
                component={FavoriteListScreen}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Yêu thích" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              {/* Tuyển mẫu */}
              <Stack.Screen
                name="ModelRecruitment"
                component={Home}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="ModelRecruitmentDetails"
                component={Details}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="CreatePost"
                component={CreatePost}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Tạo bài đăng" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="PersonalPost"
                component={PersonalPost}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="EditPost"
                component={EditPost}
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderText name="Chỉnh sửa bài đăng" />,
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              <Stack.Screen
                name="GetRecruitment"
                component={GetRecruitment}
                options={{
                  headerShown: true,
                  title: "",
                  headerTintColor: "#fff",
                  headerBackTitle: "Quay lại",
                  headerStyle: { backgroundColor: "#FF9494" },
                }}
              />
              <Stack.Screen
                name="RecruitmentHistory"
                component={RecruitmentHistory}
                options={{
                  headerShown: true,
                  headerTitle: () => (
                    <HeaderText name="Lịch sử đặt tuyển mẫu" />
                  ),
                  headerStyle: {
                    backgroundColor: "#FF9494",
                  },
                  headerTintColor: "white",
                }}
              ></Stack.Screen>
              {/* Chủ cửa hàng */}
              <Stack.Screen
                name="CreateShopScreen"
                component={CreateShopScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="BeautyShopLoginScreen"
                component={BeautyShopLoginScreen}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="BeautyShopProfileScreen"
                component={BeautyShopProfileScreen}
                options={{
                  headerShown: true,
                  title: "Hồ sơ cửa hàng",
                  headerTitleAlign: "center",
                  headerTintColor: "#fff",
                  headerBackTitle: "Quay lại",
                  headerStyle: { backgroundColor: "#FF9494" },
                }}
              />
              <Stack.Screen
                name="HomeProduct"
                component={HomeProduct}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="ProductInfo"
                component={ProductInfo}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="CreateProduct"
                component={CreateProduct}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="EditProduct"
                component={EditProduct}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="HomeStore"
                component={HomeStore}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="StoreInfo"
                component={StoreInfo}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="CreateStore"
                component={CreateStore}
                options={{ headerShown: false }}
              ></Stack.Screen>
              <Stack.Screen
                name="EditStore"
                component={EditStore}
                options={{ headerShown: false }}
              ></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
