import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  GetFavoriteList,
  RemoveBeauticianToFavorite,
} from "../../../../services/FavoriteService";
import { GetBeauticianDetails } from "../../../../services/BeauticianDetailsService";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { GetCustomerProfile } from "../../../../services/customerProfileService";

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
    width: "95%",
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
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

const FavoriteListScreen = ({ navigation }) => {
  const [beauticianInfo, setBeauticianInfo] = useState([]);
  const [customerId, setCustomerId] = useState();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetCustomerProfile().then((response) => {
      setCustomerId(response.data.id);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchFavoriteList();
    }, [])
  );

  useEffect(() => {
    GetFavoriteList().then((response) => {
      let promises = response.data.map((item, index) => {
        return GetBeauticianDetails(item.beauticianId)
          .then((beauticianInfo) => {
            return beauticianInfo.data;
          })
          .catch((error) => {
            console.log(error);
            return null;
          });
      });
      Promise.all(promises).then((data) => {
        let Beauticians = data.filter((item) => item !== null);
        setBeauticianInfo(Beauticians);
      });
    });
  }, [beauticianInfo]);

  // console.log(beauticianInfo);
  // console.log(services);

  const fetchFavoriteList = () => {
    GetFavoriteList()
      .then((response) => {
        let promises = response.data.map((item, index) => {
          return GetBeauticianDetails(item.beauticianId)
            .then((beauticianInfo) => {
              return beauticianInfo.data;
            })
            .catch((error) => {
              console.log(error);
              return null;
            });
        });
        Promise.all(promises).then((data) => {
          let Beauticians = data.filter((item) => item !== null);
          setBeauticianInfo(Beauticians);
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  const handleDeleteFavorite = (id) => {
    Alert.alert("Thông báo", "Bạn có chắc muốn xóa bài đăng này?", [
      {
        text: "Hủy",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          RemoveBeauticianToFavorite(id, customerId)
            .then((response) => {
              Alert.alert(
                "Thông báo",
                "Đã loại bỏ thợ khỏi danh sách yêu thích."
              );
            })
            .catch((err) => {
              // Alert.alert(err.response.data);
              console.log(`Thất bại:`, err.response);
            });
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={style.containterItem}
        onPress={() => {
          navigation.navigate("BeauticianDetails", { id: item.id });
        }}
      >
        <View style={{ flexDirection: "column", width: "78%", padding: 10 }}>
          <Text>
            Tên thợ:{" "}
            <Text
              style={{
                color: "#72A0C1",
              }}
            >
              {item.fullName}
            </Text>
          </Text>
          <Text
            style={{
              paddingTop: 5,
              paddingBottom: 5,
              maxWidth: 250,
            }}
          >
            SĐT: {item.phoneNumber}
          </Text>
          <Text style={{ paddingBottom: 5, maxWidth: 250 }}>
            Khu vực: {`${item.district}, ${item.city}`}
          </Text>
          {/* <Text style={{ maxWidth: 250 }}>
            Dịch vụ:{" "}
            <Text
              style={{
                color: "#FF9494",
                width: 10,
              }}
            >
              {item.serviceName}
            </Text>
      
          </Text> */}
        </View>
        <TouchableOpacity
          onPress={() => {
            handleDeleteFavorite(item.id);
          }}
        >
          <View
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              height: "100%",
              width: 75,
              // width: "100%",
              backgroundColor: "#fd2626",
              borderBottomRightRadius: 5,
              borderTopRightRadius: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="remove" color="#363434" size={30} />
            <Text>Xóa</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
        <Text>Hiện tại chưa có thợ nào trong danh sách yêu thích.</Text>
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
          data={beauticianInfo}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </View>
  );
};

export default FavoriteListScreen;
