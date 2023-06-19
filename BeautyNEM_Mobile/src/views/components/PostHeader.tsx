import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import Icons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { COLORS, SIZES } from "../constants";
import { Header } from "@rneui/themed";

const style = StyleSheet.create({
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 14,
  },
  add: { position: "absolute", top: 60, right: 20 },
});

const PostHeader = ({ onSearch, navigation }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.mainColor,
        padding: SIZES.font,
      }}
    >
      <Header
        centerComponent={{
          text: "Danh sách bài đăng",
          style: style.header,
        }}
        containerStyle={style.header}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={style.iconBack}
      >
        <Icons name="arrow-back" color="#FFF" size={24} />
      </TouchableOpacity>

      <View style={{ marginTop: SIZES.font }}>
        <View
          style={{
            width: "100%",
            borderRadius: SIZES.font,
            backgroundColor: COLORS.white,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <TextInput
            placeholder="Tìm kiếm bài đăng"
            style={{ flex: 1 }}
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default PostHeader;
