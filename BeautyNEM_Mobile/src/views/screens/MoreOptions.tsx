import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Header } from "@rneui/themed";
import { AuthContext } from "../../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const MoreOptions = ({ navigation }) => {
  const { logout, userRole } = useContext(AuthContext);

  return (
    <View style={Styles.container}>
      <Header
        centerComponent={{
          text: "Chức năng",
          style: Styles.header,
        }}
        containerStyle={Styles.header}
      />
      {userRole === "Beautician" ? (
        <View style={Styles.context}>
          <ScrollView>
            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("ProfileScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="account" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Hồ sơ</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>
            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => navigation.navigate("IncomeScreen")}
            >
              <View style={Styles.menuItem}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={25}
                  color="#FF6347"
                />
                <Text style={Styles.menuItemText}>Thu nhập</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>
            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => navigation.navigate("ScheduleScreen")}
            >
              <View style={Styles.menuItem}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={25}
                  color="#FF6347"
                />
                <Text style={Styles.menuItemText}>Lịch làm việc</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("BeauticianBookingHistoryScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="book-clock" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Lịch sử cuộc hẹn</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("RateListHistoryScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="star-box" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Lịch sử đánh giá</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("ModelRecruitment");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="post-outline" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Tuyển mẫu</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                logout();
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="logout" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>
          </ScrollView>
        </View>
      ) : userRole === "Customer" ? (
        <View style={Styles.context}>
          <ScrollView>
            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("CustomerProfileScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="account" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Hồ sơ</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("CustomerBookingHistoryScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="book-clock" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Lịch sử cuộc hẹn</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("ModelRecruitment");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="post-outline" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Tuyển mẫu</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("RecruitmentHistory");
              }}
            >
              <View style={Styles.menuItem}>
                <MaterialIcons name="history-edu" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Lịch sử tuyển mẫu</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("FavoriteListScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="heart-outline" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Yêu thích</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("RateListScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <MaterialIcons name="star-rate" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Đánh giá</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                logout();
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="logout" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>
          </ScrollView>
        </View>
      ) : (
        <View style={Styles.context}>
          <ScrollView>
            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("BeautyShopProfileScreen");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="account" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Hồ sơ cửa hàng</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("HomeStore");
              }}
            >
              <View style={Styles.menuItem}>
                <Fontisto name="shopping-store" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Cửa hàng</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity style={Styles.ListItem} onPress={() => {}}>
              <View style={Styles.menuItem}>
                <Icon
                  name="account-supervisor-circle"
                  color="#FF6347"
                  size={25}
                />
                <Text style={Styles.menuItemText}>Quản lý nhân viên</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("HomeProduct");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="archive-arrow-down" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Quản lý sản phẩm</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                navigation.navigate("ModelRecruitment");
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="post-outline" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Tuyển mẫu</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>

            <TouchableOpacity
              style={Styles.ListItem}
              onPress={() => {
                logout();
              }}
            >
              <View style={Styles.menuItem}>
                <Icon name="logout" color="#FF6347" size={25} />
                <Text style={Styles.menuItemText}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
            <View style={Styles.Space}></View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MoreOptions;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  context: {
    flex: 2,
    backgroundColor: "white",
    padding: 10,
  },
  ListItem: {
    backgroundColor: "#f6f6f6ff",
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
  },
  listItemContentView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  TextStyles: {
    fontSize: 15,
    color: "#676767ff",
    fontWeight: "400",
  },
  Space: {
    width: "100%",
    height: 20,
  },
});
