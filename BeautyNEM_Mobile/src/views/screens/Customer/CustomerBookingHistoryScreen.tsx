import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Header } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import {
  GetEventDetailById,
  GetEventsForCustomer,
  SearchFilterSortForCustomer,
} from "../../../../services/eventBookingService";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AddRatingBeautician } from "../../../../services/ratingService";
import { GetTokenDevice } from "../../../../services/tokenDeviceService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddNotificationForBeautician } from "../../../../services/notificationBeauticianService";
import { sendPushNotification } from "../../../../services/ExpoPushNotificationService";
import { Dimensions } from "react-native";
import SearchFilterSort from "../../components/SearchFilterSort";

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
  activityIndicator: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
  containterItem: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modal: {
    backgroundColor: "#FFF",
    marginBottom: 150,
    marginTop: 150,
    borderRadius: 10,
    justifyContent: "flex-start",
  },
  contentModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginLeft: 5,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  star: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  listEmpty: {
    height: Dimensions.get("window").height,
    alignItems: "center",
    paddingTop: 50,
  },
});

interface SearchFilterSortRequest {
  keyword: string;
  serviceIds: string;
  sortingId: number;
}

interface Service {
  id: number;
  item: string;
  isSelected: boolean;
}

interface Event {
  id: number;
  dateEvent: string;
  startTime: string;
  endTime: string;
  note: string;
  beauticianName: string;
  status: string;
  starNumber: number;
}

