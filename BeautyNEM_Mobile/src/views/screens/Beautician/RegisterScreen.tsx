import { StatusBar } from "expo-status-bar";
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
import AppLoading from "expo-app-loading";
import registrationIMG from "../../../assets/images/misc/registrationPic.png";
import SelectBox from "react-native-multi-selectbox";
import { LogBox } from "react-native";
import {
  CreateAccount,
  GetCities,
  GetDistricts,
  GetServices,
} from "../../../../services/beauticianRegisterService";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Formik, useFormik, Field } from "formik";
import * as Yup from "yup";
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#37d5d2a2",
    paddingTop: 30,
    flex: 1,
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 20,
    fontFamily: "DancingScript_600SemiBold",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 15,
    fontFamily: "DancingScript_600SemiBold",
  },
});

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
    ngaysinh: Yup.string()
      .required("Ngày sinh là bắt buộc")
      .test(
        "future-date",
        "Ngày sinh không thể là ngày trong tương lai",
        function (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          return selectedDate <= today;
        }
      ),
    thanhpho: Yup.string().required("Thành phố là bắt buộc"),
    quan: Yup.string().required("Quận là bắt buộc"),
    dichvu: Yup.string().required("Phải có ít nhất một dịch vụ"),
  });

  const dataForm = {
    taikhoan: "",
    hovaten: "",
    sdt: "",
    matkhau: "",
    nhaplaimatkhau: "",
    ngaysinh: "",
    thanhpho: "",
    quan: "",
    dichvu: "",
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
      formData.append("BirthDate", values.ngaysinh);
      formData.append("CityId", values.thanhpho);
      formData.append("DistrictId", values.quan);
      formData.append("ServiceIds", values.dichvu);

      CreateAccount(formData)
        .then((result) => {
          Alert.alert("Thông báo", "Đăng ký tài khoản thợ làm đẹp thành công");
          navigation.navigate("BeauticianLogin");
        })
        .catch((error) => {
          Alert.alert(error.response.data);
        });
    },
  });

  const [ngaysinh, setDate] = useState(new Date());
  const [dobLabel, setDobLabel] = useState("Ngày sinh");
  const [show, setShow] = useState(false);
  const [selectedSers, setSelectedSers] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);

  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  const [districts, setDisctricts] = useState([]);

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

  useEffect(() => {
    GetCities()
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.log(error));

    GetServices()
      .then((response) => {
        setServices(response.data);
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

  let [fontsLoaded, error] = useFonts({
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  const renderDataItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.item}</Text>
        <AntDesign style={styles.icon} color="#FF9494" name="plus" size={20} />
      </View>
    );
  };

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
          Đăng ký tài khoản thợ làm đẹp
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
        {formik.errors.dichvu ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.dichvu}
          </Text>
        ) : null}
        <SafeAreaView>
          <View>
            <MultiSelect
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={services}
              labelField="item"
              valueField="id"
              placeholder="Chọn một hoặc nhiều dịch vụ làm đẹp"
              placeholderStyle={{
                fontSize: 20,
                fontFamily: "DancingScript_600SemiBold",
                fontWeight: "bold",
              }}
              value={selectedSers}
              search
              searchPlaceholder="Tìm kiếm dịch vụ..."
              onChange={(item) => {
                setSelectedSers(item);
                var ids = item.join(";");
                formik.setFieldValue("dichvu", ids);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="#FF9494"
                  name="heart"
                  size={15}
                />
              )}
              renderItem={renderDataItem}
              renderSelectedItem={(itemed, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(itemed)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{itemed.item}</Text>
                    <AntDesign color="#FF9494" name="delete" size={15} />
                  </View>
                </TouchableOpacity>
              )}
            />
            <StatusBar />
          </View>
          <Text></Text>
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
        </SafeAreaView>
        <Text></Text>
        <Text></Text>

        <CustomButton label={"Đăng ký"} onPress={formik.handleSubmit} />
        <Text> </Text>
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
              fontSize: 20,
            }}
          >
            Bạn đã có tài khoản?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("BeauticianLogin")}
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
            width: "90%",
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
            Bạn muốn đăng ký tài khoản dành cho khách hàng?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("CustomerRegisterScreen")}
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
