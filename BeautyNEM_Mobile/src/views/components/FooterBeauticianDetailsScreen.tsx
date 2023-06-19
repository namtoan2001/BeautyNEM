import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { Icon } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { GetBeauticianDetails } from "../../../services/BeauticianDetailsService";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import {
  AddBeauticianToFavorite,
  GetFavoriteList,
  RemoveBeauticianToFavorite,
} from "../../../services/FavoriteService";
import { GetCustomerProfile } from "../../../services/customerProfileService";
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconFavorite: {
    position: "absolute",
    top: -20,
    left: 1,
    zIndex: 1000,
  },
  button: {
    marginRight: 15,
    marginLeft: 20,
    backgroundColor: "#FF9494",
    height: 50,
    width: 200,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function FooterBeauticianDetailsScreen(props) {
  const { userToken, userRole, logout } = useContext(AuthContext);
  const [customerId, setCustomerId] = useState();
  const [favoriteState, setFavoriteState] = useState(false);

  const booking = () => {
    if (userRole === "Customer") {
      let token = userToken;
      props.navigation.navigate("CustomerBookingScreen", {
        beauticianID: props.id,
      });
    } else {
      if (userRole === "Beautician") {
        Alert.alert(
          "Thông báo",
          "Bạn phải đăng xuất và đăng nhập dưới tư cách khách hàng thì mới thực hiện được chức năng này",
          [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Đăng xuất và chuyển đến màn hình đăng nhập",
              onPress: () => {
                logout();
                props.navigation.navigate("CustomerLoginScreen");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Thông báo",
          "Bạn phải đăng nhập dưới tư cách khách hàng thì mới thực hiện được chức năng này",
          [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Chuyển đến màn hình đăng nhập",
              onPress: () => {
                props.navigation.navigate("CustomerLoginScreen");
              },
            },
          ]
        );
      }
    }
  };

  const [phonenumber, setPhonenumber] = useState("");

  useEffect(() => {
    GetBeauticianDetails(props.id).then((response) => {
      setPhonenumber(response.data.phoneNumber);
    });
    GetCustomerProfile().then((response) => {
      setCustomerId(response.data.id);
    });
    GetFavoriteList().then((response) => {
      response.data.map((item) => {
        if (item.beauticianId === props.id) {
          setFavoriteState(true);
        }
      });
    });
  }, [favoriteState]);

  const makeCall = () => {
    let phoneNumber = "";
    Alert.alert("Cảnh báo", `Bạn có chắc gọi tới số ${phonenumber} không?`, [
      {
        text: "OK",
        onPress: () => {
          if (Platform.OS === "android") {
            phoneNumber = `tel:${phonenumber}`;
          } else {
            phoneNumber = `telprompt:${phonenumber}`;
          }
          Linking.openURL(phoneNumber);
        },
        style: "default",
      },
      { text: "Hủy bỏ" },
    ]);
  };

  const handleAddFavorite = () => {
    let formData = new FormData();
    formData.append("BeauticianId", props.id);
    formData.append("CustomerId", customerId);
    AddBeauticianToFavorite(formData)
      .then((response) => {
        Alert.alert("Thông báo", "Đã thêm thợ vào danh sách yêu thích.");
        // props.navigation.navigate("BeauticianDetails", favoriteState);
        setFavoriteState(true);
      })
      .catch((err) => {
        RemoveBeauticianToFavorite(props.id, customerId).then((result) => {
          Alert.alert("Thông báo", "Đã loại bỏ thợ khỏi danh sách yêu thích.");
          setFavoriteState(false);
        });
      });
  };

  return (
    <View style={{ height: 80 }}>
      <View style={styles.container}>
        {userRole === "Customer" ? (
          <TouchableOpacity
            style={{ marginLeft: 30 }}
            onPress={handleAddFavorite}
          >
            {favoriteState ? (
              <MaterialIcons name="favorite" color="red" size={26} />
            ) : (
              <MaterialIcons name="favorite-outline" color="red" size={26} />
            )}
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={makeCall}>
          <Icon name="phone" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={booking}>
          <Text style={{ alignItems: "center", fontSize: 20, color: "white" }}>
            Đặt Lịch
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