interface EventDetail {
  id: number;
  dateEvent: string;
  startTime: string;
  endTime: string;
  services: Array<any>;
  note: string;
  beauticianId: number;
  beauticianName: string;
  beauticianPhone: string;
  customerId: string;
  customerName: string;
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

const CustomerBookingHistoryScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [event, setEvent] = useState<EventDetail>({
    id: 0,
    beauticianId: 0,
    beauticianName: "",
    beauticianPhone: "",
    customerId: "",
    customerName: "",
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
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [starNumber, setStarNumber] = useState(0);
  const starFilledPath = "../../../assets/icons/star_filled.png";
  const starCornerPath = "../../../assets/icons/star_corner.png";
  const [textComment, setTextComment] = useState("");
  const [keyword, setKeyword] = useState("");
  const [serviceIds, setServiceIds] = useState("");
  const [sortingId, setSortingId] = useState(1);
  const [services, setServices] = useState([]);
  const request: SearchFilterSortRequest = {
    keyword: keyword,
    serviceIds: serviceIds,
    sortingId: sortingId,
  };

  const onPushVotingNotification = async () => {
    let customer = JSON.parse(await AsyncStorage.getItem("userInfo"));
    GetTokenDevice({
      userId: event.beauticianId,
      role: "Beautician",
    }).then(async (response) => {
      const token = response.data;
      if (token) {
        const message = {
          body: `Khách hàng ${customer.fullName} đã đánh giá dịch vụ của bạn ngày hôm nay. Bạn có thể xem ngay trong thông báo hoặc lịch sử cuộc hẹn.`,
          sound: "default",
          data: {},
        };
        await sendPushNotification(token, message);
      }
    });
  };

  const handleNotifyVotingToBeautician = async () => {
    let customer = JSON.parse(await AsyncStorage.getItem("userInfo"));
    let formData = new FormData();
    formData.append(
      "Title",
      `Khách hàng ${customer.fullName} đã đánh giá dịch vụ của bạn ngày hôm nay. Bạn có thể xem ngay trong thông báo hoặc lịch sử cuộc hẹn.`
    );
    formData.append("Content", "");
    formData.append("BeauticianId", event.beauticianId.toString());
    formData.append("EventId", event.id.toString());
    AddNotificationForBeautician(formData)
      .then((response) => {
        if (response.data) onPushVotingNotification();
      })
      .catch((error) => {
        Alert.alert(error.response.data);
      });
  };

  const handleAddRating = () => {
    if (starNumber !== 0 && textComment !== "") {
      var formData = new FormData();
      formData.append("StarNumber", starNumber.toString());
      formData.append("Comment", textComment);
      formData.append("BeauticianId", event.beauticianId.toString());
      formData.append("EventId", event.id.toString());
      AddRatingBeautician(formData)
        .then((response) => {
          toggleModal();
          Alert.alert("Thông báo đánh giá", "Cảm ơn bạn đã sử dụng dịch vụ !");
          handleNotifyVotingToBeautician();
        })
        .catch((error) => {
          toggleModal();
          Alert.alert(error.response.data);
        });
    } else {
      Alert.alert(
        "Thông báo đánh giá",
        "Vui lòng chọn số sao và nhập bình luận để đánh giá !"
      );
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

  const toggleModal = () => {
    setStarNumber(0);
    setTextComment("");
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
      fetchCustomerEventHistory(request);
    }, [])
  );

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
          beauticianId: data.beautician?.id,
          beauticianName: data.beautician?.fullName,
          beauticianPhone: data.beautician?.phoneNumber,
          customerId: data.customer?.id,
          customerName: data.customer?.fullName,
          customerAddress: data.customer?.address,
          starNumber: data.rating?.starNumber,
          comment: data.rating?.comment,
        };
        setEvent(event);
      })
      .catch((error) => Alert.alert(error.response.data));
  };

  const HeaderComponent = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 10,
          paddingRight: 5,
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#808080",
          }}
        >
          Bạn có tổng cộng {events.length} lịch sử cuộc hẹn
        </Text>
        <Button
          title="Reset"
          type="clear"
          titleStyle={{ fontSize: 14 }}
          buttonStyle={{ padding: 0 }}
          onPress={onResetFilter}
        />
      </View>
    );
  };

  const onResetFilter = () => {
    const resetData: SearchFilterSortRequest = {
      keyword: "",
      serviceIds: "",
      sortingId: 1,
    };
    setIsLoading(true);
    setKeyword("");
    setServiceIds("");
    setSortingId(1);
    const listServices: Array<Service> = services;
    listServices.map((x) => (x.isSelected = false));
    setServices(listServices);
    fetchCustomerEventHistory(resetData);
  };

  const fetchCustomerEventHistory = (_request: SearchFilterSortRequest) => {
    SearchFilterSortForCustomer(_request)
      .then((response) => {
        let eventData: Array<Event> = [];
        response.data.forEach((data) => {
          var dateEventFormat =
            weekDayObj[moment(data.dateEvent).format("d")] +
            ", " +
            moment(data.dateEvent).format("DD/MM/YYYY");
          if (
            data.eventStatus?.statusName !== "Pending" &&
            data.eventStatus?.statusName !== "Reject"
          ) {
            eventData.push({
              id: data.id,
              dateEvent: dateEventFormat,
              startTime: data.startTime,
              endTime: data.endTime,
              note: data.note,
              status: data.eventStatus?.statusName,
              beauticianName: data.beautician?.fullName,
              starNumber: data.rating?.starNumber,
            });
          }
        });
        setEvents(eventData);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          Alert.alert("Thông báo lịch sử cuộc hẹn", error.response.data);
          setIsLoading(false);
        }, 1000);
      });
  };

  const renderItem = ({ item, index }) => {
    const event: Event = item;
    return (
      <TouchableOpacity
        style={style.containterItem}
        onPress={() => {
          fetchEventDetailById(event.id);
          toggleModal();
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <Text style={{ color: "#72A0C1", fontSize: 16 }}>
            Cuộc hẹn với {event.beauticianName}
          </Text>
          <Text
            style={{
              color: "#808080",
              fontSize: 18,
              fontWeight: "300",
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            {moment(event.startTime, "HH:mm").format("HH:mm") +
              " - " +
              moment(event.endTime, "HH:mm").format("HH:mm")}
          </Text>
          <Text style={{ paddingBottom: 5 }}>
            Ngày diễn ra:{" "}
            <Text style={{ fontWeight: "bold" }}>{event.dateEvent}</Text>
          </Text>
          <Text style={{ paddingBottom: 5 }}>
            Trạng thái:{" "}
            <Text
              style={{
                color: eventStatusColor(event.status),
              }}
            >
              {translateEventStatus(event.status)}
            </Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ paddingRight: 5 }}>Đánh giá:</Text>
            {event.starNumber > 0 ? (
              <Text>{StarNumberComponent(event.starNumber)}</Text>
            ) : (
              <Text
                style={{
                  fontStyle: "italic",
                  color: "#808080",
                  fontSize: 12,
                }}
              >
                Chưa có đánh giá
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View style={style.listEmpty}>
        <Image
          style={{ width: 300, height: 300, opacity: 0.8 }}
          source={require("../../../assets/images/noResultFound.png")}
        />
        <Text>Không tìm thấy cuộc hẹn nào với thợ làm đẹp !</Text>
      </View>
    );
  };

  return (
    <View style={style.containter}>
      <Header
        centerComponent={{ text: "Lịch sử cuộc hẹn", style: style.header }}
        containerStyle={style.header}
        leftComponent={
          <MaterialIcons
            name="arrow-back"
            size={23}
            color="#FFF"
            onPress={() => navigation.goBack()}
          />
        }
      />
      <SearchFilterSort
        fetchData={fetchCustomerEventHistory}
        request={request}
        keyword={keyword}
        setKeyword={setKeyword}
        services={services}
        setServices={setServices}
        serviceIds={serviceIds}
        setServiceIds={setServiceIds}
        sortingId={sortingId}
        setSortingId={setSortingId}
        setIsLoading={setIsLoading}
        placeHolderText="Nhập tên thợ làm đẹp"
      />
      <View style={{ flex: 1 }}>
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
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
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
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
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
                  <Text style={{ fontWeight: "bold" }}>
                    {event.beauticianName}
                  </Text>
                </View>
                <View style={style.contentModal}>
                  <Text>Số điện thoại thợ:</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {event.beauticianPhone}
                  </Text>
                </View>
                <View style={style.contentModal}>
                  <Text>Địa chỉ của bạn:</Text>
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
                  <View
                    style={{ flexDirection: "column", alignItems: "flex-end" }}
                  >
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
                {/* <View style={style.contentModal}>
                  <Text>Ghi chú của bạn:</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontStyle: "italic",
                      color: "#808080",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    {event.note}
                  </Text>
                </View> */}
                {/* {event.status === "Done" && event.starNumber == null && (
                  <View style={{ flexDirection: "column" }}>
                    <View style={style.rating}>
                      {maxRating.map((item, index) => {
                        return (
                          <TouchableOpacity
                            style={{ paddingLeft: 5 }}
                            activeOpacity={0.7}
                            key={index}
                            onPress={() => setStarNumber(item)}
                          >
                            <Image
                              style={style.star}
                              source={
                                item <= starNumber
                                  ? require(starFilledPath)
                                  : require(starCornerPath)
                              }
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <TextInput
                      style={{
                        textAlignVertical: "top",
                        borderColor: "#808080",
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                      multiline={true}
                      numberOfLines={3}
                      placeholder="Nhập bình luận của bạn tại đây !"
                      onChangeText={(text) => setTextComment(text)}
                      value={textComment}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        paddingTop: 20,
                        paddingBottom: 10,
                      }}
                    >
                      <Button
                        titleStyle={{ color: "#FEBE10", fontSize: 15 }}
                        containerStyle={{
                          borderWidth: 1,
                          borderColor: "#FEBE10",
                          borderRadius: 5,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        type="clear"
                        title="Đánh giá dịch vụ"
                        onPress={() => handleAddRating()}
                      />
                    </View>
                  </View>
                )} */}
                {/* {event.starNumber > 0 && (
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
                      <Text>Bình luận của bạn: </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontStyle: "italic",
                          color: "#808080",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        {event.comment}
                      </Text>
                    </View>
                  </View>
                )} */}
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </Modal>
        <FlatList
          key={1}
          style={style.containter}
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={HeaderComponent}
        />
      </View>
    </View>
  );
};

export default CustomerBookingHistoryScreen;
