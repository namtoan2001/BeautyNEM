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
  GetNotificationForCustomer,
  UpdateReminderForCustomer,
  GetNotificationRMForCustomer,
} from "../../../../services/notificationCustomerService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { GetEventDetailById } from "../../../../services/eventBookingService";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";

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
  isReminded: boolean;
  modelRecruitment: boolean;
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
  beauticianName: string;
  status: string;
  starNumber: number;
  comment: string;
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

const NotificationCustomerScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Array<Notification>>();
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<Event>({
    id: 0,
    customerName: "",
    beauticianName: "",
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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isReminded, setIsReminded] = useState(false);
  const [reminderResponse, setReminderResponse] = useState("");

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
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

  const handleScheduleNotification = (event: Event) => {
    if (event.dateEvent !== "") {
      const hourEvent = moment(event.startTime, "HH:mm").hour();
      const minuteEvent = moment(event.startTime, "HH:mm").minute();
      const datetimeEvent = moment(event.dateEvent, "YYYY-MM-DD")
        .set({ hour: hourEvent, minute: minuteEvent - 15 })
        .toDate();
      Notifications.scheduleNotificationAsync({
        content: {
          title: "BeautyNEM",
          body: `Bạn có lịch hẹn sau 15 phút nữa với ${
            event.beauticianName
          } lúc ${moment(event.startTime, "HH:mm").format(
            "HH:mm"
          )} vào ngày hôm nay !`,
        },
        trigger: datetimeEvent,
      }).catch((error) => console.log("error", error));
      console.log(
        `Sắp thông báo cho khách ${event.customerName} lúc ${datetimeEvent}`
      );
    } else {
      Alert.alert("Thông báo", "Xin hãy xem chi tiết lịch hẹn trước !");
    }
  };

  const onUpdateReminder = async (
    isReminder: boolean,
    notification: Notification
  ) => {
    if (notification.id > 0 && notification.eventId > 0) {
      let formData = new FormData();
      formData.append("NotificationId", notification.id.toString());
      formData.append("IsReminded", "true");
      UpdateReminderForCustomer(formData)
        .then((response) => {
          setIsReminded(true);
          if (isReminder && response.data) {
            fetchEventDetailById(notification.eventId, response.data);
            setReminderResponse("Đã thêm thông báo nhắc nhở");
          } else if (!isReminder) {
            setReminderResponse("");
          }
          fetchNotificationList();
        })
        .catch((error) => Alert.alert(error.response.data));
    }
  };

  const fetchEventDetailById = (eventId: number, isReminded: boolean) => {
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
        const _event: Event = {
          id: data.id,
          dateEvent: data.dateEvent,
          dateEventFormat: dateEventFormat,
          startTime: data.startTime,
          endTime: data.endTime,
          note: data.note,
          services: listServices,
          status: data.eventStatus?.statusName,
          customerName: data.customer?.fullName,
          beauticianName: data.beautician?.fullName,
          starNumber: data.rating?.starNumber,
          comment: data.rating?.comment,
        };
        setEvent(_event);
        if (isReminded) {
          handleScheduleNotification(_event);
        }
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const fetchNotificationList = async () => {
    let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
    if (userInfo) {
      setIsLoading(true);
      try {
        const response1 = await GetNotificationForCustomer(userInfo.id);
        const response2 = await GetNotificationRMForCustomer(userInfo.id);

        const notifications1 = response1.data.map((x) => ({
          id: x.id,
          eventId: x.event.id,
          eventStatus: x.event.eventStatus.statusName,
          title: x.title,
          content: x.content,
          date: moment(x.notificationDate).format("HH:mm, DD/MM/YYYY"),
          isReminded: x.isReminded,
          modelRecruitment: true,
        }));
        const notifications2 = response2.data.map((x) => ({
          id: x.id,
          eventId: x.eventModelRecruit.id,
          eventStatus: x.eventModelRecruit.eventStatus.statusName,
          title: x.title,
          content: x.content,
          date: moment(x.notificationDate).format("HH:mm, DD/MM/YYYY"),
          isReminded: true,
          modelRecruitment: false,
        }));

        const notificationsSorted = [...notifications1, ...notifications2].sort(
          (a, b) =>
            moment(b.date, "HH:mm, DD/MM/YYYY").valueOf() -
            moment(a.date, "HH:mm, DD/MM/YYYY").valueOf()
        );
        setNotifications(notificationsSorted);
        setIsLoading(false);
      } catch (error) {
        // Alert.alert("Thông báo lỗi", error.response.data);
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
      <>
        {notification.modelRecruitment ? (
          <TouchableOpacity
            style={style.containterItem}
            onPress={() => {
              fetchEventDetailById(notification.eventId, false);
              toggleModal();
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View style={{ paddingRight: 10 }}>
                <AntDesign name="notification" size={20} color="#FF9494" />
              </View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={style.title}>{notification.title}</Text>
                {notification.content && (
                  <Text style={style.content}>
                    Lời nhắn của thợ: {notification.content}
                  </Text>
                )}
                <Text style={style.date}>{notification.date}</Text>
                {notification.eventStatus === "Pending" && (
                  <View style={{ flexDirection: "row", paddingTop: 5 }}>
                    <Ionicons
                      name="hourglass-outline"
                      size={15}
                      color="#318CE7"
                    />
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
                {notification.eventStatus === "Active" && (
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                      <Ionicons
                        name="checkmark-sharp"
                        size={15}
                        color="green"
                      />
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
                    {!notification.isReminded && (
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                            color: "#787878",
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          Bạn có muốn nhận thông báo nhắc nhở lịch hẹn này ?
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "bold",
                              color: "#318CE7",
                              marginRight: 20,
                            }}
                            onPress={() => onUpdateReminder(true, notification)}
                          >
                            Nhắc nhở tôi
                          </Text>
                          <Text
                            style={{ fontSize: 12, color: "#318CE7" }}
                            onPress={() =>
                              onUpdateReminder(false, notification)
                            }
                          >
                            Không cảm ơn
                          </Text>
                        </View>
                      </View>
                    )}
                    {reminderResponse !== "" && (
                      <View style={{ flexDirection: "row", paddingTop: 5 }}>
                        <Ionicons
                          name="checkmark-sharp"
                          size={15}
                          color="green"
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                            color: "#787878",
                          }}
                        >
                          {reminderResponse}
                        </Text>
                      </View>
                    )}
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
        ) : (
          <View style={style.containterItem}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View style={{ paddingRight: 10 }}>
                <AntDesign name="notification" size={20} color="#FF9494" />
              </View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={style.title}>{notification.title}</Text>
                {notification.content && (
                  <Text style={style.content}>
                    Lời nhắn của thợ: {notification.content}
                  </Text>
                )}
                <Text style={style.date}>{notification.date}</Text>
                {notification.eventStatus === "Pending" && (
                  <View style={{ flexDirection: "row", paddingTop: 5 }}>
                    <Ionicons
                      name="hourglass-outline"
                      size={15}
                      color="#318CE7"
                    />
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
                {notification.eventStatus === "Active" && (
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                      <Ionicons
                        name="checkmark-sharp"
                        size={15}
                        color="green"
                      />
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
                    {!notification.isReminded && (
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                            color: "#787878",
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          Bạn có muốn nhận thông báo nhắc nhở lịch hẹn này ?
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "bold",
                              color: "#318CE7",
                              marginRight: 20,
                            }}
                            onPress={() => onUpdateReminder(true, notification)}
                          >
                            Nhắc nhở tôi
                          </Text>
                          <Text
                            style={{ fontSize: 12, color: "#318CE7" }}
                            onPress={() =>
                              onUpdateReminder(false, notification)
                            }
                          >
                            Không cảm ơn
                          </Text>
                        </View>
                      </View>
                    )}
                    {reminderResponse !== "" && (
                      <View style={{ flexDirection: "row", paddingTop: 5 }}>
                        <Ionicons
                          name="checkmark-sharp"
                          size={15}
                          color="green"
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                            color: "#787878",
                          }}
                        >
                          {reminderResponse}
                        </Text>
                      </View>
                    )}
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
          </View>
        )}
      </>
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
        <Text>Chưa có thông báo !</Text>
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
              <Text>Tên thợ làm đẹp:</Text>
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

export default NotificationCustomerScreen;
