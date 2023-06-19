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
import { GetBeauticianDetailsWithToken } from "../../../../services/BeauticianProfileService";
import { GetRating } from "../../../../services/reviewService";
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
  starImgStyle: {
    width: 20,
    height: 20,
    resizeMode: "cover",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderColor: "white",
    marginLeft: 20,
    // resizeMode: "cover",
  },
});

interface Rating {
  id: number;
  rating: number;
  comment: string;
  image: string;
  username: string;
}

const Ratings: Array<Rating> = [
  {
    id: 0,
    rating: 1,
    comment: "",
    image: "",
    username: "",
  },
];

const weekDayObj: Object = {
  "0": "Chủ nhật",
  "1": "Thứ 2",
  "2": "Thứ 3",
  "3": "Thứ 4",
  "4": "Thứ 5",
  "5": "Thứ 6",
  "6": "Thứ 7",
};

const RateListHistoryScreen = ({ navigation }) => {
  const [ratings, setRatings] = useState(Ratings);
  const [isLoading, setIsLoading] = useState(false);
  const [beauticianID, setBeauticianID] = useState();
  const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    "https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png";
  const starImgCorner =
    "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchBeauticianRatingHistory();
    }, [])
  );

  const fetchBeauticianRatingHistory = () => {
    GetBeauticianDetailsWithToken().then((result) => {
      setBeauticianID(result.data.id);
      GetRating(result.data.id).then((ratings) => {
        // console.log(ratings.data);
        setRatings(ratings.data);
        setIsLoading(false);
      });
    });
  };

  const renderItem = ({ item, index }) => {
    const rating: Rating = item;
    return (
      <View style={style.containterItem}>
        <View
          style={{ flexDirection: "column", marginBottom: 10, marginTop: 10 }}
        >
          <Text style={{ marginBottom: 10, maxWidth: 220 }}>
            Khách hàng:{" "}
            <Text
              style={{
                color: "#72A0C1",
              }}
            >
              {rating.username}
            </Text>
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              marginBottom: 10,
            }}
          >
            <Text>Chất lượng: </Text>
            <View style={{ flexDirection: "row" }}>
              {maxRating.map((item, key) => {
                return (
                  <Image
                    key={key}
                    style={style.starImgStyle}
                    source={
                      item <= rating.rating
                        ? { uri: starImgFilled }
                        : { uri: starImgCorner }
                    }
                  />
                );
              })}
            </View>
            {/* {rating.serviceName.map((name, index) => (
                <Text
                  style={{
                    color: "#FF9494",
                    width: 10,
                  }}
                >
                  {`${name} `}
                </Text>
              ))} */}
          </View>
          <Text style={{ maxWidth: 220 }}>
            Nội dung:{" "}
            <Text
              style={{
                color: "#808080",
                fontSize: 14,
                fontWeight: "300",
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              {rating.comment}
              {/* {moment(rating.startTime, "HH:mm").format("HH:mm") +
                " - " +
                moment(rating.endTime, "HH:mm").format("HH:mm")} */}
            </Text>
          </Text>
        </View>
        <Image
          style={style.image}
          source={{
            uri: `https://res.cloudinary.com/dpwifnuax/image/upload/Review/BeauticianId_${beauticianID}/${rating.image}`,
          }}
        />
      </View>
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
        <Text>Chưa có đánh giá nào về dịch vụ làm đẹp của bạn.</Text>
      </View>
    );
  };

  return (
    <View style={style.containter}>
      {isLoading && (
        <ActivityIndicator
          style={style.activityIndicator}
          color="#FF9494"
          animating={isLoading}
          size={50}
        />
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          key={1}
          style={style.containter}
          data={ratings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </View>
  );
};

export default RateListHistoryScreen;
