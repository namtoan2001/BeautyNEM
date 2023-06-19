import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  LogBox,
  ActivityIndicator,
  Image,
} from "react-native";
import { Icon } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { GetRating } from "../../../services/reviewService";
import { TextInput } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
  },
  rateBox: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 20,
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#FF9494",
    borderRadius: 15,
  },
  rating: {
    marginTop: 20,
    marginLeft: 50,
    flexDirection: "column",
    justifyContent: "center",
    width: 150,
  },
  ratingBar: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 10,
    height: 5,
    borderRadius: 1000,
  },
  button: {
    marginTop: 50,
    backgroundColor: "#FF9494",
    height: 50,
    width: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  listComment: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  comment: {
    color: "#808080",
    marginTop: 3,
    marginLeft: 20,
    marginRight: 20,
  },
  commentBox: {
    marginTop: 20,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    justifyContent: "center",
  },
  button_star: {
    flexDirection: "row",
    marginTop: 20,
    height: 40,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FF9494",
    borderRadius: 20,
  },
  text_star: {
    fontSize: 20,
    color: "#FF9494",
  },
  buttonShowAllRating: {
    flexDirection: "row",
    marginTop: 20,
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FF9494",
    borderRadius: 20,
  },
  footer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#FF9494",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderColor: "white",
    // resizeMode: "cover",
  },
});

export default function RateBeauticianDetailsScreen(props) {
  const [beauticianRating, setBeauticianRating] = useState([]);
  const [starRating, setStarRating] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [more, setMore] = useState(3);
  const [numberRating, setNumberRating] = useState(0);
  const [images, setImages] = useState("");

  const hideComment = beauticianRating.map((data) => data.comment).length === 0;

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    GetRating(props.id)
      .then((response) => {
        setBeauticianRating(response.data.reverse());
        setStarRating(response.data);
        setNumberRating(response.data.length);
      })
      .catch((error) => console.log(error));
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const rating1star = () => {
    GetRating(props.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 1) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating2star = () => {
    GetRating(props.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 2) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating3star = () => {
    GetRating(props.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 3) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating4star = () => {
    GetRating(props.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 4) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating5star = () => {
    GetRating(props.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 5) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const showAllRating = () => {
    GetRating(props.id)
      .then((response) => {
        setBeauticianRating(response.data);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };

  const loadMore = () => {
    setMore(more + 2);
  };

  const renderFooter = () => {
    if (beauticianRating.map((data) => data.comment).length <= more) {
    } else {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={loadMore}
            style={styles.loadMoreBtn}
          >
            <Text style={styles.btnText}>Xem thêm</Text>
            {isLoading ? (
              <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
      );
    }
  };

  let arr = starRating.map((data) => data.rating);
  let onestar = [];
  let twostar = [];
  let threestar = [];
  let fourstar = [];
  let fivestar = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 1) {
      onestar += arr[i];
    } else if (arr[i] === 2) {
      twostar += arr[i];
    } else if (arr[i] === 3) {
      threestar += arr[i];
    } else if (arr[i] === 4) {
      fourstar += arr[i];
    } else if (arr[i] === 5) {
      fivestar += arr[i];
    }
  }
  let oneStarRate = Math.floor((onestar.length / arr.length) * 100);
  let twoStarRate = Math.floor((twostar.length / arr.length) * 100);
  let threeStarRate = Math.floor((threestar.length / arr.length) * 100);
  let fourStarRate = Math.floor((fourstar.length / arr.length) * 100);
  let fiveStarRate = Math.floor((fivestar.length / arr.length) * 100);

  let avg = arr.reduce((sum, curr) => sum + Number(curr), 0) / arr.length;
  let result = Math.round(avg * 10) / 10;

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator animating={true} size="large" color="#FF9494" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>Đánh giá</Text>
          <Text
            style={{ fontWeight: "bold", fontSize: 15 }}
          >{` (${numberRating})`}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            props.navigation("RateListBeauticianScreen");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, color: "#ccc" }}>Xem tất cả</Text>
          <MaterialIcons name="navigate-next" size={22} color="#ccc" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.rateBox}>
          <TouchableOpacity>
            <Text style={{ color: "#FF9494", fontSize: 25 }}>{result}</Text>
          </TouchableOpacity>
          <Icon name="star" color="orange" size={30} />
        </View>
        <View style={styles.rating}>
          <View style={{ flexDirection: "row" }}>
            <Text>1</Text>
            <Icon name="star" color="orange" size={15} />
            <View
              style={[
                { width: `${oneStarRate}%`, backgroundColor: "orange" },
                styles.ratingBar,
              ]}
            ></View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>2</Text>
            <Icon name="star" color="orange" size={15} />
            <View
              style={[
                { width: `${twoStarRate}%`, backgroundColor: "orange" },
                styles.ratingBar,
              ]}
            ></View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>3</Text>
            <Icon name="star" color="orange" size={15} />
            <View
              style={[
                { width: `${threeStarRate}%`, backgroundColor: "orange" },
                styles.ratingBar,
              ]}
            ></View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>4</Text>
            <Icon name="star" color="orange" size={15} />
            <View
              style={[
                { width: `${fourStarRate}%`, backgroundColor: "orange" },
                styles.ratingBar,
              ]}
            ></View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>5</Text>
            <Icon name="star" color="orange" size={15} />
            <View
              style={[
                { width: `${fiveStarRate}%`, backgroundColor: "orange" },
                styles.ratingBar,
              ]}
            ></View>
          </View>
        </View>
      </View>
      {hideComment ? (
        <View
          style={{
            height: 300,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "gray", fontSize: 20 }}>
            Chưa có bài đánh giá nào.
          </Text>
        </View>
      ) : null}
      <FlatList
        data={beauticianRating.slice(0, more)}
        renderItem={({ item, index }) => (
          <View style={styles.commentBox}>
            <View style={styles.listComment}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 5,
                }}
              >
                <Icon name="user" type="font-awesome" size={15} color="gray" />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "gray",
                    marginLeft: 5,
                  }}
                >
                  {item.username}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>{item.rating}</Text>
                <Icon name="star" color="orange" size={15} />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
                marginLeft: 14,
                marginRight: 20,
              }}
            >
              <Text style={{ color: "#808080", fontSize: 13, marginBottom: 5 }}>
                {item.comment}
              </Text>
            </View>
            {item.image ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  flexDirection: "row",
                  marginLeft: 14,
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{
                    uri: `https://res.cloudinary.com/dpwifnuax/image/upload/Review/BeauticianId_${props.id}/${item.image}`,
                  }}
                  style={styles.image}
                />
              </View>
            ) : null}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={renderFooter}
      />
    </View>
  );
}
