import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Button, Avatar, Header } from "@rneui/themed";
import {
  Agenda,
  AgendaSchedule,
  DateData,
  AgendaEntry,
} from "react-native-calendars";
import { ActivityIndicator, Card } from "react-native-paper";
import {
  CancelEventBooking,
  CompleteEventBooking,
  GetEventDetailById,
  GetEventsForBeautician,
  InProgressEventBooking,
} from "../../../services/eventBookingService";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetTokenDevice } from "../../../services/tokenDeviceService";
import { sendPushNotification } from "../../../services/ExpoPushNotificationService";
import { AddNotificationForCustomer } from "../../../services/notificationCustomerService";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
  addButton: {
    width: 45,
    height: 45,
    backgroundColor: "#FF9494",
    borderWidth: 2,
  },
  itemView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
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
  activityIndicator: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
});

interface Event {
  id: number;
  dateEvent: string;
  startTime: string;
  endTime: string;
  note: string;
  customerName: string;
  status: string;
}

interface EventDetail {
  id: number;
  dateEvent: string;
  startTime: string;
  endTime: string;
  services: Array<any>;
  note: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
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

const EventScreen = ({ navigation }) => {
  const { userRole } = useContext(AuthContext);
  const [items, setItems] = useState({});
  const [listDate, setListDate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [event, setEvent] = useState<EventDetail>({
    id: 0,
    customerId: 0,
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    dateEvent: "",
    startTime: "",
    endTime: "",
    services: [],
    status: "",
    note: "",
    starNumber: 0,
    comment: "",
  });
  const [isModalCancel, setIsModalCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

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

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchEventsForBeautician();
    }, [])
  );

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

  const onPushNotificationVoting = async () => {
    let beautician = JSON.parse(await AsyncStorage.getItem("userInfo"));
    GetTokenDevice({
      userId: event.customerId,
      role: "Customer",
    }).then(async (response) => {
      const token = response.data;
      if (token) {
        const message = {
          body: `Bạn cảm thấy thế nào về dịch vụ của thợ ${beautician.fullName}. Hãy nêu trãi nghiệm của bạn ở phần đánh giá !`,
          sound: "default",
          data: {},
        };
        await sendPushNotification(token, message);
      }
    });
  };

  const handleReminderVotingToCustomer = async () => {
    let beautician = JSON.parse(await AsyncStorage.getItem("userInfo"));
    let formData = new FormData();
    formData.append(
      "Title",
      `Bạn cảm thấy thế nào về dịch vụ của thợ ${beautician.fullName}. Hãy nêu trãi nghiệm của bạn ở phần đánh giá !`
    );
    formData.append("Content", "");
    formData.append("CustomerId", event.customerId.toString());
    formData.append("EventId", event.id.toString());
    AddNotificationForCustomer(formData)
      .then((response) => {
        if (response.data) onPushNotificationVoting();
      })
      .catch((error) => {
        Alert.alert(error.response.data);
      });
  };

