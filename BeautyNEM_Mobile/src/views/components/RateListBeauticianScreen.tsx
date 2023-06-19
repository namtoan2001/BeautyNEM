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
import { GetRating } from "../../../services/reviewService";

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
    maxHeight: "100%",
    paddingBottom: 20,
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
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    justifyContent: "center",
  },
  button_star: {
    flexDirection: "row",
    marginTop: 20,
    marginRight: 10,
    height: 40,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FEECEF",
    borderRadius: 20,
    backgroundColor: "#FEECEF",
  },
  text_star: {
    fontSize: 14,
    color: "#111111",
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

export default function RateListBeauticianScreen({ route, navigation }) {
  const [beauticianRating, setBeauticianRating] = useState([]);
  const [starRating, setStarRating] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [more, setMore] = useState(3);
  const [oneStars, setOneStars] = useState(0);
  const [twoStars, setTwoStars] = useState(0);
  const [threeStars, setThreeStars] = useState(0);
  const [fourStars, setFourStars] = useState(0);
  const [fiveStars, setFiveStars] = useState(0);

  const hideComment = beauticianRating.map((data) => data.comment).length === 0;

  useEffect(() => {
    GetRating(route.params.id)
      .then((response) => {
        setBeauticianRating(response.data.reverse());
        setStarRating(response.data);
        let OneStars = 1;
        let TwoStars = 1;
        let ThreeStars = 1;
        let FourStars = 1;
        let FiveStars = 1;
        // console.log(response.data);
        response.data.map((data) => {
          if (data.rating === 5) {
            setFiveStars(FiveStars++);
          } else if (data.rating === 1) {
            setOneStars(OneStars++);
            console.log(oneStars);
          } else if (data.rating === 2) {
            setTwoStars(TwoStars++);
          } else if (data.rating === 3) {
            setThreeStars(ThreeStars++);
          } else if (data.rating === 4) {
            setFourStars(FourStars++);
          }
        });
        console.log(oneStars);
      })
      .catch((error) => console.log(error));
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const rating1star = () => {
    GetRating(route.params.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 1) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
        console.log(`1 sao: ${list.length}`);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating2star = () => {
    GetRating(route.params.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 2) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
        console.log(`2 sao: ${list.length}`);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating3star = () => {
    GetRating(route.params.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 3) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
        console.log(`3 sao: ${list.length}`);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating4star = () => {
    GetRating(route.params.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 4) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
        console.log(`4 sao: ${list.length}`);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const rating5star = () => {
    GetRating(route.params.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.rating === 5) {
            list.push(data);
          }
        });
        setBeauticianRating(list);
        console.log(`5 sao: ${list.length}`);
      })
      .catch((error) => console.log(error));
    setMore(5);
  };
  const showAllRating = () => {
    GetRating(route.params.id)
      .then((response) => {
        setBeauticianRating(response.data.reverse());
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
          flexWrap: "wrap",
          maxWidth: "100%",
          marginBottom: 20,
          // justifyContent: "space-between",
          // gap: 5,
        }}
      >
        <TouchableOpacity style={styles.button_star} onPress={showAllRating}>
          <Text style={styles.text_star}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_star} onPress={rating5star}>
          <Text style={styles.text_star}>5</Text>
          <Icon name="star" color="orange" size={15} />
          {fiveStars !== undefined ? (
            <Text style={styles.text_star}>{`(${fiveStars})`}</Text>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_star} onPress={rating4star}>
          <Text style={styles.text_star}>4</Text>
          <Icon name="star" color="orange" size={15} />
          {/* <Text style={styles.text_star}>{`(${fourStars})`}</Text> */}
          {fourStars !== undefined ? (
            <Text style={styles.text_star}>{`(${fourStars})`}</Text>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_star} onPress={rating3star}>
          <Text style={styles.text_star}>3</Text>
          <Icon name="star" color="orange" size={15} />
          {/* <Text style={styles.text_star}>{`(${threeStars})`}</Text> */}
          {threeStars !== undefined ? (
            <Text style={styles.text_star}>{`(${threeStars})`}</Text>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_star} onPress={rating2star}>
          <Text style={styles.text_star}>2</Text>
          <Icon name="star" color="orange" size={15} />
          {/* <Text style={styles.text_star}>{`(${twoStars})`}</Text> */}
          {twoStars !== undefined ? (
            <Text style={styles.text_star}>{`(${twoStars})`}</Text>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_star} onPress={rating1star}>
          <Text style={styles.text_star}>1</Text>
          <Icon name="star" color="orange" size={15} />
          {/* <Text style={styles.text_star}>{`(${oneStars})`}</Text> */}
          {oneStars !== undefined ? (
            <Text style={styles.text_star}>{`(${oneStars})`}</Text>
          ) : null}
        </TouchableOpacity>
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
        data={beauticianRating}
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
                  uri: `https://res.cloudinary.com/dpwifnuax/image/upload/Review/BeauticianId_${route.params.id}/${item.image}`,
                }}
                style={styles.image}
              />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
