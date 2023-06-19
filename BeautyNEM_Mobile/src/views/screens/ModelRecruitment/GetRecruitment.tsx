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
import { COLORS, SIZES, FONTS } from "../../constants";
import {
  DancingScript_400Regular,
  DancingScript_500Medium,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from "@expo-google-fonts/dancing-script";
import { useFonts } from "expo-font";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Formik, useFormik, Field } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { Modal } from "../../components/Modal";
import { ModalButton } from "../../components/ModalButton";
import FooterCustomerModelRecruitmentBooking from "../../components/FooterCustomerModelRecruitmentBooking";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GetCustomerProfile } from "../../../../services/customerProfileService";
import {
  CustomerGetSkill,
  CustomerGetSchedule,
  CustomerBookingModelRecruit,
} from "../../../../services/customerBookingSerivce";
import moment, { locale } from "moment";
import { useIsFocused } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { LogBox } from "react-native";
import { GetBeauticianDetails } from "../../../../services/BeauticianDetailsService";
import { AddNotificationRMForBeautician } from "../../../../services/notificationBeauticianService";
import { GetTokenDevice } from "../../../../services/tokenDeviceService";
import { sendPushNotification } from "../../../../services/ExpoPushNotificationService";
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  items: {
    width: "50%",
  },
  viewFilter: { paddingLeft: 30, paddingTop: 0, paddingBottom: 10 },
  serviceButton: {
    alignSelf: "flex-end",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#A9A9A9",
    margin: 5,
    padding: 5,
  },
  serviceButtonOnPress: {
    alignSelf: "flex-end",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF9494",
    margin: 5,
    padding: 5,
  },
  serviceTitle: {
    fontSize: 12,
    color: "#A9A9A9",
  },
  serviceTitleOnPress: {
    fontSize: 12,
    color: "#FF9494",
  },
  button: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    width: "80%",
    height: "60%",
    justifyContent: "center",
    textAlign: "left",
  },
});

