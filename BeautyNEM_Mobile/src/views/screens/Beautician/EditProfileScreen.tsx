import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";

import { useTheme } from "react-native-paper";
import { Header } from "@rneui/themed";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectBox from "react-native-multi-selectbox";
import { Modal } from "../../components/Modal";
import { ModalButton } from "../../components/ModalButton";
import InputFieldForModal from "../../components/InputFieldForModal";
import * as ImagePicker from "expo-image-picker";
import {
  GetBeauticianDetailsWithToken,
  GetCities,
  GetDistricts,
  UpdateBeauticianInfo,
  GetBeauticianDetails,
  UpdatePasswordBeautician,
  GetAvatarWithToken,
  UpdateBeauticianAvatar,
} from "../../../../services/BeauticianProfileService";
import * as Yup from "yup";
import { useFormik } from "formik";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const EditProfileScreen = ({ navigation }) => {
  const dataForm = {
    id: "",
    fullName: "",
    city: "",
    district: "",
    birthDate: "",
  };

  const dataAvatar = {
    beauticianId: "",
    avatarName: "avatar.png",
    avatarUrl: "",
  };

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

  const dataFormPassword = {
    matkhaucu: "",
    matkhaumoi: "",
    nhaplaimatkhaumoi: "",
  };

  const [refreshing, setRefreshing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formDate, setFormDate] = useState("");
  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState(dataAvatar);
  const [beauticianId, setBeauticianId] = useState();
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDisctricts] = useState([]);
  const [city, setCity] = useState();
  const [cityId, setCityId] = useState();
  const [districtId, setDistrictId] = useState();

  useEffect(() => {
    GetCities()
      .then((response) => {
        setCities(response.data);
        const idCity = response.data.filter((cities) => {
          return cities.item === city;
        });
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    GetBeauticianDetailsWithToken()
      .then((response) => {
        GetBeauticianDetails(response.data.id)
          .then((response) => {
            formik.setFieldValue("id", response.data.id);
            formik.setFieldValue("fullName", response.data.fullName);
            formik.setFieldValue("city", response.data.city);
            formik.setFieldValue("district", response.data.district);
            setCity(response.data.city);
            const currentDate = response.data.birthDate;
            let tempDate = new Date(currentDate);
            let fDate =
              tempDate.getDate() +
              "/" +
              (tempDate.getMonth() + 1) +
              "/" +
              tempDate.getFullYear();
            formik.setFieldValue("birthDate", fDate);
            setFormDate(fDate);
          })
          .catch((error) => {
            console.log(`Không lấy được thông tin: ` + error);
          });
        GetDistricts(response.data.cityId)
          .then((response) => {
            setDisctricts(response.data);
          })
          .catch((error) => console.log(error));
        setBeauticianId(response.data.id);
        setCityId(response.data.cityId);
        setDistrictId(response.data.districtId);
      })
      .catch((error) => {
        console.log(`Không lấy được thông tin: ` + error);
      });
    GetAvatarWithToken()
      .then((response) => {
        setAvatar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshing]);

  useEffect(() => {
    formik.setFieldValue("city", cityId);
    formik.setFieldValue("district", districtId);
  }, [refreshing]);

  const onChangeCity = () => {
    return (val) => {
      setSelectedCity(val);
      onGetDistricts(val.id);
      setCityId(val.id);
    };
  };

  const onChangeDistrict = () => {
    return (val) => {
      setSelectedDistrict(val);
      setDistrictId(val.id);
    };
  };

  const onGetDistricts = (CityID) => {
    GetDistricts(CityID)
      .then((response) => {
        setDisctricts(response.data);
      })
      .catch((error) => console.log(error));
  };

  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Vui lòng không bỏ trống")
      .min(2, "Họ và tên quá ngắn")
      .max(30, "Họ và tên quá dài!"),
    birthDate: Yup.string()
      .required("Ngày sinh là bắt buộc")
      .test(
        "future-date",
        "Ngày sinh không thể vượt quá ngày hiện hiện tại",
        function (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          return selectedDate <= today;
        }
      ),
  });

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleDecline = () => setIsModalVisible(() => !isModalVisible);

  const formikPassword = useFormik({
    initialValues: { dataFormPassword },
    validationSchema: ChangePasswordValidate,
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("oldPassword", values.matkhaucu);
      formData.append("newPassword", values.matkhaumoi);
      console.log(values);
      Alert.alert("Thông báo", "Bạn có muốn thay đổi mật khẩu không?", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            UpdatePasswordBeautician(formData)
              .then((result) => {
                Alert.alert("Thông báo", "Thay đổi mật khẩu thành công");
                setIsModalVisible(() => !isModalVisible);
                console.log(result);
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
      formData.append("BirthDate", values.birthDate);
      formData.append("CityId", cityId);
      formData.append("DistrictId", districtId);
      Alert.alert("Thông báo", "Bạn có muốn lưu thông tin chỉnh sửa?", [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            UpdateBeauticianInfo(formData)
              .then((response) => {
                Alert.alert("Thông báo", "Cập nhật thông tin thành công");
                navigation.navigate("ProfileScreen");
              })
              .catch((error) => {
                Alert.alert(error.response.data);
              });
          },
        },
      ]);
    },
  });

  // const onChange = (e, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setDate(currentDate);
  //   let tempDate = new Date(currentDate);
  //   let fDate =
  //     tempDate.getDate() +
  //     "/" +
  //     (tempDate.getMonth() + 1) +
  //     "/" +
  //     tempDate.getFullYear();
  //   setFormDate(fDate);
  //   formik.setFieldValue("birthDate", fDate);
  //   setShow(false);
  // };

  const onChange = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setFormDate(fDate);
    formik.setFieldValue("birthDate", fDate);
    setShow(false);
  };

  const uploadAvt = async () => {
    setRefreshing(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.cancelled === false) {
      if (result.fileSize >= 3145728) {
        Alert.alert("Hình ảnh không được lớn hơn 3MB.");
      } else {
        var today = new Date();
        var date = `${today.getSeconds()}${today.getMinutes()}${today.getHours()}${today.getDate()}${
          today.getMonth() + 1
        }${today.getFullYear()}`;
        const uri =
          Platform.OS === "android"
            ? result.uri
            : result.uri.replace("file://", "");
        const filename = result.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename as string);
        const ext = match?.[1];
        const type = match ? `image/${match[1]}` : `image`;
        const formData = new FormData();
        formData.append("beauticianId", beauticianId);
        formData.append("avtImgFile", {
          uri,
          name: `image${date}.${ext}`,
          type,
        } as any);
        UpdateBeauticianAvatar(formData)
          .then((result) => {
            Alert.alert("Cập nhật ảnh đại diện thành công!");
            wait(2000).then(() => setRefreshing(true));
          })
          .catch((err) => {
            Alert.alert(err.response.data);
          });
      }
    }
  };

  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.context}>
        <TouchableOpacity onPress={uploadAvt}>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              source={{
                uri: `https://res.cloudinary.com/dpwifnuax/image/upload/BeauticianAvatar/Id_${avatar.beauticianId}/${avatar.avatarName}`,
              }}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderRadius: 15 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="camera"
                  size={35}
                  color="#fff"
                  style={{
                    opacity: 0.7,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#fff",
                    borderRadius: 10,
                  }}
                />
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.action}>
        <FontAwesome name="user-o" color="#FF9494" size={20} />
        <TextInput
          placeholder="Họ và tên"
          placeholderTextColor="#666666"
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={formik.handleChange("fullName")}
          onBlur={formik.handleBlur("fullName")}
          value={formik.values.fullName}
        />
      </View>
      {formik.errors.fullName ? (
        <Text
          style={{
            fontSize: 14,
            color: "red",
            paddingBottom: 5,
            marginLeft: 10,
          }}
        >
          {formik.errors.fullName}
        </Text>
      ) : null}
      <View style={styles.action}>
        <Icons name="calendar-outline" size={20} color="#FF9494" />
        <TouchableOpacity onPress={() => setShow(true)}>
          <Text style={styles.textInput}>{formDate}</Text>
          {show && (
            <DateTimePicker
              value={date}
              mode={"date"}
              display="default"
              onChange={onChange}
            />
          )}
        </TouchableOpacity>
      </View>
      {formik.errors.birthDate ? (
        <Text
          style={{
            fontSize: 14,
            color: "red",
            paddingBottom: 5,
            marginLeft: 10,
          }}
        >
          {formik.errors.birthDate}
        </Text>
      ) : null}

      <SafeAreaView>
        <SelectBox
          label="Chọn thành phố"
          value={selectedCity}
          options={cities}
          onChange={onChangeCity()}
          labelStyle={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#FF9494",
            marginLeft: 10,
          }}
          selectedItemStyle={{ fontSize: 15, marginLeft: 20 }}
          inputPlaceholder={formik.values.city}
          inputFilterStyle={{
            fontSize: 20,
            marginLeft: 20,
          }}
          optionsLabelStyle={{
            fontSize: 18,
            marginLeft: 20,
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
        <SelectBox
          label="Chọn quận"
          value={selectedDistrict}
          options={districts}
          onChange={onChangeDistrict()}
          labelStyle={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#FF9494",
            marginLeft: 10,
            marginTop: 10,
          }}
          inputPlaceholder={formik.values.district}
          inputFilterStyle={{
            fontSize: 20,
            marginLeft: 20,
          }}
          optionsLabelStyle={{
            fontSize: 18,
            marginLeft: 20,
          }}
          selectedItemStyle={{ fontSize: 15, marginLeft: 20 }}
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

      <TouchableOpacity
        style={styles.commandButton}
        onPress={formik.handleSubmit}
      >
        <Text style={styles.panelButtonTitle}>Cập nhật</Text>
      </TouchableOpacity>

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
                  <Icons
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
                  <Icons
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
                  <Icons
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
                onChangeText={formikPassword.handleChange("nhaplaimatkhaumoi")}
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
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    position: "relative",
  },
  iconBack: {
    position: "absolute",
    top: 46,
    left: 8,
  },
  context: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  commandButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FF9494",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  renderHeader: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#666",
    fontSize: 15,
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginLeft: 8,
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
  selectedTextStyle: {
    fontSize: 20,
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
