import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { Login, GetCities } from "../../services/BeauticianLoginService";
import {
  LoginParameters,
  GetCustomerByID,
} from "../../services/CustomerLoginService";
import {
  LoginBeautyShop
} from "../../services/beautyShopLoginService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetSkillWithToken } from "../../services/BeauticianProfileService";
import {
  GetTokenDevice,
  RefreshToken,
} from "../../services/tokenDeviceService";

export const AuthContext = createContext();

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const AuthProvider = ({ children, tokenDevice }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [service, setService] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshToken = async (userId, role) => {
    //Refresh token device
    let requestData = new FormData();
    requestData.append("UserId", userId);
    requestData.append("Role", role);
    requestData.append("TokenDevice", tokenDevice);
    RefreshToken(requestData)
      .then((response) => {
        if (response.data) {
          var tokenVM = {
            userId: userId,
            role: role,
          };
          GetTokenDevice(tokenVM)
            .then((response) => {
              const token = response.data;
              AsyncStorage.setItem("tokenDevice", token);
            })
            .catch((error) => Alert.alert(error.response.data));
        }
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const login = async (username, password, navigation) => {
    setRefreshing(false);
    wait(2000).then(() => setRefreshing(true));
    setIsLoading(true);
    let formData = new FormData();
    formData.append("Username", username);
    formData.append("Password", password);
    Login(formData)
      .then(async (res) => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        setUserToken(userInfo.jwtToken);
        setUserRole(userInfo.role);
        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        AsyncStorage.setItem("userToken", userInfo.jwtToken);
        AsyncStorage.setItem("userRole", userInfo.role);
        handleRefreshToken(userInfo.id, userInfo.role);
        GetSkillWithToken()
          .then((response) => {
            let list = response.data.map((data) => {
              return {
                ...data,
                price: data.price,
              };
            });
            setService(list);
            for (
              let i = 0;
              i < response.data.map((data) => data.price).length;
              i++
            ) {
              if (response.data.map((data) => data.price)[i] === 0) {
                Alert.alert("Đăng nhập thành công");
                return navigation.navigate("ProfileScreen");
              }
            }
            Alert.alert("Thông báo", "Đăng nhập thành công", [
              { text: "Đồng ý" },
            ]);
            navigation.navigate("Trang chủ");
          })
          .catch((error) => console.log(error));
      })
      .catch((err) => {
        Alert.alert("Thông báo", "Đăng nhập thất bại", [{ text: "Đồng ý" }]);
        navigation.navigate("BeauticianLogin");
        console.log(err);
      });
    setIsLoading(false);
  };

  const Customerlogin = async (username, password, navigation) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("Username", username);
    formData.append("Password", password);
    LoginParameters(formData)
      .then((res) => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        setUserToken(userInfo.jwtToken);
        setUserRole(userInfo.role);

        handleRefreshToken(userInfo.id, userInfo.role);

        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        AsyncStorage.setItem("userToken", userInfo.jwtToken);
        AsyncStorage.setItem("userRole", userInfo.role);

        // console.log("User Token: " + userInfo.jwtToken);
        // console.log("Đăng nhập thành công");
        Alert.alert("Thông báo", "Đăng nhập thành công", [{ text: "Đồng ý" }]);
        navigation.navigate("Trang chủ");
      })
      .catch((err) => {
        Alert.alert("Thông báo", "Đăng nhập thất bại", [{ text: "Đồng ý" }]);
        navigation.navigate("CustomerLoginScreen");
      });
    setIsLoading(false);
    console.log(GetCustomerByID(7));
  };

  const BeautyshopLogin = async (username, password, navigation) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("Username", username);
    formData.append("Password", password);
    //console.log(username);
    //console.log(password);
    LoginBeautyShop(formData)
      .then((res) => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        setUserToken(userInfo.jwtToken);
        setUserRole(userInfo.role);
        console.log(userInfo.role);
        handleRefreshToken(userInfo.id, userInfo.role);

        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        AsyncStorage.setItem("userToken", userInfo.jwtToken);
        AsyncStorage.setItem("userRole", userInfo.role);

        // console.log("User Token: " + userInfo.jwtToken);
        console.log("Đăng nhập thành công");
        Alert.alert("Thông báo", "Đăng nhập thành công", [{ text: "Đồng ý" }]);
        //navigation.navigate("Trang chủ");
      })
      .catch((err) => {
        Alert.alert("Thông báo", "Đăng nhập thất bại", [{ text: "Đồng ý" }]);
        navigation.navigate("BeautyShopLoginScreen");
      });
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    setUserRole(null);
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userRole");
    setIsLoading(false);
    Alert.alert("Thông báo", "Đăng xuất thành công", [{ text: "Đồng ý" }]);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      let userToken = await AsyncStorage.getItem("userToken");
      let userRole = await AsyncStorage.getItem("userRole");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserToken(userToken);
        setUserInfo(userInfo);
        setUserRole(userRole);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`isLogged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        Customerlogin,
        BeautyshopLogin,
        logout,
        isLoading,
        userToken,
        userInfo,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
