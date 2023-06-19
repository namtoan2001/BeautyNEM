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
import AntDesign from "react-native-vector-icons/AntDesign";
import { Formik, useFormik, Field } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { Modal } from "../../components/Modal";
import { ModalButton } from "../../components/ModalButton";
import FooterCustomerBooking from "../../components/FooterCustomerBooking";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GetCustomerProfile } from "../../../../services/customerProfileService";
import {
  CustomerGetSkill,
  CustomerGetSchedule,
  CustomerBooking,
} from "../../../../services/customerBookingSerivce";
import moment, { locale } from "moment";
import { useIsFocused } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { LogBox } from "react-native";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
  TimelineEventProps,
  CalendarUtils,
  TimelineProps,
  LocaleConfig,
} from "react-native-calendars";
import groupBy from "lodash/groupBy";
import filter from "lodash/filter";
import find from "lodash/find";
import { sendPushNotification } from "../../../../services/ExpoPushNotificationService";
import { GetTokenDevice } from "../../../../services/tokenDeviceService";
import { AddNotificationForBeautician } from "../../../../services/notificationBeauticianService";
import Moment from "react-moment";
import { createIconSetFromFontello } from "react-native-vector-icons";
import { EndDate } from "../../components";
import 'moment/locale/en-gb';

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
  serviceButtoDisable: {
    alignSelf: "flex-end",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#d9d9d9",
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
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    width: "80%",
    height: "65%",
    justifyContent: "center",
    textAlign: "left",
  },
});

const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(
    new Date().setDate(new Date().getDate() + offset)
  );

LocaleConfig.locales["vn"] = {
  monthNames: [
    "Tháng 1,",
    "Tháng 2,",
    "Tháng 3,",
    "Tháng 4,",
    "Tháng 5,",
    "Tháng 6,",
    "Tháng 7,",
    "Tháng 8,",
    "Tháng 9,",
    "Tháng 10,",
    "Tháng 11,",
    "Tháng 12,",
  ],
  monthNamesShort: [
    "T1.",
    "T2.",
    "T3.",
    "T4.",
    "T5.",
    "T6.",
    "T7.",
    "T8.",
    "T9.",
    "T10.",
    "T11.",
    "T12.",
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  dayNamesShort: ["CN.", "T2.", "T3.", "T4.", "T5.", "T6.", "T7."],
  today: "Hôm nay",
};
LocaleConfig.defaultLocale = "vn";

interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  isSelected: boolean;
  isBooked: boolean;
}

