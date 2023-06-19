import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  DancingScript_400Regular,
  DancingScript_500Medium,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from "@expo-google-fonts/dancing-script";
import { useFonts } from "expo-font";
import registrationIMG from "../../../assets/images/misc/customerRegister.png";
import { LogBox } from "react-native";
import { CreateAccount } from "../../../../services/customerRegisterService";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Formik, useFormik, Field } from "formik";
import * as Yup from "yup";

const RegisterScreen = ({ navigation }) => {
  const phoneRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const SignupSchema = Yup.object().shape({
    taikhoan: Yup.string()
      .min(3, "Tên tài khoản quá ngắn!")
      .max(20, "Tên tài khoản quá dài!")
      .matches(/^\S+$/, "Tên tài khoản không được chứa khoảng trắng!")
      .required("Tên tài khoản là bắt buộc"),
    hovaten: Yup.string()
      .min(2, "Họ và tên quá ngắn")
      .max(50, "Họ và tên quá dài!")
      .required("Họ và tên là bắt buộc"),
    sdt: Yup.string()
      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
      .required("Số điện thoại là bắt buộc"),
    matkhau: Yup.string()
      .required("Mật khẩu là bắt buộc")
      .min(5, "Mật khẩu quá ngắn!")
      .max(20, "Mật khẩu quá dài!"),
    nhaplaimatkhau: Yup.string()
      .oneOf(
        [Yup.ref("matkhau"), null],
        "Mật khẩu nhập lại phải giống mật khẩu"
      )
      .required("Nhập lại mật khẩu là bắt buộc"),
    ngaysinh: Yup.string().required("Ngày sinh là bắt buộc").test("future-date", "Ngày sinh không thể là ngày trong tương lai", function(value) {
      const selectedDate = new Date(value);
      const today = new Date();
      return selectedDate <= today;
    }),
    diachi: Yup.string().required("Địa chỉ là bắt buộc"),
  });

  const dataForm = {
    taikhoan: "",
    hovaten: "",
    sdt: "",
    matkhau: "",
    nhaplaimatkhau: "",
    ngaysinh: "",
    diachi: "",
  };

  const formik = useFormik({
    initialValues: { dataForm },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("Username", values.taikhoan);
      formData.append("FullName", values.hovaten);
      formData.append("PhoneNumber", values.sdt);
      formData.append("Password", values.matkhau);

      var dateParts = values.ngaysinh.split("/");

      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      var date =
        dateObject.getUTCFullYear() +
        "-" +
        ("00" + (dateObject.getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("00" + dateObject.getUTCDate()).slice(-2) +
        " " +
        ("00" + dateObject.getUTCHours()).slice(-2) +
        ":" +
        ("00" + dateObject.getUTCMinutes()).slice(-2) +
        ":" +
        ("00" + dateObject.getUTCSeconds()).slice(-2);
      formData.append("BirthDate", values.ngaysinh);
      formData.append("Address", values.diachi);

      CreateAccount(formData)
        .then((result) => {
          Alert.alert("Thông báo", "Đăng ký tài khoản khách hàng thành công");
          navigation.navigate("CustomerLoginScreen");
        })
        .catch((error) => {
          Alert.alert(error.response.data);
        });
    },
  });

  const [ngaysinh, setDate] = useState(new Date());
  const [dobLabel, setDobLabel] = useState("Ngày sinh");
  const [show, setShow] = useState(false);

  const onChange = (e, selectedDate) => {
    const currentDate = selectedDate || ngaysinh;
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setDobLabel(fDate);
    formik.setFieldValue("ngaysinh", fDate);
    setShow(false);
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  let [fontsLoaded, error] = useFonts({
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
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25, position: "relative" }}
      >
        <View style={{ alignItems: "center" }}></View>
        <Image
          source={JSON.parse(registrationIMG)}
          style={{ width: "100%", height: null, aspectRatio: 500 / 300 }}
        ></Image>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ position: "absolute", top: 40, left: -4 }}
        >
          <Ionicons name="arrow-back" color="black" size={30} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 30,
            fontFamily: "DancingScript_600SemiBold",
            fontWeight: "500",
            color: "#333",
            marginBottom: 20,
            marginTop: 15,
          }}
        >
          Đăng ký tài khoản khách hàng
        </Text>

        {formik.errors.taikhoan ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.taikhoan}
          </Text>
        ) : null}
        <InputField
          label={"Tên tài khoản"}
          icon={
            <Ionicons
              name="person-circle-outline"
              size={20}
              color="#FF9494"
              style={{ marginRight: 5 }}
            />
          }
          inputType={undefined}
          keyboardType={undefined}
          fieldButtonLabel={undefined}
          fieldButtonFunction={undefined}
          onChangeText={formik.handleChange("taikhoan")}
          onBlur={formik.handleBlur("taikhoan")}
          value={formik.values.taikhoan}
          secureTextEntry={undefined}
        />

        {formik.errors.hovaten ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.hovaten}
          </Text>
        ) : null}
        <InputField
          label={"Họ và tên"}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#FF9494"
              style={{ marginRight: 5 }}
            />
          }
          inputType={undefined}
          keyboardType={undefined}
          fieldButtonLabel={undefined}
          fieldButtonFunction={undefined}
          onChangeText={formik.handleChange("hovaten")}
          onBlur={formik.handleBlur("hovaten")}
          value={formik.values.hovaten}
          secureTextEntry={undefined}
        />

        {formik.errors.sdt ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.sdt}
          </Text>
        ) : null}
        <InputField
          label={"Số điện thoại"}
          icon={
            <MaterialIcons
              name="phone"
              size={20}
              color="#FF9494"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType={undefined}
          inputType="integer"
          fieldButtonLabel={undefined}
          fieldButtonFunction={undefined}
          onChangeText={formik.handleChange("sdt")}
          onBlur={formik.handleBlur("sdt")}
          value={formik.values.sdt}
          secureTextEntry={undefined}
        />

        {formik.errors.diachi ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.diachi}
          </Text>
        ) : null}
        <InputField
          label={"Địa chỉ"}
          icon={
            <AntDesign
              name="enviroment"
              size={20}
              color="#FF9494"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType={undefined}
          inputType="integer"
          fieldButtonLabel={undefined}
          fieldButtonFunction={undefined}
          onChangeText={formik.handleChange("diachi")}
          onBlur={formik.handleBlur("diachi")}
          value={formik.values.diachi}
          secureTextEntry={undefined}
        />

        {formik.errors.matkhau ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.matkhau}
          </Text>
        ) : null}
        <InputField
          label={"Mật khẩu"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#FF9494"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
          keyboardType={undefined}
          fieldButtonLabel={undefined}
          fieldButtonFunction={undefined}
          onChangeText={formik.handleChange("matkhau")}
          onBlur={formik.handleBlur("matkhau")}
          value={formik.values.matkhau}
          secureTextEntry={true}
        />
        {formik.errors.nhaplaimatkhau ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.nhaplaimatkhau}
          </Text>
        ) : null}
        <InputField
          label={"Nhập lại mật khẩu"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#FF9494"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
          keyboardType={undefined}
          fieldButtonLabel={undefined}
          fieldButtonFunction={undefined}
          onChangeText={formik.handleChange("nhaplaimatkhau")}
          onBlur={formik.handleBlur("nhaplaimatkhau")}
          value={formik.values.nhaplaimatkhau}
          secureTextEntry={true}
        />

        {formik.errors.ngaysinh ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.ngaysinh}
          </Text>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#FF9494"
            style={{ marginRight: 5 }}
          />
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text style={{ color: "#666", marginLeft: 5, marginTop: 5 }}>
              {dobLabel}
            </Text>
            {show && (
              <DateTimePicker
                value={ngaysinh}
                mode={"date"}
                display="default"
                onChange={onChange}
              />
            )}
          </TouchableOpacity>
        </View>

        <CustomButton label={"Đăng ký"} onPress={formik.handleSubmit} />
        <Text> </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
            width:"90%",
          }}
        >
          
          <Text
            style={{
              fontWeight: "700",
              fontFamily: "DancingScript_600SemiBold",
              fontSize: 20,
            }}
          >
            Bạn đã có tài khoản?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CustomerLoginScreen");
            }}
          >
            <Text
              style={{
                color: "#FF9494",
                fontWeight: "700",
                fontFamily: "DancingScript_600SemiBold",
                fontSize: 20,
              }}
            >
              {" "}
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
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
              fontSize: 13,
            }}
          >
            Bạn muốn đăng ký tài khoản dành cho thợ làm đẹp?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text
              style={{
                color: "#FF9494",
                fontWeight: "700",
                fontFamily: "DancingScript_600SemiBold",
                fontSize: 13,
              }}
            >
              {" "}
              Ấn vào đây
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default RegisterScreen;
