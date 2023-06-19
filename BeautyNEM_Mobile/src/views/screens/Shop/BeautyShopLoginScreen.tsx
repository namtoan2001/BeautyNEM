import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  DancingScript_400Regular,
  DancingScript_500Medium,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from "@expo-google-fonts/dancing-script";
import { useFonts } from "expo-font";

import LoginSVG from "../../../assets/images/misc/login.png";

import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";


import { AuthContext } from "../../../context/AuthContext";


const BeautyShopLoginScreen = ({ data, navigation }) => {
  const { BeautyshopLogin } = useContext(AuthContext);

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [seePassword, setSeePassword] = useState(true);
  const [checkValidUser, setCheckValidUser] = useState(false);
  const [checkValidPassword, setCheckValidPassword] = useState(false);
  const [errorUser, setErrorUser] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  // console.log(username, password);
  const handleBlurUser = () => {
    if (username === "") {
      setErrorUser("Vui lòng nhập tên tài khoản");
      setCheckValidUser(true);
      // console.log("Vui lòng nhập tên tài khoản " + username);
    } else {
      setCheckValidUser(false);
      // console.log("Báo lỗi tài khoản không thành công " + username);
    }
  };

  useEffect(() => {
    handleBlurUser();
  }, [username]);

  const handleBlurPassword = () => {
    if (password === "") {
      setErrorPassword("Vui lòng nhập mật khẩu");
      setCheckValidPassword(true);
      // console.log("Vui lòng nhập mật khẩu " + password);
    } else {
      setCheckValidPassword(false);
      // console.log("Báo lỗi mật khẩu không thành công " + username);
    }
  };

  useEffect(() => {
    handleBlurPassword();
  }, [password]);

  let [fontsLoaded] = useFonts({
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", position: "relative" }}
    >
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={JSON.parse(LoginSVG)}
            style={{ width: "100%", height: null, aspectRatio: 500 / 300 }}
          ></Image>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Trang chủ");
          }}
          style={{ position: "absolute", top: -55, left: 14 }}
        >
          <Ionicons name="arrow-back" color="black" size={30} />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "DancingScript_600SemiBold",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Đăng nhập cho chủ cửa hàng
        </Text>

        <View style={{ position: "relative" }}>
          <InputField
            label={"Tên tài khoản"}
            icon={
              <MaterialIcons
                name="user-o"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            inputType={undefined}
            keyboardType={undefined}
            fieldButtonLabel={undefined}
            fieldButtonFunction={undefined}
            secureTextEntry={undefined}
            onBlur={handleBlurUser}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          {checkValidUser ? (
            <Text
              style={{
                position: "absolute",
                top: 37,
                fontSize: 14,
                color: "red",
                paddingBottom: 5,
              }}
            >
              {errorUser}
            </Text>
          ) : (
            <Text
              style={{
                position: "absolute",
                top: 37,
                fontSize: 14,
                color: "red",
                paddingBottom: 5,
              }}
            ></Text>
          )}
        </View>

        <View style={{ position: "relative" }}>
          <InputField
            label={"Mật khẩu"}
            icon={
              <Ionicons
                name="ios-lock-closed-outline"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            inputType="password"
            keyboardType={undefined}
            fieldButtonLabel={undefined}
            fieldButtonFunction={undefined}
            onBlur={handleBlurPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={seePassword}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              top: 5,
            }}
            onPress={() => setSeePassword(!seePassword)}
          >
            {seePassword ? (
              <MaterialIcons
                name="eye-slash"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            ) : (
              <MaterialIcons
                name="eye"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            )}
          </TouchableOpacity>

          {checkValidPassword ? (
            <Text
              style={{
                position: "absolute",
                top: 37,
                fontSize: 14,
                color: "red",
                paddingBottom: 5,
              }}
            >
              {errorPassword}
            </Text>
          ) : (
            <Text
              style={{
                position: "absolute",
                top: 37,
                fontSize: 14,
                color: "red",
                paddingBottom: 5,
              }}
            ></Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        ></View>

        <CustomButton
          label={"Đăng nhập"}
          onPress={() => {
            BeautyshopLogin(username, password, navigation);
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontFamily: "DancingScript_600SemiBold",
              fontSize: 16,
            }}
          >
            Tạo tài khoản mới?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateShopScreen")}
          >
            <Text
              style={{
                color: "#AD40AF",
                fontWeight: "700",
                fontFamily: "DancingScript_600SemiBold",
                fontSize: 16,
              }}
            >
              {" "}
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BeautyShopLoginScreen;
