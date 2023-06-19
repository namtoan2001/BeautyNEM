import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { Button, Header } from "@rneui/themed";
import moment from "moment";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import {
  ConfirmRequestForBeautician,
  GetNotificationForBeautician,
  ConfirmRequestRMForBeautician,
  GetNotificationRMForBeautician,
} from "../../../../services/notificationBeauticianService";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  GetEventDetailById,
  GetEventRMDetailById,
} from "../../../../services/eventBookingService";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";
import {
  AddNotificationForCustomer,
  AddNotificationRMForCustomer,
} from "../../../../services/notificationCustomerService";
import { sendPushNotification } from "../../../../services/ExpoPushNotificationService";
import { GetTokenDevice } from "../../../../services/tokenDeviceService";
import Dialog from "react-native-dialog";

const style = StyleSheet.create({
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  containter: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "#f7b2b2",
  },
  input: {
    backgroundColor: "#f7b2b2",
    color: "#FFF",
  },
  icon: {
    color: "#FFF",
    fontSize: 20,
  },
  containterItem: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    fontSize: 13,
    paddingTop: 5,
  },
  date: {
    color: "#FF9494",
    fontSize: 13,
    paddingTop: 5,
  },
  activityIndicator: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
  modal: {
    backgroundColor: "#FFF",
    marginBottom: 150,
    marginTop: 150,
    borderRadius: 10,
    justifyContent: "flex-start",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginLeft: 5,
  },
  contentModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
});

interface Notification {
  id: number;
  eventId: number;
  eventStatus: string;
  title: string;
  content: string;
  date: string;
  address: string;
  notificationType: number;
}

interface Event {
  id: number;
  dateEvent: string;
  dateEventFormat: string;
  startTime: string;
  endTime: string;
  services: Array<any>;
  note: string;
  customerName: string;
  customerId: number;
  status: string;
  starNumber: number;
  comment: string;
}

interface EventRM {
  id: number;
  address: string;
  note: string;
  customerName: string;
  customerId: number;
  status: string;
  starNumber: number;
  comment: string;
  title: string;
  price: string;
}
const weekDayObj: Object = {
  "0": "Chủ nhật",
  "1": "Thứ 2",
  "2": "Thứ 3",
  "3": "Thứ 4",
  "4": "Thứ 5",
  "5": "Thứ 6",
  "6": "Thứ 7",
};

const NotificationBeauticianScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Array<Notification>>();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalCancel, setIsModalCancel] = useState(false);
  const [isModalRMCancel, setIsModalRMCancel] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [event, setEvent] = useState<Event>({
    id: 0,
    customerId: 0,
    customerName: "",
    dateEvent: "",
    dateEventFormat: "",
    startTime: "",
    endTime: "",
    services: [],
    status: "",
    note: "",
    starNumber: 0,
    comment: "",
  });
  const [eventRM, setEventRM] = useState<EventRM>({
    id: 0,
    address: "",
    customerId: 0,
    customerName: "",
    status: "",
    note: "",
    starNumber: 0,
    comment: "string",
    title: "",
    price: "",
  });
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isOpenModalRM, setIsOpenModalRM] = useState(false);

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const toggleModalRM = () => {
    setIsOpenModalRM(!isOpenModalRM);
  };

  const eventStatusColor = (eventStatus: string) => {
    switch (eventStatus) {
      case "Pending":
        return "#318CE7";
      case "Active":
        return "green";
      case "Reject":
        return "#cc0000";
      case "In Progress":
        return "#318CE7";
      case "Done":
        return "#FF9494";
      case "Cancel":
        return "#cc0000";
    }
  };

  const translateEventStatus = (eventStatus: string) => {
    switch (eventStatus) {
      case "Pending":
        return "Chờ phản hồi";
      case "Active":
        return "Đã chấp nhận";
      case "Reject":
        return "Đã từ chối";
      case "In Progress":
        return "Đang diễn ra";
      case "Done":
        return "Đã hoàn thành";
      case "Cancel":
        return "Đã hủy";
    }
  };

  const StarNumberComponent = (starNumber: number) => {
    let startArray = [];
    for (let i = 0; i < starNumber; i++) {
      startArray.push(i);
    }
    return (
      <View style={{ flexDirection: "row" }}>
        {startArray.map((star, index) => (
          <MaterialIcons
            key={index}
            name="star-rate"
            size={15}
            color="#FEBE10"
            style={{ paddingLeft: 5 }}
          />
        ))}
      </View>
    );
  };

  const onPushNotification = async () => {
    let beautician = JSON.parse(await AsyncStorage.getItem("userInfo"));
    GetTokenDevice({
      userId: event.customerId,
      role: "Customer",
    }).then(async (response) => {
      const token = response.data;
      if (token) {
        const message = {
          body:
            "Phản hồi yêu cầu đặt lịch từ thợ làm đẹp " + beautician.fullName,
          sound: "default",
          data: {},
        };
        await sendPushNotification(token, message);
      }
    });
  };

  // const onPushNotificationRMForCustomer = async () => {
  //   let beautician = JSON.parse(await AsyncStorage.getItem("userInfo"));
  //   GetTokenDevice({
  //     userId: eventRM.customerId,
  //     role: "Customer",
  //   }).then(async (response) => {
  //     const token = response.data;
  //     if (token) {
  //       const message = {
  //         body:
  //           beautician.fullName + " đã chấp nhận yêu cầu đặt lịch tuyển mẫu.",
  //         sound: "default",
  //         data: {},
  //       };
  //       await sendPushNotification(token, message);
  //     }
  //   });
  // };

  const handleResponseToCustomer = async (isAccepted: boolean) => {
    let beautician = JSON.parse(await AsyncStorage.getItem("userInfo"));
    const message = !isAccepted ? cancelNote : "";
    let formData = new FormData();
    formData.append(
      "Title",
      `Phản hồi yêu cầu đặt lịch từ thợ làm đẹp ${beautician.fullName}`
    );
    formData.append("Content", message);
    formData.append("CustomerId", event.customerId.toString());
    formData.append("EventId", event.id.toString());
    AddNotificationForCustomer(formData)
      .then((response) => {
        if (response.data) onPushNotification();
      })
      .catch((error) => {
        Alert.alert(error.response.data);
      });
  };

  const handleResponseToRMCustomer = async (isAccepted: boolean) => {
    let beautician = JSON.parse(await AsyncStorage.getItem("userInfo"));
    const message = !isAccepted ? cancelNote : ".";
    const title = isAccepted
      ? `${beautician.fullName} đã chấp nhận yêu cầu đặt lịch tuyển mẫu.`
      : ` ${beautician.fullName} đã từ chối yêu cầu đặt lịch tuyển mẫu.`;

    let formData = new FormData();
    formData.append("Title", title);
    formData.append("Content", message);
    formData.append("Address", eventRM.address.toString());
    formData.append("CustomerId", eventRM.customerId.toString());
    formData.append("EventRMId", eventRM.id.toString());
    AddNotificationRMForCustomer(formData)
      .then((response) => {
        // if (response.data) onPushNotificationRMForCustomer();
        // console.log(`Thành công: `, response.data);
      })
      .catch((error) => {
        Alert.alert(error.response.data);
        // console.log(`Thất bại: `, error.response);
      });
  };

  const handleScheduleNotification = () => {
    const hourEvent = moment(event.startTime, "HH:mm").hour();
    const minuteEvent = moment(event.startTime, "HH:mm").minute();
    const datetimeEvent = moment(event.dateEvent, "YYYY-MM-DD")
      .set({ hour: hourEvent, minute: minuteEvent - 15 })
      .toDate();
    Notifications.scheduleNotificationAsync({
      content: {
        title: "BeautyNEM",
        body: `Bạn có lịch hẹn sau 15 phút nữa với ${
          event.customerName
        } lúc ${moment(event.startTime, "HH:mm").format(
          "HH:mm"
        )} vào ngày hôm nay !`,
      },
      trigger: datetimeEvent,
    }).catch((error) => console.log("error", error));
  };

  const handleConfirmRequest = (eventId, isAccepted) => {
    const formData = new FormData();
    formData.append("EventId", eventId);
    formData.append("IsAccepted", isAccepted);
    ConfirmRequestForBeautician(formData)
      .then((response) => {
        if (response.data) {
          handleResponseToCustomer(isAccepted);
          toggleModal();
          fetchNotificationList();
        }
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const handleConfirmRMRequest = (eventId, isAccepted) => {
    const formData = new FormData();
    formData.append("EventId", eventId);
    formData.append("IsAccepted", isAccepted);
    ConfirmRequestRMForBeautician(formData)
      .then((response) => {
        if (response.data) {
          handleResponseToRMCustomer(isAccepted);
          toggleModalRM();
          fetchNotificationList();
        }
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const fetchEventDetailById = (eventId: number) => {
    GetEventDetailById(eventId)
      .then((response) => {
        const data = response.data;
        var dateEventFormat =
          weekDayObj[moment(data.dateEvent).format("d")] +
          ", " +
          moment(data.dateEvent).format("DD/MM/YYYY");
        var listServices = [];
        if (data?.eventServices) {
          data?.eventServices.map((x) => {
            listServices.push(x?.service.name);
          });
        }
        const event: Event = {
          id: data.id,
          dateEvent: data.dateEvent,
          dateEventFormat: dateEventFormat,
          startTime: data.startTime,
          endTime: data.endTime,
          note: data.note,
          services: listServices,
          status: data.eventStatus?.statusName,
          customerName: data.customer?.fullName,
          customerId: data.customer?.id,
          starNumber: data.rating?.starNumber,
          comment: data.rating?.comment,
        };
        setEvent(event);
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const fetchEventRMDetailById = (eventId: number) => {
    GetEventRMDetailById(eventId)
      .then((response) => {
        const data = response.data;
        // console.log(data);
        const event: EventRM = {
          id: data.id,
          address: data.address,
          note: data.note,
          status: data.eventStatus?.statusName,
          customerName: data.customer?.fullName,
          customerId: data.customer?.id,
          starNumber: data.rating?.starNumber,
          comment: data.rating?.comment,
          title: data.recruitingMakeupModels?.name,
          price: data.recruitingMakeupModels?.price,
        };
        setEventRM(event);
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const fetchNotificationList = async () => {
    let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
    if (userInfo) {
      setIsLoading(true);
      try {
        const response1 = await GetNotificationForBeautician(userInfo.id);
        const response2 = await GetNotificationRMForBeautician(userInfo.id);

        const notifications1 = response1.data.map((x) => ({
          id: x.id,
          eventId: x.event.id,
          eventStatus: x.event.eventStatus.statusName,
          title: x.title,
          content: x.content,
          date: moment(x.notificationDate).format("HH:mm, DD/MM/YYYY"),
          address: x.address,
          notificationType: 1,
        }));
        const notifications2 = response2.data.map((x) => ({
          id: x.id,
          eventId: x.eventModelRecruit.id,
          eventStatus: x.eventModelRecruit.eventStatus.statusName,
          title: x.title,
          content: x.content,
          date: moment(x.notificationDate).format("HH:mm, DD/MM/YYYY"),
          address: x.address,
          notificationType: 2,
        }));

        const notificationsSorted = [...notifications1, ...notifications2].sort(
          (a, b) =>
            moment(b.date, "HH:mm, DD/MM/YYYY").valueOf() -
            moment(a.date, "HH:mm, DD/MM/YYYY").valueOf()
        );
        //console.log(notificationsSorted);
        setNotifications(notificationsSorted);
        setIsLoading(false);
      } catch (error) {
        Alert.alert("Thông báo lỗi", error.response.data);
        setIsLoading(false);
      }
    } else {
      setNotifications([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotificationList();
    }, [])
  );

  const renderItem = ({ item, index }) => {
    const notification: Notification = item;
    return (
      <TouchableOpacity
        style={style.containterItem}
        onPress={() => {
          if (notification.notificationType === 1) {
            fetchEventDetailById(notification.eventId);
            toggleModal();
          } else {
            fetchEventRMDetailById(notification.eventId);
            toggleModalRM();
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={{ paddingRight: 10 }}>
            <AntDesign name="notification" size={20} color="#FF9494" />
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={style.title}>{notification.title}</Text>
            {notification.content && (
              <Text style={style.content}>Ghi chú: {notification.content}</Text>
            )}
            <Text style={style.date}>{notification.date}</Text>
            {notification.eventStatus === "Pending" && (
              <View style={{ flexDirection: "row", paddingTop: 5 }}>
                <Ionicons name="hourglass-outline" size={15} color="#318CE7" />
                <Text
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    color: "#787878",
                  }}
                >
                  Chờ phản hồi
                </Text>
              </View>
            )}
            {notification.eventStatus !== "Pending" &&
              notification.eventStatus !== "Reject" && (
                <View style={{ flexDirection: "row", paddingTop: 5 }}>
                  <Ionicons name="checkmark-sharp" size={15} color="green" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontStyle: "italic",
                      color: "#787878",
                    }}
                  >
                    Đã chấp nhận
                  </Text>
                </View>
              )}
            {notification.eventStatus === "Reject" && (
              <View style={{ flexDirection: "row", paddingTop: 5 }}>
                <Ionicons name="close" size={15} color="#cc0000" />
                <Text
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    color: "#787878",
                  }}
                >
                  Đã từ chối
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Text>Bạn chưa có thông báo nào!</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        centerComponent={{ text: "Thông báo", style: style.header }}
        containerStyle={style.header}
      />
      {isLoading && (
        <ActivityIndicator
          style={style.activityIndicator}
          color="#FF9494"
          animating={isLoading}
          size={50}
        />
      )}
      <Modal
        isVisible={isOpenModal}
        onSwipeComplete={toggleModal}
        style={style.modal}
      >
        <ScrollView>
          <View style={{ padding: 10 }}>
            <View style={{ alignItems: "flex-end" }}>
              <Button
                buttonStyle={style.closeButton}
                icon={
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#989898"
                  />
                }
                onPress={toggleModal}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingBottom: 20,
                }}
              >
                Chi tiết lịch hẹn
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Tên khách hàng:</Text>
              <Text style={{ fontWeight: "bold" }}>{event.customerName}</Text>
            </View>
            <View style={style.contentModal}>
              <Text>Ngày diễn ra:</Text>
              <Text style={{ fontWeight: "bold" }}>
                {event.dateEventFormat}
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Thời gian bắt đầu:</Text>
              <Text style={{ fontWeight: "bold" }}>
                {moment(event.startTime, ["HH:mm:ss"]).format("h:mm A")}
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Thời gian kết thúc:</Text>
              <Text style={{ fontWeight: "bold" }}>
                {moment(event.endTime, ["HH:mm:ss"]).format("h:mm A")}
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Trạng thái:</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: eventStatusColor(event.status),
                }}
              >
                {translateEventStatus(event.status)}
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Dịch vụ:</Text>
              <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                {event.services.map((service, index) => (
                  <Text
                    key={index}
                    style={{
                      fontWeight: "bold",
                      fontSize: 13,
                      color: "#FF9494",
                      paddingBottom: 5,
                    }}
                  >
                    {service}
                  </Text>
                ))}
              </View>
            </View>
            <View style={style.contentModal}>
              <Text>Ghi chú:</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: "#808080",
                  flexDirection: "row",
                  flexShrink: 1,
                }}
              >
                {event.note}
              </Text>
            </View>
            {event.status === "Pending" && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingTop: 20,
                  }}
                >
                  <Button
                    titleStyle={{ color: "green", fontSize: 15 }}
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: "green",
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    type="clear"
                    title="Chấp nhận"
                    onPress={() => {
                      Alert.alert(
                        "Xác nhận lịch hẹn",
                        "Bạn có chắc chắn muốn chấp nhận lịch hẹn này ?",
                        [
                          {
                            text: "Đồng ý chấp nhận",
                            style: "destructive",
                            onPress: () => {
                              handleConfirmRequest(event.id, true);
                              handleScheduleNotification();
                            },
                          },
                          {
                            text: "Hủy",
                            onPress: () => {},
                          },
                        ]
                      );
                    }}
                  />
                  <Button
                    titleStyle={{ color: "#cc0000", fontSize: 15 }}
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: "#cc0000",
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    type="clear"
                    title="Từ chối"
                    onPress={() => setIsModalCancel(true)}
                  />
                </View>
                <View>
                  <Dialog.Container visible={isModalCancel}>
                    <Dialog.Title>Xác nhận lịch hẹn</Dialog.Title>
                    <Dialog.Description>
                      Bạn có chắc chắn muốn từ chối lịch hẹn này ?
                    </Dialog.Description>
                    <Dialog.Input
                      onChangeText={(text) => setCancelNote(text)}
                    />
                    <Dialog.Button
                      style={{ color: "red" }}
                      label="Đồng ý từ chối"
                      onPress={() => {
                        if (cancelNote.trim() !== "") {
                          handleConfirmRequest(event.id, false);
                        } else {
                          Alert.alert(
                            "Thông báo từ chối lịch hẹn",
                            "Vui lòng nhập lý do từ chối lịch hẹn !"
                          );
                        }
                      }}
                    />
                    <Dialog.Button
                      label="Hủy"
                      onPress={() => setIsModalCancel(false)}
                    />
                  </Dialog.Container>
                </View>
              </View>
            )}
            {event.starNumber > 0 && (
              <View>
                <View style={style.contentModal}>
                  <Text>Điểm đánh giá: </Text>
                  <Text
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {StarNumberComponent(event.starNumber)}
                  </Text>
                </View>
                <View style={style.contentModal}>
                  <Text>Bình luận: </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontStyle: "italic",
                      color: "#808080",
                      flexDirection: "row",
                      flexShrink: 1,
                    }}
                  >
                    {event.comment}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>
      <Modal
        isVisible={isOpenModalRM}
        onSwipeComplete={toggleModalRM}
        style={style.modal}
      >
        <ScrollView>
          <View style={{ padding: 10 }}>
            <View style={{ alignItems: "flex-end" }}>
              <Button
                buttonStyle={style.closeButton}
                icon={
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#989898"
                  />
                }
                onPress={toggleModalRM}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingBottom: 20,
                }}
              >
                Chi tiết tuyển mẫu
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Tên khách hàng:</Text>
              <Text style={{ fontWeight: "bold" }}>{eventRM.customerName}</Text>
            </View>
            <View style={style.contentModal}>
              <Text>Địa chỉ:</Text>
              <Text style={{ fontWeight: "bold" }}>{eventRM.address}</Text>
            </View>
            <View style={style.contentModal}>
              <Text>Trạng thái:</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: eventStatusColor(eventRM.status),
                }}
              >
                {translateEventStatus(eventRM.status)}
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Dịch vụ tuyển mẫu:</Text>
              <Text style={{ fontWeight: "bold" }}>{eventRM.title}</Text>
            </View>
            <View style={style.contentModal}>
              <Text>Mức giá:</Text>
              <Text style={{ fontWeight: "bold" }}>{eventRM.price}</Text>
            </View>
            <View style={style.contentModal}>
              <Text>Ghi chú:</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: "#808080",
                  flexDirection: "row",
                  flexShrink: 1,
                }}
              >
                {eventRM.note}
              </Text>
            </View>
            {eventRM.status === "Pending" && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingTop: 20,
                  }}
                >
                  <Button
                    titleStyle={{ color: "green", fontSize: 15 }}
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: "green",
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    type="clear"
                    title="Chấp nhận"
                    onPress={() => {
                      Alert.alert(
                        "Xác nhận lịch hẹn",
                        "Bạn có chắc chắn muốn chấp nhận cuộc hẹn tuyển mẫu này ?",
                        [
                          {
                            text: "Đồng ý chấp nhận",
                            style: "destructive",
                            onPress: () => {
                              handleConfirmRMRequest(eventRM.id, true);
                              //handleScheduleNotification();
                            },
                          },
                          {
                            text: "Hủy",
                            onPress: () => {},
                          },
                        ]
                      );
                    }}
                  />
                  <Button
                    titleStyle={{ color: "#cc0000", fontSize: 15 }}
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: "#cc0000",
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    type="clear"
                    title="Từ chối"
                    onPress={() => setIsModalRMCancel(true)}
                  />
                </View>
                <View>
                  <Dialog.Container visible={isModalRMCancel}>
                    <Dialog.Title>Xác nhận lịch hẹn</Dialog.Title>
                    <Dialog.Description>
                      Bạn có chắc chắn muốn từ chối lịch hẹn tuyển mẫu này ?
                    </Dialog.Description>
                    <Dialog.Input
                      onChangeText={(text) => setCancelNote(text)}
                    />
                    <Dialog.Button
                      style={{ color: "red" }}
                      label="Đồng ý từ chối"
                      onPress={() => {
                        if (cancelNote.trim() !== "") {
                          handleConfirmRMRequest(eventRM.id, false);
                        } else {
                          Alert.alert(
                            "Thông báo từ chối lịch hẹn",
                            "Vui lòng nhập lý do từ chối lịch hẹn !"
                          );
                        }
                      }}
                    />
                    <Dialog.Button
                      label="Hủy"
                      onPress={() => setIsModalRMCancel(false)}
                    />
                  </Dialog.Container>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>
      <FlatList
        style={style.containter}
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

export default NotificationBeauticianScreen;
