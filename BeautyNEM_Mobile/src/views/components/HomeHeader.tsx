import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";

import { AuthContext } from "../../context/AuthContext";
import Icons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { COLORS, SIZES } from "../constants";
import { Header } from "@rneui/themed";
import {
  GetCities,
  GetDistricts,
} from "../../../services/beauticianRegisterService";

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
  selectDropdownButton: {
    backgroundColor: "#FF9494",
  },
  selectDropdownButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
});

const HomeHeader = ({ onSearch, selectCity, selectDistrict, navigation }) => {
  const { userRole } = useContext(AuthContext);
  const [cityId, setCityId] = useState(1);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    GetCities().then((response) => {
      setCities(response.data);
    });
  }, []);

  useEffect(() => {
    GetDistricts(cityId)
      .then((response) => {
        setDistricts([{ id: 0, item: "Tất cả" }, ...response.data]);
      })
      .catch((error) => console.log(error));
  }, [cityId]);

  return (
    <View
      style={{
        backgroundColor: COLORS.mainColor,
        padding: SIZES.font,
      }}
    >
      <Header
        centerComponent={{
          text: "Tuyển mẫu",
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

      {userRole === "Beautician" ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CreatePost");
          }}
          style={style.add}
        >
          <MaterialIcons name="post-add" color="#FFF" size={24} />
        </TouchableOpacity>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FF9494",
          paddingLeft: 10,
          paddingRight: 5,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "200",
          }}
        >
          Chọn Tỉnh/TP
        </Text>
        <SelectDropdown
          data={cities}
          onSelect={selectCity}
          buttonTextAfterSelection={(selectedItem, index) => {
            setCityId(selectedItem.id);
            return selectedItem.item;
          }}
          rowTextForSelection={(item, index) => {
            return item.item;
          }}
          defaultButtonText="Chọn khu vực"
          defaultValue={cities[0]}
          renderDropdownIcon={() => (
            <MaterialIcons name="keyboard-arrow-down" size={20} color="#FFF" />
          )}
          statusBarTranslucent={true}
          buttonStyle={style.selectDropdownButton}
          buttonTextStyle={style.selectDropdownButtonText}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FF9494",
          paddingLeft: 10,
          paddingRight: 5,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "200",
          }}
        >
          Chọn Quận
        </Text>
        <SelectDropdown
          data={districts}
          defaultValue={districts[0]}
          onSelect={selectDistrict}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.item;
          }}
          rowTextForSelection={(item, index) => {
            return item.item;
          }}
          defaultButtonText="Quận huyện"
          renderDropdownIcon={() => (
            <MaterialIcons name="keyboard-arrow-down" size={20} color="#FFF" />
          )}
          buttonStyle={style.selectDropdownButton}
          buttonTextStyle={style.selectDropdownButtonText}
        />
      </View>
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

export default HomeHeader;
