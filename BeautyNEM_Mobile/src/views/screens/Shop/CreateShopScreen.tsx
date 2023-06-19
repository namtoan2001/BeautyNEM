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
import registrationIMG from "../../../assets/images/misc/createShop.png";
import { LogBox } from "react-native";
import { CreateShopAccount } from "../../../../services/beautyShopRegisterService";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Formik, useFormik, Field } from "formik";
import {
  GetCities,
  GetDistricts,
} from "../../../../services/beauticianRegisterService";
import * as Yup from "yup";
import SelectBox from "react-native-multi-selectbox";

const CreateShopScreen = ({ navigation }) => {
  const phoneRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const SignupSchema = Yup.object().shape({
    taikhoan: Yup.string()
      .min(3, "Tên tài khoản quá ngắn!")
      .max(20, "Tên tài khoản quá dài!")
      .required("Tên tài khoản là bắt buộc"),
      tencuahang: Yup.string()
      .min(2, "Tên cửa hàng quá ngắn")
      .max(50, "Tên cửa hàng quá dài!")
      .required("Tên cửa hàng là bắt buộc"),
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
      thanhpho: Yup.string().required("Thành phố là bắt buộc"),
      quan: Yup.string().required("Quận là bắt buộc"),
  });

  const dataForm = {
    taikhoan: "",
    tencuahang: "",
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
      formData.append("StoreName", values.tencuahang);
      formData.append("PhoneNumber", values.sdt);
      formData.append("Password", values.matkhau);
      formData.append("DistrictId", values.quan);
      formData.append("CityId", values.thanhpho);

      CreateShopAccount(formData)
        .then((result) => {
          Alert.alert("Thông báo", "Đăng ký tài khoản chủ cửa hàng thành công");
          navigation.navigate("BeautyShopLoginScreen");
        })
        .catch((error) => {
          Alert.alert(error.response.data);
        });
    },
  });

  const [ngaysinh, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);

  const [cities, setCities] = useState([]);
  const [districts, setDisctricts] = useState([]);

  useEffect(() => {
    GetCities()
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const onGetDistricts = (CityID) => {
    GetDistricts(CityID)
      .then((response) => {
        setDisctricts(response.data);
      })
      .catch((error) => console.log(error));
  };

  function onChangeCity() {
    return (val) => {
      setDisctricts([]);
      setSelectedCity(val);
      onGetDistricts(val.id);
      formik.setFieldValue("thanhpho", val.id);
    };
  }

  function onChangeDistrict() {
    return (val) => {
      setSelectedDistrict(val);
      formik.setFieldValue("quan", val.id);
    };
  }


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
        <Text></Text>
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
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
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
          Tạo cửa hàng
        </Text>
        </View>


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

        {formik.errors.tencuahang ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.tencuahang}
          </Text>
        ) : null}
        <InputField
          label={"Tên cửa hàng"}
          icon={
            <Ionicons
              name="cart-outline"
              size={20}
              color="#FF9494"
              style={{ marginRight: 5 }}
            />
          }
          inputType={undefined}
          keyboardType={undefined}
          fieldButtonLabel={undefined}
          fieldButtonFunction={undefined}
          onChangeText={formik.handleChange("tencuahang")}
          onBlur={formik.handleBlur("tencuahang")}
          value={formik.values.tencuahang}
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
          label={"Số điện thoại của cửa hàng"}
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

{formik.errors.thanhpho ? (
            <Text
              style={{
                fontSize: 14,
                color: "red",
                paddingBottom: 5,
              }}
            >
              {formik.errors.thanhpho}
            </Text>
          ) : null}
          <SelectBox
            label="Chọn thành phố"
            value={selectedCity}
            options={cities}
            onChange={onChangeCity()}
            labelStyle={{
              fontSize: 20,
              fontFamily: "DancingScript_600SemiBold",
              fontWeight: "bold",
              color: "#FF9494",
            }}
            selectedItemStyle={{ fontSize: 15 }}
            inputPlaceholder="Chọn một thành phố"
            inputFilterStyle={{
              fontSize: 20,
              fontFamily: "DancingScript_400Regular",
            }}
            optionsLabelStyle={{
              fontSize: 19,
              fontFamily: "DancingScript_400Regular",
            }}
            hideInputFilter={false}
            containerStyle={undefined}
            inputFilterContainerStyle={undefined}
            optionContainerStyle={undefined}
            multiOptionContainerStyle={undefined}
            multiOptionsLabelStyle={undefined}
            multiListEmptyLabelStyle={undefined}
            listEmptyLabelStyle={undefined}
          />
          <Text></Text>
          {formik.errors.quan ? (
            <Text
              style={{
                fontSize: 14,
                color: "red",
                paddingBottom: 5,
              }}
            >
              {formik.errors.quan}
            </Text>
          ) : null}
          <SelectBox
            label="Chọn quận"
            value={selectedDistrict}
            options={districts}
            onChange={onChangeDistrict()}
            labelStyle={{
              fontSize: 20,
              fontFamily: "DancingScript_600SemiBold",
              fontWeight: "bold",
              color: "#FF9494",
            }}
            inputPlaceholder="Chọn một quận"
            inputFilterStyle={{
              fontSize: 20,
              fontFamily: "DancingScript_400Regular",
            }}
            optionsLabelStyle={{
              fontSize: 19,
              fontFamily: "DancingScript_400Regular",
            }}
            selectedItemStyle={{ fontSize: 15 }}
            hideInputFilter={false}
            containerStyle={undefined}
            inputFilterContainerStyle={undefined}
            optionContainerStyle={undefined}
            multiOptionContainerStyle={undefined}
            multiOptionsLabelStyle={undefined}
            multiListEmptyLabelStyle={undefined}
            listEmptyLabelStyle={undefined}
          />
        <Text></Text>
        

        <CustomButton label={"Đăng ký"} onPress={formik.handleSubmit} />
        <Text> </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
            width: "90%",
          }}
        >

          <Text
            style={{
              fontWeight: "700",
              fontFamily: "DancingScript_600SemiBold",
              fontSize: 20,
            }}
          >
            Bạn đã có cửa hàng?
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

      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateShopScreen;