const CustomerBookingScreen = ({ navigation, route, props }) => {
  const data = route.params;
  const isFocused = useIsFocused();
  const [choosedServices, setChoosedServices] = useState([]);
  const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const [sum, setSum] = useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isPress, setIsPress] = useState(false);
  const [beautician, setBeautician] = useState<any[]>([]);

  const [text, setText] = useState(data.description.slice(0, 100));
  const [readMore, setReadMore] = useState(false);

  const handleDecline = () => setIsModalVisible(() => !isModalVisible);

  const Validate = Yup.object().shape({
    address: Yup.string().required("Địa chỉ là bắt buộc"),
    note: Yup.string().max(90, "Vui lòng nhập dưới 90 ký tự"),
  });

  const dataForm = {
    address: "",
    choosedServices: "",
    note: "",
    chooseSchedule: "",
  };

  const formik = useFormik({
    initialValues: { dataForm },
    component: { FooterCustomerModelRecruitmentBooking },
    validationSchema: Validate,
    onSubmit: (values) => {
      setIsModalVisible(true);
    },
  });

  let [fontsLoaded, error] = useFonts({
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  const onPushNotification = async () => {
    const customer = JSON.parse(await AsyncStorage.getItem("userInfo"));
    GetTokenDevice({
      userId: data.beauticianId,
      role: "Beautician",
    }).then(async (response) => {
      const token = response.data;
      if (token) {
        const message = {
          body: "Bạn có một yêu cầu đặt tuyển mẫu từ " + customer.fullName,
          sound: "default",
          data: {},
        };
        await sendPushNotification(token, message);
      }
    });
  };

  const onBookingModelRecruitment = () => {
    let formData = new FormData();

    formData.append("beauticianId", data.beauticianId);
    formData.append("ModelServiceId", data.id);
    formData.append("CustomerId", formik.values.customerID);
    formData.append("Address", formik.values.address);
    formData.append("Note", formik.values.note);

    //console.log(formData);

    Alert.alert("Thông báo", "Xác nhận đặt lịch", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          CustomerBookingModelRecruit(formData)
            .then(async (result) => {
              const eventRmId = result.data;
              // console.log(result);
              if (eventRmId) {
                let customer = JSON.parse(
                  await AsyncStorage.getItem("userInfo")
                );
                let formData = new FormData();
                formData.append(
                  "Title",
                  "Yêu cầu đặt tuyển mẫu từ " + customer.fullName
                );
                formData.append("BeauticianId", data.beauticianId);
                formData.append("EventRMId", eventRmId);
                formData.append("Address", formik.values.address);
                formData.append("Content", formik.values.note);
                // console.log(formData);

                AddNotificationRMForBeautician(formData)
                  .then((response) => {
                    if (response.data) onPushNotification();
                  })
                  .catch((error) => {
                    Alert.alert(error.response.data);
                  });
              }

              Alert.alert(
                "Thông báo",
                "Đặt lịch thành công, vui lòng đợi thợ làm đẹp liên hệ đến bạn!"
              );
              navigation.navigate("ModelRecruitment");
            })
            .catch((error) => {
              Alert.alert(error.response.data);
            });
        },
      },
    ]);
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    GetCustomerProfile()
      .then((response) => {
        formik.setFieldValue("customerID", response.data.id);
        formik.setFieldValue("address", response.data.address);
        formik.setFieldValue("name", data.name);
        formik.setFieldValue("note", "");
      })
      .catch((error) => {
        console.log(error);
      });
    GetBeauticianDetails(data.beauticianId)
      .then((response) => {
        setBeautician(response.data);
        // console.log(beautician);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              width: "90%",
            }}
          >
            <Text></Text>
            <Text
              style={{
                alignItems: "center",
                fontSize: 15,
                color: "black",
                marginBottom: 15,
                fontWeight: "bold",
              }}
            >
              Nhập địa chỉ:
            </Text>
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
              inputType={undefined}
              fieldButtonLabel={undefined}
              fieldButtonFunction={undefined}
              onChangeText={formik.handleChange("address")}
              onBlur={formik.handleBlur("address")}
              value={formik.values.address}
              secureTextEntry={undefined}
            />

            <Text
              style={{
                alignItems: "center",
                fontSize: 15,
                color: "black",
                fontWeight: "bold",
                marginTop: 15,
              }}
            >
              Ghi chú:
            </Text>
            <View
              style={{
                marginLeft: 15,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "gray" }}>* Tối đa 90 ký tự</Text>
              {formik.errors.note ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: "red",
                    paddingBottom: 5,
                  }}
                >
                  {formik.errors.note}
                </Text>
              ) : null}
              <View style={{ width: "95%", marginTop: 10 }}>
                <InputField
                  label={"Ví dụ: Da nhạy cảm, xin thợ làm đẹp nhẹ tay"}
                  keyboardType={undefined}
                  inputType="integer"
                  fieldButtonLabel={undefined}
                  fieldButtonFunction={undefined}
                  secureTextEntry={undefined}
                  onChangeText={formik.handleChange("note")}
                  onBlur={formik.handleBlur("note")}
                  value={formik.values.note}
                  icon={undefined}
                />
              </View>
            </View>

            <Text
              style={{
                alignItems: "center",
                fontSize: 15,
                color: "black",
                fontWeight: "bold",
                marginTop: 15,
              }}
            >
              Tên thợ:
            </Text>
            {beautician ? (
              <Text
                style={{
                  alignItems: "center",
                  fontSize: 15,
                  color: "gray",
                  marginTop: 10,
                }}
              >
                {beautician["fullName"]}
              </Text>
            ) : null}

            <Text
              style={{
                alignItems: "center",
                fontSize: 15,
                color: "black",
                fontWeight: "bold",
                marginTop: 15,
              }}
            >
              Số điện thoại của thợ:
            </Text>
            {beautician ? (
              <Text
                style={{
                  alignItems: "center",
                  fontSize: 15,
                  color: "gray",
                  marginTop: 10,
                }}
              >
                {beautician["phoneNumber"]}
              </Text>
            ) : null}

            <Text
              style={{
                alignItems: "center",
                fontSize: 15,
                color: "black",
                fontWeight: "bold",
                marginTop: 15,
              }}
            >
              Khu vực làm việc:
            </Text>
            {beautician ? (
              <Text
                style={{
                  alignItems: "center",
                  fontSize: 15,
                  color: "gray",
                  marginTop: 10,
                }}
              >
                {beautician["district"]} - {beautician["city"]}
              </Text>
            ) : null}
            <Text></Text>
            <Text
              style={{
                alignItems: "center",
                fontSize: 15,
                color: "black",
                marginBottom: 15,
                fontWeight: "bold",
              }}
            >
              {data.name}:
            </Text>

            <Text
              style={{
                alignItems: "center",
                fontSize: 14,
                color: "gray",
                marginBottom: 15,
              }}
            >
              {text}
              {!readMore && "..."}
              <Text
                style={{
                  alignItems: "center",
                  fontSize: 14,
                  color: "black",
                  marginBottom: 15,
                }}
                onPress={() => {
                  if (!readMore) {
                    setText(data.description);
                    setReadMore(true);
                  } else {
                    setText(data.description.slice(0, 100));
                    setReadMore(false);
                  }
                }}
              >
                {readMore ? " Ẩn đi" : " Hiện thêm"}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
      <FooterCustomerModelRecruitmentBooking
        navigation={navigation}
        formik={formik}
        sum={sum}
        choosedServices={choosedServices}
      />
      <Modal isVisible={isModalVisible}>
        <Modal.Container>
          <View style={styles.modal}>
            <Text
              style={{
                fontSize: 35,
                fontFamily: "DancingScript_700Bold",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Xác nhận đặt lịch
            </Text>
            <Text></Text>
            <View style={styles.view}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text
                  style={{
                    alignItems: "center",
                    fontSize: 15,
                    color: "black",
                    marginBottom: 5,
                    paddingTop: 10,
                    fontWeight: "bold",
                  }}
                >
                  Địa chỉ thực hiện làm đẹp:
                </Text>
                <Text
                  style={{
                    alignItems: "center",
                    fontSize: 15,
                    color: "gray",
                    marginBottom: 5,
                    paddingTop: 10,
                  }}
                >
                  {formik.values.address}
                </Text>
                <Text
                  style={{
                    alignItems: "center",
                    fontSize: 15,
                    color: "black",
                    marginBottom: 5,
                    paddingTop: 10,
                    fontWeight: "bold",
                  }}
                >
                  Loại dịch vụ làm đẹp:
                </Text>
                <Text
                  style={{
                    alignItems: "center",
                    fontSize: 15,
                    color: "gray",
                    marginBottom: 5,
                    paddingTop: 10,
                  }}
                >
                  {formik.values.name}
                </Text>
                <Text
                  style={{
                    alignItems: "center",
                    fontSize: 15,
                    color: "black",
                    marginBottom: 5,
                    paddingTop: 10,
                    fontWeight: "bold",
                  }}
                >
                  Ghi chú:
                </Text>
                {formik.values.note ? (
                  <Text
                    style={{
                      alignItems: "center",
                      fontSize: 15,
                      color: "gray",
                      marginBottom: 5,
                      paddingTop: 10,
                    }}
                  >
                    {formik.values.note}
                  </Text>
                ) : (
                  <Text
                    style={{
                      alignItems: "center",
                      fontSize: 15,
                      color: "gray",
                      marginBottom: 5,
                      paddingTop: 10,
                    }}
                  >
                    n/a
                  </Text>
                )}
              </ScrollView>
            </View>
            <Modal.Footer>
              <View style={styles.button}>
                <ModalButton title="Hủy" onPress={handleDecline} />
                <ModalButton
                  title="Đặt tuyển mẫu"
                  onPress={onBookingModelRecruitment}
                />
              </View>
            </Modal.Footer>
          </View>
        </Modal.Container>
      </Modal>
    </SafeAreaView>
  );
};
export default CustomerBookingScreen;
