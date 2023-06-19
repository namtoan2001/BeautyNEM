import React, {useState, useRef} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import Popover from 'react-native-popover-view';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#FF9494",
  },
  text: {
    flex: 1,
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  touchableOpacity: {
    alignItems: "center",
    justifyContent: "center",
  },
  HeaderSearch: {
    backgroundColor: "#FF9494",
    width: "100%",
    height: 42,
  },
  btnSearch: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 6,
    borderRadius: 10,
    marginTop: 4,
    marginRight: 20,
    marginLeft: 20,
  },
  buttonText: {
    color: "#FF9494",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 500,
    width: 400,
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

const Header = (props) => {
  const [contact, setContact] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <Modal
          animationType="none"
          transparent={true}
          visible={contact}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setContact(!contact);
          }}
        >
          <View
            style={{
              ...styles.centeredView,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  top: 5,
                  left: "43%",
                }}
                onPress={() => setContact(!contact)}
              >
                <FontAwesome
                  name="remove"
                  style={{
                    top: -2,
                    left: 2,
                    color: "red",
                  }}
                  size={30}
                />
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#FF9494",
                  }}
                >
                  Liên hệ với chúng tôi
                </Text>
              </View>
              <View style={{ padding: 20 }}>
                <Text style={{ color: "gray", fontSize: 15 }}>
                  {"      "}
                  Chúng tôi luôn mong muốn cung cấp cho khách hàng dịch vụ và
                  sản phẩm tốt nhất, tuy nhiên đôi khi cũng có thể xảy ra những
                  sự cố không mong muốn. Nếu bạn gặp bất kỳ vấn đề gì khi sử
                  dụng dịch vụ hay ứng dụng của chúng tôi, xin đừng ngần ngại
                  liên hệ với chúng tôi ngay để được hỗ trợ kịp thời và giải
                  quyết các vấn đề đó. Bạn có thể liên hệ với chúng tôi qua:
                </Text>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Text style={{ color: "gray", fontSize: 15 }}>
                    Địa chỉ email:{" "}
                  </Text>
                  <Text>BeautyNEM@gmail.vn</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Text style={{ color: "gray", fontSize: 15 }}>
                    Số điện thoại:{" "}
                  </Text>
                  <Text>0987654321</Text>
                </View>
                <Text style={{ color: "gray", fontSize: 15, marginTop: 5 }}>
                  {"       "}
                  Chúng tôi luôn sẵn sàng lắng nghe và giải quyết mọi thắc mắc
                  của bạn, và mong muốn giữ vững sự hài lòng của khách hàng trên
                  hành trình phát triển và cung cấp các sản phẩm và dịch vụ tốt
                  nhất. Chân thành cảm ơn bạn đã tin tưởng và sử dụng dịch vụ
                  của chúng tôi.
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF9494",
                    width: 120,
                    height: 50,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setContact(!contact)}
                >
                  <Text style={{color: "white", fontSize: 20}}>Đồng ý</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <Text style={styles.text}>{props.name}</Text>
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => setContact(true)}
      >
        <Text style={{ color: "white" }}>Liên hệ</Text>
      </TouchableOpacity>
    </View>
  );
};

export const HeaderText = (props) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          width: "100%",
          color: "white",
          fontSize: 20,
          textAlign: "center",
          fontWeight: "bold",
          marginRight: "22%",
        }}
      >
        {props.name}
      </Text>
    </View>
  );
};

export const HeaderSearch = ({ navigation }) => {
  return (
    <View style={styles.HeaderSearch}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("HomeScreen");
        }}
        style={styles.btnSearch}
      >
        <Text style={styles.buttonText}>Đặt dịch vụ làm đẹp tại đây!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
