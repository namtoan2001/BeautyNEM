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
} from "../../../../services/eventBookingService";

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
    flexDirection: "row",
    position: "relative",
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
});

interface Event {
  id: number;
  beauticianId: number;
  customerId: number;
  dateEvent: string;
  startTime: string;
  endTime: string;
  note: string;
  beauticianName: string;
  status: string;
  serviceName: any;
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

const RecruitmentHistory = ({ navigation }) => {
  const [events, setEvents] = useState([{ id: 1 }]);
  const [isLoading, setIsLoading] = useState(false);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setIsLoading(true);
  //     fetchCustomerEventHistory();
  //   }, [])
  // );

  // const fetchCustomerEventHistory = () => {
  //   GetEventsForCustomer()
  //     .then((response) => {
  //       let eventData: Array<Event> = [];
  //       response.data.forEach((data) => {
  //         var dateEventFormat =
  //           weekDayObj[moment(data.dateEvent).format("d")] +
  //           ", " +
  //           moment(data.dateEvent).format("DD/MM/YYYY");
  //         if (data.eventStatus?.statusName === "Done") {
  //           GetEventDetailById(data.id)
  //             .then((response) => {
  //               let arrayServiceName = [];
  //               arrayServiceName = response.data.eventServices.map(
  //                 (item) => item.service.name
  //               );
  //               const formattedNames = arrayServiceName.map((name, index) => {
  //                 if (index === arrayServiceName.length - 1) {
  //                   return name + ".";
  //                 } else {
  //                   return name + ",";
  //                 }
  //               });
  //               eventData.push({
  //                 id: data.id,
  //                 dateEvent: dateEventFormat,
  //                 startTime: data.startTime,
  //                 endTime: data.endTime,
  //                 note: data.note,
  //                 status: data.eventStatus?.statusName,
  //                 beauticianName: data.beautician?.fullName,
  //                 beauticianId: response.data.beauticianId,
  //                 customerId: response.data.customer.id,
  //                 serviceName: formattedNames,
  //               });
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //         }
  //       });
  //       setEvents(eventData);
  //       setTimeout(() => {
  //         setIsLoading(false);
  //       }, 1000);
  //     })
  //     .catch((error) => {
  //       setTimeout(() => {
  //         Alert.alert("Thông báo lịch sử cuộc hẹn", error.response.data);
  //         setIsLoading(false);
  //       }, 1000);
  //     });
  // };

  const renderItem = ({ item, index }) => {
    // const event: Event = item;
    return (
      <>
        {/* {event.status === "Done" ? ( */}
        <View style={style.containterItem}>
          <View style={{ flexDirection: "column" }}>
            <Text>
              Bài đăng:{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {/* {event.beauticianName} */}
                Sơn móng tay tại nhà
              </Text>
            </Text>
            <Text
              style={{
                paddingBottom: 5,
              }}
            >
              Tên thợ:{" "}
              <Text
                style={{
                  color: "#72A0C1",
                }}
              >
                {/* {event.beauticianName} */}
                Lý Hòa
              </Text>
            </Text>
            <Text style={{ paddingBottom: 5 }}>
              Ngày diễn ra:{" "}
              {/* <Text style={{ fontWeight: "bold" }}>{event.dateEvent}</Text> */}
              <Text style={{ color: "#808080", fontSize: 16 }}>
                Thứ 2, 20/02/2023
              </Text>
            </Text>
            <Text style={{ width: 200 }}>
              Hình thức thu phí:{" "}
              {/* {event.serviceName.map((name, index) => (
              ))} */}
              <Text
                style={{
                  color: "#FF9494",
                  width: 10,
                }}
              >
                Miễn phí
              </Text>
            </Text>
          </View>
          {/* <TouchableOpacity
            style={{
              position: "absolute",
              backgroundColor: "#FF9494",
              width: 100,
              height: 30,
              right: 6,
              bottom: 6,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            onPress={() => {
              // navigation.navigate("CreateRateScreen", {
              //   beauticianId: event.beauticianId,
              //   customerId: event.customerId,
              // });
            }}
          >
            <Text
              style={{
                textAlign: "center",
                marginTop: 5,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Đánh giá
            </Text>
          </TouchableOpacity> */}
        </View>
        {/* ) : null} */}
      </>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>Chưa có hoạt động đặt lịch tuyển mẫu nào.</Text>
      </View>
    );
  };

  return (
    <View style={style.containter}>
      <View style={{ flex: 1 }}>
        {isLoading && (
          <ActivityIndicator
            style={style.activityIndicator}
            color="#FF9494"
            animating={isLoading}
            size={50}
          />
        )}
        <FlatList
          key={1}
          style={style.containter}
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </View>
  );
};

export default RecruitmentHistory;