  const handleInProgressEventBooking = (eventId: number) => {
    setIsLoading(true);
    InProgressEventBooking(eventId)
      .then((response) => {
        fetchEventsForBeautician();
        toggleModal();
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const handleCompleteEventBooking = (eventId: number) => {
    setIsLoading(true);
    CompleteEventBooking(eventId)
      .then((response) => {
        fetchEventsForBeautician();
        toggleModal();
        handleReminderVotingToCustomer();
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const handleCancelEventBooking = (eventId: number) => {
    if (cancelReason !== "") {
      setIsLoading(true);
      CancelEventBooking(eventId, cancelReason)
        .then((response) => {
          fetchEventsForBeautician();
          toggleModal();
        })
        .catch((error) => Alert.alert(error.response.data));
    } else {
      Alert.alert(
        "Thông báo hủy lịch hẹn",
        "Vui lòng nhập lý do để hủy lịch hẹn !"
      );
    }
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
        const event: EventDetail = {
          id: data.id,
          dateEvent: dateEventFormat,
          startTime: data.startTime,
          endTime: data.endTime,
          note: data.note,
          services: listServices,
          status: data.eventStatus?.statusName,
          customerId: data.customer?.id,
          customerName: data.customer?.fullName,
          customerPhone: data.customer?.phoneNumber,
          customerAddress: data.customer?.address,
          starNumber: data.rating?.starNumber,
          comment: data.rating?.comment,
        };
        setEvent(event);
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const fetchEventsForBeautician = () => {
    GetEventsForBeautician()
      .then((response) => {
        var dataItems = {};
        var _listDate = [];
        response.data.forEach((data) => {
          var dateEventFormat =
            weekDayObj[moment(data.dateEvent).format("d")] +
            ", " +
            moment(data.dateEvent).format("DD/MM/YYYY");
          var event: Event = {
            id: data.id,
            dateEvent: dateEventFormat,
            startTime: data.startTime,
            endTime: data.endTime,
            note: data.note,
            status: data.eventStatus?.statusName,
            customerName: data.customer?.fullName,
          };
          if (event.status !== "Pending" && event.status !== "Reject") {
            var dateEventStr = moment(data.dateEvent).format("YYYY-MM-DD");
            if (!dataItems[dateEventStr]) {
              dataItems[dateEventStr] = [];
            }
            dataItems[dateEventStr].push({
              name: JSON.stringify(event),
              day: dateEventStr,
            });
            !_listDate.includes(data.dateEvent)
              ? _listDate.push(data.dateEvent)
              : "";
          }
        });
        setItems(dataItems);
        setListDate(_listDate);
        setIsLoading(false);
      })
      .catch((error) => {
        Alert.alert("Thông báo lỗi", error.response.data);
        setIsLoading(false);
      });
  };

  const getDateToSelect = () => {
    const _listDate = [...listDate];
    const dateSelectedList = _listDate.filter((date) => {
      const diffDays = moment(date).diff(moment(new Date()), "days");
      return diffDays >= 0;
    });
    return dateSelectedList[0];
  };

  const loadItems = (day: DateData) => {
    fetchEventsForBeautician();
  };

  const renderItem = (item: AgendaEntry, isFirst: Boolean) => {
    const obj = JSON.parse(item.name);
    const event: Event = {
      id: obj.id,
      dateEvent: obj.dateEvent,
      startTime: obj.startTime,
      endTime: obj.endTime,
      note: obj.note,
      status: obj.status,
      customerName: obj.customerName,
    };
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? "black" : "#43515c";

    return (
      <View>
        <TouchableOpacity
          style={{
            marginRight: 10,
            marginTop: 17,
          }}
          onPress={() => {
            fetchEventDetailById(event.id);
            toggleModal();
          }}
        >
          <Card>
            <Card.Content>
              <View style={style.itemView}>
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      color: "#808080",
                      fontSize: 18,
                      fontWeight: "300",
                      paddingBottom: 5,
                    }}
                  >
                    {moment(event.startTime, "HH:mm").format("HH:mm") +
                      " - " +
                      moment(event.endTime, "HH:mm").format("HH:mm")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      paddingBottom: 5,
                    }}
                  >
                    Lịch hẹn với {event.customerName}
                  </Text>
                  {event.note && (
                    <Text style={{ width: 200, paddingBottom: 5 }}>
                      Ghi chú:{" "}
                      <Text style={{ color: "#808080" }}>{event.note}</Text>
                    </Text>
                  )}
                  <Text style={{ paddingBottom: 5 }}>
                    Ngày diễn ra:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {event.dateEvent}
                    </Text>
                  </Text>
                  <Text>
                    Trạng thái:{" "}
                    <Text
                      style={{
                        color: eventStatusColor(event.status),
                      }}
                    >
                      {translateEventStatus(event.status)}
                    </Text>
                  </Text>
                </View>
                <View>
                  <MaterialCommunityIcons
                    name="calendar-edit"
                    size={30}
                    color="#FF9494"
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyItems = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "100%", height: 300 }}
          source={require("../../assets/images/noEvent.jpg")}
        />
        <Text style={{ paddingTop: 20, fontSize: 15 }}>
          Bạn không có lịch hẹn vào ngày này
        </Text>
      </View>
    );
  };

  return (
    <View style={style.containter}>
      <Header
        centerComponent={{ text: "Lịch hẹn", style: style.header }}
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
              <Text>Số điện thoại:</Text>
              <Text style={{ fontWeight: "bold" }}>{event.customerPhone}</Text>
            </View>
            <View style={style.contentModal}>
              <Text>Địa chỉ:</Text>
              <Text style={{ fontWeight: "bold" }}>
                {event.customerAddress}
              </Text>
            </View>
            <View style={style.contentModal}>
              <Text>Ngày diễn ra:</Text>
              <Text style={{ fontWeight: "bold" }}>{event.dateEvent}</Text>
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
            {event.status === "Active" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingTop: 20,
                  paddingBottom: 10,
                }}
              >
                <Button
                  titleStyle={{ color: "#00BFFF", fontSize: 15 }}
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: "#00BFFF",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  type="clear"
                  title="Đã đến nơi"
                  onPress={() => {
                    Alert.alert(
                      "Xác nhận đã đến nơi",
                      "Bạn đã đến nơi an toàn chưa ?",
                      [
                        {
                          text: "Đã an toàn",
                          onPress: () => handleInProgressEventBooking(event.id),
                        },
                        {
                          text: "Hủy",
                          onPress: () => {},
                        },
                      ]
                    );
                  }}
                />
                <View>
                  <Dialog.Container visible={isModalCancel}>
                    <Dialog.Title>Xác nhận hủy lịch hẹn</Dialog.Title>
                    <Dialog.Description>
                      Bạn có chắc chắn muốn hủy lịch hẹn này ?
                    </Dialog.Description>
                    <Dialog.Input
                      onChangeText={(text) => setCancelReason(text)}
                    />
                    <Dialog.Button
                      style={{ color: "red" }}
                      label="Đồng ý hủy"
                      onPress={() => handleCancelEventBooking(event.id)}
                    />
                    <Dialog.Button
                      label="Hủy"
                      onPress={() => setIsModalCancel(false)}
                    />
                  </Dialog.Container>
                </View>
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
                  title="Hủy lịch hẹn"
                  onPress={() => setIsModalCancel(true)}
                />
              </View>
            )}
            {event.status === "In Progress" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingTop: 20,
                  paddingBottom: 10,
                }}
              >
                <Button
                  titleStyle={{ color: "#00BFFF", fontSize: 15 }}
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: "#00BFFF",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  type="clear"
                  title="Đã hoàn thành"
                  onPress={() => {
                    Alert.alert(
                      "Xác nhận hoàn thành",
                      "Bạn có chắc chắn muốn hoàn thành lịch hẹn này ?",
                      [
                        {
                          text: "Đồng ý hoàn thành",
                          onPress: () => handleCompleteEventBooking(event.id),
                        },
                        {
                          text: "Hủy",
                          onPress: () => {},
                        },
                      ]
                    );
                  }}
                />
              </View>
            )}
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
        </ScrollView>
      </Modal>
      <Agenda
        items={items}
        selected={moment(new Date()).format("YYYY-MM-DD")}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyData={renderEmptyItems}
        onRefresh={fetchEventsForBeautician}
      />
    </View>
  );
};

export default EventScreen;