const CustomerBookingScreen = ({ navigation, route, props }) => {
  const momentInstance = moment().locale('en');
  const beauticianID = route.params;
  const isFocused = useIsFocused();
  const [choosedServices, setChoosedServices] = useState([]);
  const [availableSchedule, setAvailableSchedule] = useState([]);
  const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const [sum, setSum] = useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [schedule, setSchedule] = useState([]);
  const [isPress, setIsPress] = useState(false);
  const [day, setDay] = useState([]);

  const handleDecline = () => setIsModalVisible(() => !isModalVisible);

  const [state, setState] = useState({
    currentDate: getDate(),
  });

  const marked = {
    [`${getDate(-1)}`]: { marked: true },
    [`${getDate()}`]: { marked: true },
    [`${getDate(1)}`]: { marked: true },
    [`${getDate(2)}`]: { marked: true },
    [`${getDate(4)}`]: { marked: true },
  };

  const Validate = Yup.object().shape({
    address: Yup.string().required("Địa chỉ là bắt buộc"),
    choosedServices: Yup.string().required("Dịch vụ là bắt buộc"),
    chooseSchedule: Yup.object().required("Khung giờ làm việc là bắt buộc"),
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
    component: { FooterCustomerBooking },
    validationSchema: Validate,
    onSubmit: (values) => {
      const result = choosedServices.reduce((total, currentValue) => {
        if (currentValue.discount !== null) {
          return (
            total +
            Math.floor(currentValue.price * (currentValue.discount / 100))
          );
        } else {
          return total + currentValue.price;
        }
      }, 0);
      const totalSeconds = choosedServices.reduce((total, value) => {
        if (value.time === null) {
          return total + 30 * 60;
        } else {
          const [hours, minutes, seconds] = value.time
            .split(":")
            .map((num) => parseInt(num));
          return total + hours * 3600 + minutes * 60 + seconds;
        }
      }, 0);

      const totalMilliseconds = totalSeconds * 1000;

      const [hoursStartTime, minutesStartTime, secondsStartTime] =
        formik.values.chooseSchedule.startTime
          .split(":")
          .map((num) => parseInt(num));
      const totalSecondsStartTime =
        hoursStartTime * 3600 + minutesStartTime * 60 + secondsStartTime;
      const totalMillisecondsStartTime = totalSecondsStartTime * 1000;

      const [hoursEndTime, minutesEndTime, secondsEndTime] =
        formik.values.chooseSchedule.endTime
          .split(":")
          .map((num) => parseInt(num));
      const totalSecondsEndTime =
        hoursEndTime * 3600 + minutesEndTime * 60 + secondsEndTime;
      const totalMillisecondsEndTime = totalSecondsEndTime * 1000;

      const difference = totalMillisecondsEndTime - totalMillisecondsStartTime;

      if(totalMilliseconds > difference){
        Alert.alert("Thời gian làm dịch vụ > thời gian của thợ, không thể đặt!")
      }else{
        setSum(result);
        setIsModalVisible(true);
      }
    },
  });

  const onPushNotification = async () => {
    const customer = JSON.parse(await AsyncStorage.getItem("userInfo"));
    GetTokenDevice({
      userId: beauticianID.beauticianID,
      role: "Beautician",
    }).then(async (response) => {
      const token = response.data;
      if (token) {
        const message = {
          body: "Bạn có một yêu cầu đặt lịch từ " + customer.fullName,
          sound: "default",
          data: {},
        };
        await sendPushNotification(token, message);
      }
    });
  };

  const onBooking = () => {
    let formData = new FormData();
    const dateString = day[1] + "/" + day[2] + "/" + day[0];

    console.log(beauticianID);

    formData.append("DateEvent", dateString);
    formData.append("StartTime", formik.values.chooseSchedule.startTime);
    formData.append("EndTime", formik.values.chooseSchedule.endTime);
    formData.append("Note", formik.values.note);
    formData.append("Address", formik.values.address);
    formData.append("CustomerId", formik.values.customerID);
    formData.append("beauticianId", beauticianID.beauticianID);
    formData.append("idServices", beauticianID.serviceIdsNoPrice);
    formData.append("SumPrice", sum);
    console.log(formData);

    Alert.alert("Thông báo", "Xác nhận đặt lịch", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          CustomerBooking(formData)
            .then(async (result) => {
              const eventId = result.data;
              if (eventId) {
                let customer = JSON.parse(
                  await AsyncStorage.getItem("userInfo")
                );
                let formData = new FormData();
                formData.append(
                  "Title",
                  "Yêu cầu đặt lịch từ " + customer.fullName
                );
                formData.append("BeauticianId", beauticianID.beauticianID);
                formData.append("EventId", eventId);

                AddNotificationForBeautician(formData)
                  .then((response) => {
                    if (response.data) onPushNotification();
                  })
                  .catch((error) => {
                    Alert.alert(error.response.data);
                  });
              }
              Alert.alert(
                "Thông báo",
                "Đặt lịch thành công, vui lòng chờ thông báo từ thợ!"
              );
              navigation.navigate("Trang chủ");
            })
            .catch((error) => {
              Alert.alert(error.response.data);
            });
        },
      },
    ]);

    //console.log(formData);
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const getDayName = (dateStr, locale) => {
    const date = new Date(+dateStr[0], dateStr[1] - 1, +dateStr[2]);
    var weekDayName = moment(date).format("dddd");
    console.log(weekDayName);
    return weekDayName;
  };

  const onDateChanged = (date: string) => {
    //setState({ ...state, currentDate: date });r
    const arrDate = date.split("-");

    var inputDate = new Date(date);
    var todaysDate = new Date();

    if (inputDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
      setAvailableSchedule([]);
      Alert.alert("Thông báo", "Vui lòng chọn ngày bắt đầu từ ngày hôm nay", [
        {
          text: "Quay lại",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
      return;
    }

    formik.setFieldValue("chooseSchedule", undefined);

    var day = getDayName(arrDate, "en-US");
    setDay(arrDate);
    var chooseDate = arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];

    CustomerGetSchedule(beauticianID.beauticianID, day, chooseDate)
      .then((response) => {
        setAvailableSchedule([]);

        console.log(response.data);

        setAvailableSchedule((availableSchedule) => [
          ...availableSchedule,
          response.data,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onMonthChange = (month: any, updateSource: any) => {
    console.log("TimelineCalendarScreen onMonthChange: ", month, updateSource);
  };

  const removeItem = (index) => {
    setChoosedServices(choosedServices.filter((o, i) => index !== i));
    //console.log(beauticianID.serviceIds) ;
    const arrServicesID = beauticianID.serviceIds.split(";");

    arrServicesID.splice(index, 1);

    beauticianID.serviceIds = arrServicesID.join(";");

    formik.setFieldValue("choosedServices", beauticianID.serviceIds);
  };

  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return date + "-" + month + "-" + year; //format: d-m-y;
  };

  const onSelectSchedule = (schedule: Schedule) => {
    const Schedule: Schedule = schedule;
    const listSchedule: Array<Schedule> = availableSchedule[0];

    let ids = availableSchedule[0].map((i) => i.id);

    listSchedule.map((x) => {
      for (var i = 0; i < ids.length; i++) {
        if (x.id === ids[i]) {
          x.isSelected = false;
        }
      }
    });
    if (Schedule.id === schedule.id && schedule.isBooked === false) {
      Schedule.isSelected = !Schedule.isSelected;
      formik.setFieldValue("chooseSchedule", schedule);
      setIsPress(!isPress);
    }
    //setSchedule(Schedule);
  };

  useEffect(() => {
    if (beauticianID.serviceIds !== undefined) {
      CustomerGetSkill(beauticianID.serviceIds).then((response) => {
        setChoosedServices(response.data);
        formik.setFieldValue("choosedServices", beauticianID.serviceIds);
        const result = choosedServices.reduce(
          (total, currentValue) => (total = total + currentValue.price),
          0
        );
        setSum(result);
      });
    }
  }, [props, isFocused]);

  useEffect(() => {
    GetCustomerProfile()
      .then((response) => {
        formik.setFieldValue("customerID", response.data.id);
        formik.setFieldValue("address", response.data.address);
        formik.setFieldValue("note", "");
      })
      .catch((error) => {
        console.log(error.response.data);
      });

    const arrDate = getCurrentDate().split("-");
    setDay(arrDate);
    var day = getDayName(arrDate.reverse(), "en-US");
    var chooseDate = arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];
    //console.log(chooseDate);
    CustomerGetSchedule(beauticianID.beauticianID, day, chooseDate)
      .then((response) => {
        setAvailableSchedule([]);
        console.log(response.data);
        setAvailableSchedule((availableSchedule) => [
          ...availableSchedule,
          response.data,
        ]);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  let [fontsLoaded, error] = useFonts({
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  const updateService = (data) => {
    if (data !== undefined) {
      //console.log(data);
      //const dataArr = data.split(';');
      //console.log(dataArr[0] + "a");
    }
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
      <ScrollView>
        <View style={styles.container}>
          <Text
            style={{
              alignItems: "center",
              fontSize: 15,
              color: "black",
              fontWeight: "bold",
              alignSelf: "flex-start",
              paddingLeft: 10,
            }}
          >
            Chọn ngày:
          </Text>
          <Text></Text>
          <CalendarProvider
            date={state.currentDate}
            onDateChanged={onDateChanged}
            onMonthChange={onMonthChange}
            disabledOpacity={0.6}
          >
            <ExpandableCalendar
              firstDay={1}
              leftArrowImageSource={require("../../../../src/assets/icons/previous.png")}
              rightArrowImageSource={require("../../../assets/icons/next.png")}
              markedDates={marked}
              theme={{}}
            />
          </CalendarProvider>
          <Text
            style={{
              alignItems: "center",
              fontSize: 15,
              color: "black",
              marginTop: 15,
              fontWeight: "bold",
              alignSelf: "flex-start",
              paddingLeft: 10,
            }}
          >
            Chọn khung giờ:
          </Text>
          {formik.errors.chooseSchedule ? (
            <Text
              style={{
                fontSize: 14,
                color: "red",
                paddingLeft: 10,
                alignSelf: "flex-start",
              }}
            >
              {formik.errors.chooseSchedule}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignSelf: "flex-start",
              paddingLeft: 5,
            }}
          >
            {availableSchedule[0]?.map((schedule, index) => (
              <Button
                key={index}
                buttonStyle={
                  !schedule.isBooked
                    ? !schedule.isSelected
                      ? styles.serviceButton
                      : styles.serviceButtonOnPress
                    : styles.serviceButtoDisable
                }
                titleStyle={
                  !schedule.isSelected
                    ? styles.serviceTitle
                    : styles.serviceTitleOnPress
                }
                title={
                  schedule.startTime.slice(0, -3) +
                  "-" +
                  schedule.endTime.slice(0, -3)
                }
                type="outline"
                onPress={() => onSelectSchedule(schedule)}
              />
            ))}

            {availableSchedule[0]?.length === 0 ? (
              <Text
                style={{
                  fontSize: 14,
                  color: "gray",
                  paddingTop: 5,
                  paddingLeft: 5,
                }}
              >
                Thợ làm đẹp không có lịch làm việc, vui lòng chọn ngày khác!
              </Text>
            ) : null}
          </View>
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
              }}
            >
              Chọn dịch vụ:
            </Text>
            {formik.errors.choosedServices ? (
              <Text
                style={{
                  fontSize: 14,
                  color: "red",
                  paddingBottom: 5,
                }}
              >
                {formik.errors.choosedServices}
              </Text>
            ) : null}
            {choosedServices.map((service, index) =>
              service.discount !== null ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    paddingLeft: 15,
                  }}
                  key={service.id}
                >
                  <View style={styles.items}>
                    <Text
                      style={{
                        alignItems: "center",
                        fontSize: 15,
                        color: "black",
                        marginBottom: 5,
                        paddingTop: 10,
                      }}
                    >
                      {service.serviceName}
                    </Text>
                  </View>
                  <View style={styles.items}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          alignItems: "center",
                          fontSize: 15,
                          color: "#FF9494",
                          marginBottom: 10,
                          fontWeight: "bold",
                          alignSelf: "flex-end",
                          paddingTop: 10,
                        }}
                      >
                        {Math.floor(service.price - (service.price * (service.discount/100)))
                          .toString()
                          .replace(currencyRegex, "$1.")}{" "}
                        đ
                      </Text>
                      <Button
                        key={index}
                        buttonStyle={
                          !service.isSelected
                            ? styles.serviceButton
                            : styles.serviceButtonOnPress
                        }
                        titleStyle={
                          !service.isSelected
                            ? styles.serviceTitle
                            : styles.serviceTitleOnPress
                        }
                        title="-"
                        type="outline"
                        onPress={() => removeItem(index)}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    paddingLeft: 15,
                  }}
                  key={service.id}
                >
                  <View style={styles.items}>
                    <Text
                      style={{
                        alignItems: "center",
                        fontSize: 15,
                        color: "black",
                        marginBottom: 5,
                        paddingTop: 10,
                      }}
                    >
                      {service.serviceName}
                    </Text>
                  </View>
                  <View style={styles.items}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          alignItems: "center",
                          fontSize: 15,
                          color: "#FF9494",
                          marginBottom: 10,
                          fontWeight: "bold",
                          alignSelf: "flex-end",
                          paddingTop: 10,
                        }}
                      >
                        {service.price.toString().replace(currencyRegex, "$1.")}{" "}
                        đ
                      </Text>
                      <Button
                        key={index}
                        buttonStyle={
                          !service.isSelected
                            ? styles.serviceButton
                            : styles.serviceButtonOnPress
                        }
                        titleStyle={
                          !service.isSelected
                            ? styles.serviceTitle
                            : styles.serviceTitleOnPress
                        }
                        title="-"
                        type="outline"
                        onPress={() => removeItem(index)}
                      />
                    </View>
                  </View>
                </View>
              )
            )}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CustomerChooseServicesScreen", {
                  beauticianID,
                  updateService: updateService,
                })
              }
            >
              <Text
                style={{
                  color: "#FF9494",
                  fontSize: 20,
                  textAlign: "center",
                  marginTop: 15,
                }}
              >
                THÊM DỊCH VỤ
              </Text>
            </TouchableOpacity>
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
          </View>
        </View>
      </ScrollView>
      <FooterCustomerBooking
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
                marginBottom: 20,
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
                  Các dịch vụ bạn đã chọn:
                </Text>
                {choosedServices.map((service, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      width: "100%",
                      paddingLeft: 15,
                    }}
                    key={service.id}
                  >
                    <View style={styles.items}>
                      <Text
                        style={{
                          alignItems: "center",
                          fontSize: 15,
                          color: "black",
                          marginBottom: 5,
                          paddingTop: 10,
                        }}
                      >
                        {service.serviceName}
                      </Text>
                    </View>
                    <View style={styles.items}>
                      {service.discount !== null ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignSelf: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              alignItems: "center",
                              fontSize: 15,
                              color: "#FF9494",
                              marginBottom: 10,
                              fontWeight: "bold",
                              alignSelf: "flex-end",
                              paddingTop: 10,
                            }}
                          >
                            {Math.floor(service.price - (service.price * (service.discount/100)))
                              .toString()
                              .replace(currencyRegex, "$1.")}{" "}
                            đ
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            alignSelf: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              alignItems: "center",
                              fontSize: 15,
                              color: "#FF9494",
                              marginBottom: 10,
                              fontWeight: "bold",
                              alignSelf: "flex-end",
                              paddingTop: 10,
                            }}
                          >
                            {service.price
                              .toString()
                              .replace(currencyRegex, "$1.")}{" "}
                            đ
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    paddingLeft: 15,
                  }}
                >
                  <View style={styles.items}>
                    <Text
                      style={{
                        alignItems: "center",
                        fontSize: 15,
                        color: "black",
                        marginBottom: 5,
                        paddingTop: 10,
                      }}
                    >
                      Tổng giá tiền:
                    </Text>
                  </View>
                  <View style={styles.items}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "flex-end",
                      }}
                    >
                      {sum ? (
                        <Text
                          style={{
                            alignItems: "center",
                            fontSize: 15,
                            color: "#FF9494",
                            marginBottom: 10,
                            fontWeight: "bold",
                            alignSelf: "flex-end",
                            paddingTop: 10,
                          }}
                        >
                          {sum?.toString().replace(currencyRegex, "$1.")} đ
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

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
                  Khung giờ đã chọn:
                </Text>
                {formik.values.chooseSchedule ? (
                  <Text
                    style={{
                      alignItems: "center",
                      fontSize: 15,
                      color: "gray",
                      marginBottom: 5,
                      paddingTop: 10,
                    }}
                  >
                    {day[2] + "/" + day[1] + "/" + day[0] + ":"}{" "}
                    {formik.values.chooseSchedule.startTime.slice(0, -3)} -{" "}
                    {formik.values.chooseSchedule.endTime.slice(0, -3)}
                  </Text>
                ) : null}

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
                  Ghi chú:{" "}
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
                <ModalButton title="Đặt lịch" onPress={onBooking} />
              </View>
            </Modal.Footer>
          </View>
        </Modal.Container>
      </Modal>
    </SafeAreaView>
  );
};
export default CustomerBookingScreen;
