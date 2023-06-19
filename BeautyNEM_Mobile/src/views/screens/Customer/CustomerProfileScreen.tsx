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
import InputFieldForModal from "../../components/InputFieldForModal";
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
import { GetCustomerByID } from "../../../../services/customerRegisterService";
import {
  EditCustomerAccount,
  GetCustomerProfile,
  ChangePassword,
} from "../../../../services/customerProfileService";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Formik, useFormik, Field } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { Modal } from "../../components/Modal";
import { ModalButton } from "../../components/ModalButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    paddingTop: 10,
    borderColor: "grey",
    borderBottomWidth: 2,
  },
  button: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    width: "80%",
    height: "35%",
    justifyContent: "center",
    textAlign: "left",
  },
});

const CustomerProfileScreen = ({ navigation }) => {
  const phoneRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Tên tài khoản quá ngắn!")
      .max(20, "Tên tài khoản quá dài!")
      .required("Tên tài khoản là bắt buộc"),
    fullName: Yup.string()
      .min(2, "Họ và tên quá ngắn")
      .max(50, "Họ và tên quá dài!")
      .required("Họ và tên là bắt buộc"),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
      .required("Số điện thoại là bắt buộc"),
    birthDate: Yup.string().required("Ngày sinh là bắt buộc").test("future-date", "Ngày sinh không thể là ngày trong tương lai", function(value) {
      const dateParts = value.split("/");
      const selectedDate = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]));
      
      const today = new Date();
      return selectedDate <= today;
    }),
    address: Yup.string().required("Địa chỉ là bắt buộc"),
  });
  const ChangePasswordValidate = Yup.object().shape({
    matkhaucu: Yup.string()
      .required("Mật khẩu cũ là bắt buộc")
      .min(5, "Mật khẩu quá ngắn!")
      .max(20, "Mật khẩu quá dài!"),
    matkhaumoi: Yup.string()
      .required("Mật khẩu mới là bắt buộc")
      .min(5, "Mật khẩu quá ngắn!")
      .max(20, "Mật khẩu quá dài!"),
    nhaplaimatkhaumoi: Yup.string()
      .oneOf(
        [Yup.ref("matkhaumoi"), null],
        "Mật khẩu nhập lại mới phải giống mật khẩu mới"
      )
      .required("Nhập lại mật khẩu mới là bắt buộc"),
  });

  const dataForm = {
    id: "",
    username: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    birthDate: "",
  };

  const dataFormPassword = {
    matkhaucu: "",
    matkhaumoi: "",
    nhaplaimatkhaumoi: "",
  };

  const [ngaysinh, setDate] = useState(new Date());
  const [dobLabel, setDobLabel] = useState("Ngày sinh");
  const [show, setShow] = useState(false);
  const [account, setAccount] = useState(dataForm);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
 
  const handleDecline = () => setIsModalVisible(() => !isModalVisible);

  const formikPassword = useFormik({
    initialValues: { dataFormPassword },
    validationSchema: ChangePasswordValidate,
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("matKhauCu", values.matkhaucu);
      formData.append("matKhauMoi", values.matkhaumoi);
      Alert.alert("Thông báo", "Bạn có muốn thay đổi mật khẩu không?", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            ChangePassword(formData)
              .then((result) => {
                Alert.alert("Thông báo", "Thay đổi mật khẩu thành công");
                setIsModalVisible(() => !isModalVisible);
              })
              .catch((error) => {
                Alert.alert(error.response.data);
                console.log(error);
              });
          },
        },
      ]);
    },
  });

  const formik = useFormik({
    initialValues: { dataForm },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      let formData = new FormData();
      console.log(values);
      formData.append("Id", values.id);
      formData.append("FullName", values.fullName);
      formData.append("PhoneNumber", values.phoneNumber);
      formData.append("BirthDate", values.birthDate);
      formData.append("Address", values.address);
      Alert.alert("Thông báo", "Bạn có muốn chỉnh sửa thông tin tài khoản?", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            EditCustomerAccount(formData)
              .then((result) => {
                Alert.alert(
                  "Thông báo",
                  "Chỉnh sửa tài khoản khách hàng thành công"
                );
                navigation.goBack();
              })
              .catch((error) => {
                Alert.alert(error.response.data);
                console.log(error);
              });
          },
        },
      ]);
    },
  });

  const onChange = (e, selectedDate) => {
    const currentDate = selectedDate || ngaysinh;
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate =
    (tempDate.getMonth() + 1)
       +
      "/" +
      tempDate.getDate() +
      "/" +
      tempDate.getFullYear();
    let lDate = tempDate.getDate()    
    +
   "/" +
   (tempDate.getMonth() + 1) +
   "/" +
   tempDate.getFullYear();
    setDobLabel(lDate);
    formik.setFieldValue("birthDate", fDate);
    setShow(false);
  };

  useEffect(() => {
    GetCustomerProfile()
      .then((response) => {
        setAccount(response.data);
        formik.setFieldValue("id", response.data.id);
        formik.setFieldValue("username", response.data.username);
        formik.setFieldValue("fullName", response.data.fullName);
        formik.setFieldValue("phoneNumber", response.data.phoneNumber);
        formik.setFieldValue("address", response.data.address);
        const currentDate = response.data.birthDate;
        let tempDate = new Date(currentDate);
        let fDate =
          tempDate.getDate() +
          "/" +
          (tempDate.getMonth() + 1) +
          "/" +
          tempDate.getFullYear();
        formik.setFieldValue("birthDate", fDate);
        setDobLabel(fDate);
      })
      .catch((error) => {
        console.log(error);
      });
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
        style={{ paddingHorizontal: 25 }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "30%",
            width: "100%",
            marginTop: 13,
          }}
        >
          <Ionicons name="person-circle-outline" size={200} color="#FF9494" />
          <Text
            style={{
              fontSize: 35,
              fontFamily: "DancingScript_700Bold",
              fontWeight: "500",
              color: "#333",
              marginBottom: 25,
            }}
          >
            {account.fullName}
          </Text>
        </View>
        <Text></Text>
        <Text></Text>
        <Text></Text>

        {formik.errors.fullName ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.fullName}
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
          onChangeText={formik.handleChange("fullName")}
          onBlur={formik.handleBlur("fullName")}
          value={formik.values.fullName}
          secureTextEntry={undefined}
        />

        {formik.errors.phoneNumber ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.phoneNumber}
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
          onChangeText={formik.handleChange("phoneNumber")}
          onBlur={formik.handleBlur("phoneNumber")}
          value={formik.values.phoneNumber}
          secureTextEntry={undefined}
        />

        {formik.errors.address ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.address}
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
          onChangeText={formik.handleChange("address")}
          onBlur={formik.handleBlur("address")}
          value={formik.values.address}
          secureTextEntry={undefined}
        />
        {formik.errors.birthDate ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              paddingBottom: 5,
            }}
          >
            {formik.errors.birthDate}
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
              fontSize: 15,
            }}
          >
            Bạn muốn đổi mật khẩu?
          </Text>

          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text
              style={{
                color: "#FF9494",
                fontWeight: "700",
                fontFamily: "DancingScript_600SemiBold",
                fontSize: 15,
              }}
            >
              {" "}
              Ấn vào đây
            </Text>
          </TouchableOpacity>
        </View>

        <CustomButton label={"Chỉnh Sửa"} onPress={formik.handleSubmit} />

        <Modal isVisible={isModalVisible}>
          <Modal.Container>
            <View style={styles.modal}>
              <Text
                style={{
                  fontSize: 35,
                  fontFamily: "DancingScript_700Bold",
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: 20,
                  marginTop: 15,
                }}
              >
                Thay đổi mật khẩu
              </Text>
              <Text></Text>
              <View style={styles.view}>
                {formikPassword.errors.matkhaucu ? (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "red",
                      paddingBottom: 5,
                    }}
                  >
                    {formikPassword.errors.matkhaucu}
                  </Text>
                ) : null}

                <InputFieldForModal
                  label={"Mật khẩu cũ"}
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
                  onChangeText={formikPassword.handleChange("matkhaucu")}
                  onBlur={formikPassword.handleBlur("matkhaucu")}
                  value={formikPassword.values.matkhaucu}
                  secureTextEntry={true}
                  placeholderTextColor={"gray"}
                />
                {formikPassword.errors.matkhaumoi ? (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "red",
                      paddingBottom: 5,
                    }}
                  >
                    {formikPassword.errors.matkhaumoi}
                  </Text>
                ) : null}
                <InputFieldForModal
                  label={"Mật khẩu mới"}
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
                  onChangeText={formikPassword.handleChange("matkhaumoi")}
                  onBlur={formikPassword.handleBlur("matkhaumoi")}
                  value={formikPassword.values.matkhaumoi}
                  secureTextEntry={true}
                  placeholderTextColor={"gray"}
                />
                {formikPassword.errors.nhaplaimatkhaumoi ? (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "red",
                      paddingBottom: 5,
                    }}
                  >
                    {formikPassword.errors.nhaplaimatkhaumoi}
                  </Text>
                ) : null}
                <InputFieldForModal
                  label={"Nhập lại mật khẩu mới"}
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
                  onChangeText={formikPassword.handleChange(
                    "nhaplaimatkhaumoi"
                  )}
                  onBlur={formikPassword.handleBlur("nhaplaimatkhaumoi")}
                  value={formikPassword.values.nhaplaimatkhaumoi}
                  secureTextEntry={true}
                  placeholderTextColor={"gray"}
                />
              </View>

              <Modal.Footer>
                <View style={styles.button}>
                  <ModalButton title="Hủy" onPress={handleDecline} />
                  <ModalButton
                    title="Đồng ý thay đổi"
                    onPress={formikPassword.handleSubmit}
                  />
                </View>
              </Modal.Footer>
            </View>
          </Modal.Container>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CustomerProfileScreen;
