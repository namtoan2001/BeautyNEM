import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { Header } from "@rneui/themed";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";

const style = StyleSheet.create({
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  containter: {
    backgroundColor: "#FF9494",
    borderTopWidth: 0,
    borderBottomWidth: 0,
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
});

const ChooseLoginRole = ({ navigation }) => {
  return (
    <View style={Styles.container}>
      <Header
        centerComponent={{
          text: "Đăng nhập",
          style: style.header,
        }}
        containerStyle={style.header}
      />
      <View style={Styles.context}>
        <ScrollView>
          <TouchableOpacity
            style={Styles.ListItem}
            onPress={() => {
              navigation.navigate("CustomerLoginScreen");
            }}
          >
            <View style={Styles.menuItem}>
              <Icon name="user" color="#FF6347" size={25} />
              <Text style={Styles.menuItemText}>Khách hàng</Text>
            </View>
          </TouchableOpacity>
          <View style={Styles.Space}></View>

          <TouchableOpacity
            style={Styles.ListItem}
            onPress={() => {
              navigation.navigate("BeauticianLogin");
            }}
          >
            <View style={Styles.menuItem}>
              <Icon name="user-female" color="#FF6347" size={25} />
              <Text style={Styles.menuItemText}>Thợ làm đẹp</Text>
            </View>
          </TouchableOpacity>
          <View style={Styles.Space}></View>

          {/* <TouchableOpacity
            style={Styles.ListItem}
            onPress={() => {
              navigation.navigate("BeautyShopLoginScreen");
            }}
          >
            <View style={Styles.menuItem}>
              <Icon name="basket" color="#FF6347" size={25} />
              <Text style={Styles.menuItemText}>Chủ cửa hàng</Text>
            </View>
          </TouchableOpacity>
          <View style={Styles.Space}></View> */}

          <TouchableOpacity
            style={Styles.ListItem}
            onPress={() => {
              navigation.navigate("ModelRecruitment");
            }}
          >
            <View style={Styles.menuItem}>
              <Icons name="post-outline" color="#FF6347" size={25} />
              <Text style={Styles.menuItemText}>Tuyển mẫu</Text>
            </View>
          </TouchableOpacity>
          <View style={Styles.Space}></View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ChooseLoginRole;

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
