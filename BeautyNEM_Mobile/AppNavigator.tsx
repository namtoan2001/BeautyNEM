import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/views/screens/HomeScreen";
import { AuthContext } from "./src/context/AuthContext";
import ChooseLoginRole from "./src/views/screens/ChooseLoginRole";
import MoreOptions from "./src/views/screens/MoreOptions";
import EventScreen from "./src/views/screens/EventScreen";
import NotificationBeauticianScreen from "./src/views/screens/Beautician/NotificationBeauticianScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NotificationCustomerScreen from "./src/views/screens/Customer/NotificationCustomerScreen";
import IntroductionPageScreen from "./src/views/screens/IntroductionPageScreen";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { userToken, userRole } = useContext(AuthContext);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Trang chủ"
        component={IntroductionPageScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home" size={30} color="#808080" />
          ),
          headerShown: false,
          tabBarActiveTintColor: "#FF9494",
        }}
      />

      {userRole === "Beautician" && (
        <Tab.Screen
          name="Lịch hẹn"
          component={EventScreen}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={30}
                color="#808080"
              />
            ),
            headerShown: false,
            tabBarActiveTintColor: "#FF9494",
          }}
        />
      )}

      <Tab.Screen
        name="Tìm kiếm"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <FontAwesome name="search" size={30} color="#808080" />
          ),
          headerShown: false,
          tabBarActiveTintColor: "#FF9494",
        }}
      />

      {userToken && (
        <Tab.Screen
          name="Thông báo"
          component={
            userRole === "Beautician"
              ? NotificationBeauticianScreen
              : NotificationCustomerScreen
          }
          options={{
            tabBarIcon: () => (
              <MaterialIcons name="notifications" size={30} color="#808080" />
            ),
            headerShown: false,
            tabBarActiveTintColor: "#FF9494",
          }}
        />
      )}

      {userToken !== null ? (
        <Tab.Screen
          name="Tài khoản"
          component={MoreOptions}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="account"
                size={30}
                color="#808080"
              />
            ),
            headerShown: false,
            tabBarActiveTintColor: "#FF9494",
          }}
        />
      ) : (
        <Tab.Screen
          name="Tài khoản"
          component={ChooseLoginRole}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="account"
                size={30}
                color="#808080"
              />
            ),
            headerShown: false,
            tabBarActiveTintColor: "#FF9494",
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default AppNavigator;
