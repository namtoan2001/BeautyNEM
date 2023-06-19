import React, { useEffect, useState, useCallback, useReducer } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Modal,
  LogBox,
  Pressable,
  TextInput,
  RefreshControl,
  Button,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Avatar, Title, Text } from "react-native-paper";
import { Header } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DropDownPicker from 'react-native-dropdown-picker';
import {
  GetBeauticianDetailsWithToken,
  GetImageWithToken,
  GetSkillWithToken,
  GetAvatarWithToken,
  DeleteImgBeautician,
  DeleteBeauticianService,
  AddImgBeautician,
  AddBeauticianService,
  UpdateBeauticianService,
  HandleDiscount,
  UpdateWorkingTime
} from "../../../../services/BeauticianProfileService";
import { GetServices } from "../../../../services/BeauticianProfileService";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import SelectDropdown from "react-native-select-dropdown";
import { useFonts } from "expo-font";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { ScaledSheet } from 'react-native-size-matters';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useFocusEffect } from '@react-navigation/native';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProfileScreen = ({ navigation }) => {
  const dataForm = {
    fullName: "",
    phoneNumber: "",
    city: "",
    district: "",
    birthDate: "",
  };
  const dataImg = {
    beauticianId: "",
    imageName: "",
    imageLink: "",
  };
  const dataAvatar = {
    beauticianId: "",
    avatarName: "",
    avatarUrl: "",
  };

  const [workingTime, setWorkingTime] = useState("")

  const [refreshing, setRefreshing] = useState(false);
  const [dataAccount, setDataAccount] = useState(dataForm);
  const [date, setDate] = useState("");
  const [image, setImage] = useState([dataImg]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [service, setService] = useState([]);
  const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceName, setServiceName] = useState();
  const [servicePrice, setServicePrice] = useState("");
  const [price, setPrice] = useState("");
  const [DiscountPrice, setDiscountPrice] = useState("");
  const [beauticianId, setBeauticianId] = useState();
  const [serviceId, setServiceId] = useState();
  const [modalAddService, setModalAddService] = useState(false);
  const [modalAddDiscount, setModalAddDiscount] = useState(false);
  const [modalAddWorkingTime, setModalAddWorkingTime] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [disableButton, setDisableButton] = useState(true);
  const [avatar, setAvatar] = useState(dataAvatar);
  const [showBtnDelete, setShowBtnDelete] = useState(false);
  const [BtnDeleteImage, setBtnDeleteImage] = useState(
    <Icon name="delete" color="white" size={25} />
  );
  const [showAction, setShowAction] = useState(false)
  const [btnHideAction, setBtnHideAction] = useState(
    <View style={{flexDirection: "row"}}>
      <Icon name="eye" color="white" size={20}></Icon>
      <Text style={{ color: "white" }}> Hiện thao tác</Text>
    </View>
  );

  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString());

  const hideImgAvt = avatar.avatarName === null;

  const hideImg = image.map((data) => data.imageLink).length === 0;

  const formik = useFormik({
    initialValues: { dataForm },
  });
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    GetBeauticianDetailsWithToken()
      .then((response) => {
        setBeauticianId(response.data.id);
        setDataAccount(response.data);
        formik.setFieldValue("fullName", response.data.fullName);
        formik.setFieldValue("phoneNumber", response.data.phoneNumber);
        formik.setFieldValue("city", response.data.city);
        formik.setFieldValue("district", response.data.district);
        const currentDate = response.data.birthDate;
        let tempDate = new Date(currentDate);
        let fDate =
          tempDate.getDate() +
          "/" +
          (tempDate.getMonth() + 1) +
          "/" +
          tempDate.getFullYear();
        formik.setFieldValue("birthDate", fDate);
        setDate(fDate);
      })
      .catch((error) => {
        console.log(`Không lấy được thông tin: ` + error);
      });
    GetImageWithToken()
      .then((response) => {
        setImage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    GetSkillWithToken()
      .then((response) => {
        setService(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    GetServices()
      .then((response) => {
        setServiceList(response.data);
      })
      .catch((error) => console.log(error));
    GetAvatarWithToken()
      .then((response) => {
        setAvatar(response.data);
      })
      .catch((error) => console.log(error));
    setTimeout(() => setIsLoading(true), 2000);
    setTimeout(() => setIsLoadingImage(true), 2000);
  }, [refreshing]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setRefreshing(!refreshing);
      });

      return unsubscribe;
    }, [refreshing])
  );

  const footerImg = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={addImage}
          style={{
            width: 120,
            height: 120,
            borderWidth: 1,
            borderRadius: 15,
            borderStyle: "dashed",
            borderColor: "#F24976",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 50,
          }}
        >
          <MaterialIcons name="add-circle-outline" size={30} color="#F24976" />
        </TouchableOpacity>
      </View>
    );
  };
  const footerService = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={openModalAddService}
          style={{
            marginTop: 20,
            width: 200,
            height: 50,
            borderWidth: 1,
            borderRadius: 15,
            borderStyle: "dashed",
            borderColor: "#F24976",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <MaterialIcons name="add-circle-outline" size={30} color="#F24976" />
          <Text style={{ color: "#F24976", fontSize: 20 }}>Thêm dịch vụ</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const openModalAddService = () => {
    setServicePrice("");
    setServiceId(null);
    setDisableButton(true);
    setModalAddService(!modalAddService);
    setRefreshing(false);
  };
  const addService = () => {
    if (servicePrice === "") {
      Alert.alert("Vui lòng nhập giá.");
    } else if (Number(servicePrice) <= 0) {
      Alert.alert("Giá dịch vụ không được phép thấp hơn 0 hoặc bằng 0.");
    }
    else {
      const formData = new FormData();
      formData.append("BeauticianId", beauticianId);
      formData.append("ServiceId", serviceId);
      formData.append("Price", servicePrice);
      AddBeauticianService(formData)
        .then((response) => {
          Alert.alert("Thêm dịch vụ thành công");
          setRefreshing(true);
          wait(1000).then(() => setRefreshing(false));
          setModalAddService(false);
        })
        .catch((error) => {
          Alert.alert(error.response.data);
        });
    }
  };
  const addDiscount = () => {
    if (Number(DiscountPrice) <= 0) {
      Alert.alert("Giá dịch vụ không được phép thấp hơn 0 hoặc bằng 0.");
    } else if (DiscountPrice === "") {
      Alert.alert("Giá dịch vụ không được để trống.");
    } else if (Number(price) <= Number(DiscountPrice)) {
      Alert.alert("Giá giảm giá không được lớn hơn giá dịch vụ!")
    } else {
      const formData = new FormData();
      formData.append("BeauticianId", beauticianId);
      formData.append("ServiceId", serviceId);
      formData.append("Discount", DiscountPrice);
      console.log(formData)
      HandleDiscount(formData)
        .then((response) => {
          Alert.alert("Thêm giảm giá thành công!");
          setBeauticianId(null);
          setServiceId(null);
          setDiscountPrice("");
        })
        .catch((error) => Alert.alert(error.response.data));
      setModalAddDiscount(false);
      setRefreshing(true);
      wait(1000).then(() => setRefreshing(false));
    }
  }
  const deleteDiscount = (item) => {
    const formData = new FormData();
      formData.append("BeauticianId", item.beauticianId);
      formData.append("ServiceId", item.serviceId);
      formData.append("Discount", "");
      console.log(formData);
      HandleDiscount(formData)
        .then((response) => {
          Alert.alert("Xóa giảm giá thành công!");
        })
        .catch((error) => Alert.alert(error.response.data));
      setRefreshing(true);
      wait(1000).then(() => setRefreshing(false));
  }
  const ShowBtnDelete = () => {
    setShowBtnDelete(!showBtnDelete);
    if (showBtnDelete === true) {
      setBtnDeleteImage(<Icon name="delete" color="white" size={25} />);
    } else {
      setBtnDeleteImage(<Icon name="delete-off" color="white" size={25} />);
    }
  };
  const ShowAction = () => {
    setShowAction(!showAction);
    if(showAction === true){
      setBtnHideAction(
        <View style={{ flexDirection: "row" }}>
          <Icon name="eye" color="white" size={20}></Icon>
          <Text style={{ color: "white" }}> Hiện thao tác</Text>
        </View>
      );
    }else{
      setBtnHideAction(
        <View style={{ flexDirection: "row" }}>
          <Icon name="eye-off" color="white" size={20}></Icon>
          <Text style={{ color: "white" }}> Ẩn thao tác</Text>
        </View>
      );
    }
  }
  const addImage = async (item) => {
    if (image.length >= 9) {
      Alert.alert("Chỉ có thể tải lên tối đa 9 ảnh.");
    } else {
      setRefreshing(false);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });
      if (result.cancelled === false) {
        if (result.fileSize >= 3145728) {
          Alert.alert("Hình ảnh không được lớn hơn 3MB.");
        } else {
          var today = new Date();
          var date = `${today.getSeconds()}${today.getMinutes()}${today.getHours()}${today.getDate()}${
            today.getMonth() + 1
          }${today.getFullYear()}`;
          const uri =
            Platform.OS === "android"
              ? result.uri
              : result.uri.replace("file://", "");
          const filename = result.uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename as string);
          const ext = match?.[1];
          const type = match ? `image/${match[1]}` : `image`;
          const formData = new FormData();
          formData.append("beauticianId", beauticianId);
          formData.append("serviceId", item.serviceId);
          formData.append("imgFile", {
            uri,
            name: `image${date}.${ext}`,
            type,
          } as any);
          setTimeout(() => setIsLoadingImage(false), 1000);
          AddImgBeautician(formData)
            .then((response) => {
              wait(2000).then(() => setRefreshing(true));
              Alert.alert("Thêm ảnh thành công");
            })
            .catch((error) => console.log(error));
          // Alert.alert(error.response.data));
        }
      }
    }
  };
  const deleteImage = (item) => {
    setRefreshing(false);
    Alert.alert("Cảnh báo", `Bạn có chắc xóa ảnh này không?`, [
      {
        text: "Xóa",
        onPress: () => {
          setTimeout(() => setIsLoadingImage(false), 1000);
          const x = Number(item.beauticianId);
          DeleteImgBeautician(item.beauticianId, item.imageLink)
            .then((response) => {
              setRefreshing(true);
              Alert.alert("Xóa thành công!");
            })
            .catch((error) => {
              Alert.alert(error);
              console.log(error);
            });
        },
      },
      { text: "Hủy bỏ", onPress: () => {} },
    ]);
  };
  const popup = (item) => {
    setModalVisible(true);
    setRefreshing(false);
    setServiceName(item.serviceName);
    setServicePrice(item.price);
    setBeauticianId(item.beauticianId);
    setServiceId(item.serviceId);
  };
  const changePrice = (number) => {
    setServicePrice(number);
  };
  const changeDiscountPrice = (number) => {
    setDiscountPrice(number);
  }
  const updateService = () => {
    if (Number(servicePrice) <= 0) {
      Alert.alert("Giá dịch vụ không được phép thấp hơn 0 hoặc bằng 0.");
    } else if (servicePrice === "") {
      Alert.alert("Giá dịch vụ không được để trống.");
    } else {
      const formData = new FormData();
      formData.append("BeauticianId", beauticianId);
      formData.append("ServiceId", serviceId);
      formData.append("Price", servicePrice);
      UpdateBeauticianService(formData);
      GetSkillWithToken()
        .then((response) => {
          setService(response.data);
          Alert.alert("Cập nhật dịch vụ thành công.");
        })
        .catch((error) => {
          Alert.alert(error.response.data);
        });
      setModalVisible(false);
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }
  };
  const deleteService = () => {
    if (service.map((data) => data.serviceName).length === 1) {
      Alert.alert("Cần có ít nhất 1 dịch vụ.");
    } else {
      Alert.alert("Cảnh báo", `Bạn có chắc xóa dịch vụ này không?`, [
        {
          text: "Xóa",
          onPress: () => {
            DeleteBeauticianService(beauticianId, serviceId);
            setModalVisible(false);
            Alert.alert("Xóa thành công!");
            setRefreshing(true);
            wait(2000).then(() => setRefreshing(false));
          },
        },
        {
          text: "Hủy bỏ",
          onPress: () => {},
        },
      ]);
    }
  };
  const handleWorkingTime = () => {
    if(selectedHour === 0 && selectedMinute < 30){
      Alert.alert("Thời gian không được phép bé hơn 30 phút!")
    }else{
      const formdata = new FormData();
      formdata.append("BeauticianId", beauticianId);
      formdata.append("ServiceId", serviceId);
      // formdata.append("Time", time.toString().substr(16, 5));
      formdata.append("Time",selectedHour + ":" + selectedMinute);
      UpdateWorkingTime(formdata)
        .then((res) => {
          Alert.alert("cập nhật thành công!");
          setModalAddWorkingTime(false);
          setRefreshing(true);
          wait(2000).then(() => {
            setRefreshing(false);
          });
        })
        .catch((err) => console.log(err));
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  top: 5,
                  left: "43%",
                }}
                onPress={() => setModalVisible(!modalVisible)}
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
                  CHỈNH SỬA DỊCH VỤ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#FF9494" }}
                >
                  Tên dịch vụ:
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: "gray",
                    width: 150,
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {serviceName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#FF9494" }}
                >
                  Giá dịch vụ:
                </Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    width: 120,
                    height: 30,
                    margin: 12,
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 5,
                    color: "gray",
                    textAlign: "center",
                  }}
                  value={servicePrice}
                  onChangeText={changePrice}
                  keyboardType="number-pad"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3ae862",
                    height: 50,
                    width: 120,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    marginLeft: 15,
                  }}
                  onPress={updateService}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Xác nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF4500",
                    height: 50,
                    width: 90,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    marginLeft: 15,
                  }}
                  onPress={deleteService}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAddService}
          onRequestClose={() => {
            setModalAddService(!modalAddService);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  top: 5,
                  left: "43%",
                }}
                onPress={() => setModalAddService(!modalAddService)}
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
                  THÊM DỊCH VỤ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#FF9494" }}
                >
                  Tên dịch vụ:
                </Text>
                <SelectDropdown
                  data={serviceList}
                  onSelect={(selectedItem, index) => {
                    setServiceId(selectedItem.id);
                    setDisableButton(false);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    setServiceId(selectedItem.id);
                    return selectedItem.item;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.item;
                  }}
                  defaultButtonText="Chọn dịch vụ"
                  buttonStyle={{
                    width: 150,
                    height: 30,
                    margin: 12,
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 5,
                    backgroundColor: "white",
                  }}
                  rowStyle={{
                    borderBottomColor: "gray",
                    backgroundColor: "white",
                  }}
                  buttonTextStyle={{
                    color: "gray",
                    fontSize: 20,
                  }}
                  rowTextStyle={{
                    backgroundColor: "white",
                    color: "gray",
                    fontSize: 20,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#FF9494" }}
                >
                  Giá dịch vụ:
                </Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    width: 150,
                    height: 30,
                    margin: 12,
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 5,
                    color: "gray",
                    textAlign: "center",
                  }}
                  placeholder="Nhập giá"
                  placeholderTextColor="#E6E6FA"
                  onChangeText={changePrice}
                  keyboardType="number-pad"
                  value={servicePrice}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3ae862",
                    height: 50,
                    width: 120,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 15,
                  }}
                  onPress={addService}
                  disabled={disableButton}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAddDiscount}
          onRequestClose={() => {
            setModalAddDiscount(!modalAddDiscount);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  top: 5,
                  left: "43%",
                }}
                onPress={() => {
                  setModalAddDiscount(!modalAddDiscount);
                  setBeauticianId(null);
                  setServiceId(null);
                  setDiscountPrice("");
                }}
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
                  THÊM GIẢM GIÁ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#FF9494" }}
                >
                  Giá giảm giá:
                </Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    width: 150,
                    height: 30,
                    margin: 12,
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 5,
                    color: "gray",
                    textAlign: "center",
                  }}
                  placeholder="Nhập giá"
                  placeholderTextColor="#E6E6FA"
                  onChangeText={changeDiscountPrice}
                  keyboardType="number-pad"
                  value={DiscountPrice}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3ae862",
                    height: 50,
                    width: 120,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 15,
                  }}
                  onPress={addDiscount}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAddWorkingTime}
          onRequestClose={() => {
            setModalAddWorkingTime(!modalAddWorkingTime);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  top: 5,
                  left: "43%",
                }}
                onPress={() => {
                  setModalAddWorkingTime(!modalAddWorkingTime);
                  setBeauticianId(null);
                  setServiceId(null);
                  setDiscountPrice("");
                }}
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
                  Chỉnh sửa thời gian làm việc:
                </Text>
              </View>
              <TouchableOpacity>
                {workingTime === null ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 40,
                    }}
                  >
                    <SelectDropdown
                      data={hours}
                      defaultValue={0}
                      onSelect={(index, value) => setSelectedHour(value)}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={styles.dropdownButton}
                      buttonTextStyle={styles.dropdownButtonText}
                    />
                    <Text style={{ fontSize: 20 }}> Giờ </Text>
                    <SelectDropdown
                      data={minutes}
                      defaultValue={0}
                      onSelect={(index, value) => setSelectedMinute(value)}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={styles.dropdownButton}
                      buttonTextStyle={styles.dropdownButtonText}
                    />
                    <Text style={{ fontSize: 20 }}> Phút </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 40,
                    }}
                  >
                    <SelectDropdown
                      data={hours}
                      defaultValue={Number(workingTime.split(':')[0])}
                      onSelect={(index, value) => setSelectedHour(value)}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={styles.dropdownButton}
                      buttonTextStyle={styles.dropdownButtonText}
                    />
                    <Text style={{ fontSize: 20 }}> Giờ </Text>
                    <SelectDropdown
                      data={minutes}
                      defaultValue={Number(workingTime.split(':')[1])}
                      onSelect={(index, value) => setSelectedMinute(value)}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={styles.dropdownButton}
                      buttonTextStyle={styles.dropdownButtonText}
                    />
                    <Text style={{ fontSize: 20 }}> Phút </Text>
                  </View>
                )}
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3ae862",
                    height: 50,
                    width: 120,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 15,
                  }}
                  onPress={handleWorkingTime}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.context}>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            {hideImgAvt ? (
              <Avatar.Image
                source={{
                  uri: `https://res.cloudinary.com/dpwifnuax/image/upload/v1671019855/Beauty_N.E.M-1_qkwh3k.png`,
                }}
              />
            ) : (
              <Avatar.Image
                source={{
                  uri: `https://res.cloudinary.com/dpwifnuax/image/upload/BeauticianAvatar/Id_${avatar.beauticianId}/${avatar.avatarName}`,
                }}
              />
            )}
            <View style={{ marginLeft: 20 }}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 15,
                    marginBottom: 5,
                  },
                ]}
              >
                {dataAccount.fullName}
              </Title>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="phone" color="#FF9494" size={20} />
            <Text style={{ color: "#777777", marginLeft: 16 }}>
              {dataAccount.phoneNumber}
            </Text>
          </View>
          <View style={styles.row}>
            <Icons name="location" color="#FF9494" size={20} />
            <Text style={{ color: "#777777", marginLeft: 16 }}>
              {dataAccount.city}
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="date-range" color="#FF9494" size={20} />
            <Text style={{ color: "#777777", marginLeft: 16 }}>{date}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("EditProfileScreen");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PersonalPost");
          }}
          style={styles.button}
        >
          {/* <Icon name="post-outline" color="#FFF" size={24} /> */}
          <Text style={styles.buttonText}>Bài đăng tuyển mẫu</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text style={styles.titleSP}>Dịch vụ</Text>
          {/* <TouchableOpacity
            style={{
              backgroundColor: "pink",
              borderRadius: 15,
              justifyContent: "center",
              width: 120,
              marginRight: 20,
              height: 30,
              alignItems: "center",
            }}
            onPress={ShowAction}
          >
            {btnHideAction}
          </TouchableOpacity> */}
        </View>
        {isLoading ? (
          <FlatList
            data={service}
            renderItem={({ item, index }) => {
              if(item.time === null){
                return (
                  <View>
                    {item.discount === null ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("ServiceDetailsComponent", {item: item});
                          }}
                        >
                          <View style={styles.listItemService}>
                            <Text style={styles.itemService}>
                              {item.serviceName}
                            </Text>
                            <Text style={styles.itemService}>
                              {item.price === 0
                                ? "Chưa có giá"
                                : `${item.price
                                    .toString()
                                    .replace(currencyRegex, "$1.")} đ`}
                            </Text>
                          </View>
                          {item.price === 0 ? (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icons name="warning" color="red" />
                              <Text style={{ color: "red" }}>
                                Chú ý: Những dịch vụ chưa có giá sẽ không được
                                hiển thị.
                              </Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity
                          style={{ marginTop: 20 }}
                          onPress={() => navigation.navigate("ServiceDetailsComponent", {item: item})}
                        >
                          <View
                            style={{ alignItems: "flex-end", marginRight: 20 }}
                          >
                            <Text
                              style={{
                                backgroundColor: "pink",
                                width: 100,
                                height: 20,
                                color: "gray",
                                textAlign: "center",
                                borderRadius: 5,
                              }}
                            >
                              Giảm{" "}
                              {item.discount}{" "}
                              %
                            </Text>
                          </View>
                          <View style={styles.listItemService1}>
                            <Text style={styles.itemService}>
                              {item.serviceName}
                            </Text>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 15,
                                  marginRight: 15,
                                  color: "gray",
                                  fontSize: scale(15),
                                  textDecorationLine: "line-through",
                                }}
                              >
                                {item.price === 0
                                  ? "Chưa có giá"
                                  : `${item.price
                                      .toString()
                                      .replace(currencyRegex, "$1.")} đ`}
                              </Text>
                              <Text style={styles.itemService}>
                                {item.price === 0
                                  ? "Chưa có giá"
                                  : `${item.discount
                                      .toString()
                                      .replace(currencyRegex, "$1.")} đ`}
                              </Text>
                            </View>
                          </View>
                          {item.price === 0 ? (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icons name="warning" color="red" />
                              <Text style={{ color: "red" }}>
                                Chú ý: Những dịch vụ chưa có giá sẽ không được
                                hiển thị.
                              </Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    )}

                    {showAction === true ? (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#92B9E3",
                              height: 30,
                              width: 170,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomLeftRadius: 15,
                            }}
                            onPress={() => navigation.navigate("ServiceDetailsComponent", {item: item})}
                          >
                            <Text style={{ color: "white" }}>
                              Chỉnh sửa dịch vụ
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#FFC4A4",
                              height: 30,
                              width: 170,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomRightRadius: 15,
                            }}
                            onPress={() => addImage(item)}
                          >
                            <Text style={{ color: "white" }}>
                              Thêm ảnh cho dịch vụ
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#FBA2D0",
                              height: 30,
                              width: 135,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomLeftRadius: 15,
                            }}
                            onPress={() => {
                              setModalAddDiscount(true);
                              setBeauticianId(item.beauticianId);
                              setServiceId(item.serviceId);
                              setPrice(item.price);
                            }}
                          >
                            <Text style={{ color: "white" }}>
                              Thêm giảm giá
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#C688EB",
                              height: 30,
                              width: 135,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomRightRadius: 15,
                            }}
                            onPress={() => deleteDiscount(item)}
                          >
                            <Text style={{ color: "white" }}>Xóa giảm giá</Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#C747BB",
                              height: 30,
                              width: 185,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomRightRadius: 15,
                              borderBottomLeftRadius: 15,
                            }}
                            onPress={() => {
                              setModalAddWorkingTime(true);
                              setBeauticianId(item.beauticianId);
                              setServiceId(item.serviceId);
                              setWorkingTime(item.time);
                            }}
                          >
                            <Text style={{ color: "white" }}>
                              Chỉnh thời gian làm việc
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}
                  </View>
                );
              }else{
                const [hours, minutes, seconds] = item.time.split(":"); // tách ra từng phần giờ, phút, giây
                const formattedTime = hours + " Giờ " + minutes + " Phút";
                return (
                  <View>
                    {item.discount === null ? (
                      <View>
                        <TouchableOpacity onPress={() => navigation.navigate("ServiceDetailsComponent", {item: item})}>
                          <View style={styles.listItemService}>
                            <Text style={styles.itemService}>
                              {item.serviceName} ({formattedTime})
                            </Text>
                            <Text style={styles.itemService}>
                              {item.price === 0
                                ? "Chưa có giá"
                                : `${item.price
                                    .toString()
                                    .replace(currencyRegex, "$1.")} đ`}
                            </Text>
                          </View>
                          {item.price === 0 ? (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icons name="warning" color="red" />
                              <Text style={{ color: "red" }}>
                                Chú ý: Những dịch vụ chưa có giá sẽ không được
                                hiển thị.
                              </Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity
                          style={{ marginTop: 20 }}
                          onPress={() => navigation.navigate("ServiceDetailsComponent", {item: item})}
                        >
                          <View
                            style={{ alignItems: "flex-end", marginRight: 20 }}
                          >
                            <Text
                              style={{
                                backgroundColor: "pink",
                                width: 100,
                                height: 20,
                                color: "gray",
                                textAlign: "center",
                                borderRadius: 5,
                              }}
                            >
                              Giảm{" "}
                              {item.discount}{" "}
                              %
                            </Text>
                          </View>
                          <View style={styles.listItemService1}>
                            <Text style={styles.itemService}>
                              {item.serviceName} ({formattedTime})
                            </Text>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 15,
                                  marginRight: 15,
                                  color: "gray",
                                  fontSize: scale(15),
                                  textDecorationLine: "line-through",
                                }}
                              >
                                {item.price === 0
                                  ? "Chưa có giá"
                                  : `${item.price
                                      .toString()
                                      .replace(currencyRegex, "$1.")} đ`}
                              </Text>
                              <Text style={styles.itemService}>
                                {item.price === 0
                                  ? "Chưa có giá"
                                  : `${Math.floor(item.price - (item.price * (item.discount/100)))
                                      .toString()
                                      .replace(currencyRegex, "$1.")} đ`}
                              </Text>
                            </View>
                          </View>
                          {item.price === 0 ? (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icons name="warning" color="red" />
                              <Text style={{ color: "red" }}>
                                Chú ý: Những dịch vụ chưa có giá sẽ không được
                                hiển thị.
                              </Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    )}

                    {showAction === true ? (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#92B9E3",
                              height: 30,
                              width: 170,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomLeftRadius: 15,
                            }}
                            onPress={() => navigation.navigate("ServiceDetailsComponent", {item: item})}
                          >
                            <Text style={{ color: "white" }}>
                              Chỉnh sửa dịch vụ
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#FFC4A4",
                              height: 30,
                              width: 170,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomRightRadius: 15,
                            }}
                            onPress={() => addImage(item)}
                          >
                            <Text style={{ color: "white" }}>
                              Thêm ảnh cho dịch vụ
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#FBA2D0",
                              height: 30,
                              width: 135,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomLeftRadius: 15,
                            }}
                            onPress={() => {
                              setModalAddDiscount(true);
                              setBeauticianId(item.beauticianId);
                              setServiceId(item.serviceId);
                              setPrice(item.price);
                            }}
                          >
                            <Text style={{ color: "white" }}>
                              Thêm giảm giá
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#C688EB",
                              height: 30,
                              width: 135,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomRightRadius: 15,
                            }}
                            onPress={() => deleteDiscount(item)}
                          >
                            <Text style={{ color: "white" }}>Xóa giảm giá</Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#C747BB",
                              height: 30,
                              width: 185,
                              alignItems: "center",
                              justifyContent: "center",
                              borderBottomRightRadius: 15,
                              borderBottomLeftRadius: 15,
                            }}
                            onPress={() => {
                              setModalAddWorkingTime(true);
                              setBeauticianId(item.beauticianId);
                              setServiceId(item.serviceId);
                              setWorkingTime(item.time);
                            }}
                          >
                            <Text style={{ color: "white" }}>
                              Chỉnh thời gian làm việc
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}

                    {/* <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "pink",
                      height: 30,
                      width: 135,
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomLeftRadius: 15,
                      borderBottomRightRadius: 15,
                    }}
                    onPress={ShowAction}
                  >
                    {btnHideAction}
                  </TouchableOpacity>
                </View> */}
                  </View>
                );
              }
            }}
            keyExtractor={(item) => item.id}
            extraData={service}
            ListFooterComponent={footerService}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "50%",
            }}
          >
            <ActivityIndicator animating={true} size="large" color="#FF9494" />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.titleSP}>Hình ảnh sản phẩm</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#FF9494",
              borderRadius: 10,
              marginTop: 20,
              marginRight: 20,
              height: 40,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={ShowBtnDelete}
          >
            {BtnDeleteImage}
          </TouchableOpacity>
        </View>
        {hideImg ? (
          <View
            style={{
              height: 150,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "gray", fontSize: 20 }}>
              Chưa có hình ảnh.
            </Text>
          </View>
        ) : null}
        {isLoadingImage ? (
          <FlatList
            data={image}
            numColumns={3}
            // horizontal={true}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item }) => {
              return (
                <View style={styles.containerFlatList}>
                  <TouchableOpacity
                    onLongPress={() => deleteImage(item)}
                    delayLongPress={500}
                  >
                    <Image
                      source={{
                        uri: `https://res.cloudinary.com/dpwifnuax/image/upload/IMG/Beautician_${item.beauticianId}/${item.imageLink}`,
                      }}
                      style={styles.headerImage}
                    />
                  </TouchableOpacity>
                  {showBtnDelete ? (
                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => deleteImage(item)}
                    >
                      <Icon name="delete" color="white" size={25} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            }}
            // ListFooterComponent={footerImg}
            extraData={image}
            // refreshing={refreshing}
            // onRefresh={onRefresh}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator animating={true} size="large" color="#FF9494" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = ScaledSheet.create({
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
    position: "relative",
  },
  iconBack: {
    position: "absolute",
    top: 46,
    left: 8,
  },
  context: {
    flex: 2,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#FF9494",
    padding: 12,
    borderRadius: 10,
    marginLeft: 26,
    marginRight: 26,
    marginBottom: 25,
  },
  buttonT: {
    // display: "inline-block",
    alignItems: "center",
    backgroundColor: "#FF9494",
    padding: 12,
    borderRadius: 10,
    marginLeft: 26,
    marginRight: 26,
    marginBottom: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  titleSP: {
    fontSize: 20,
    color: "gray",
    fontWeight: "800",
    marginLeft: 18,
    // marginTop: 20,
  },
  hairline: {
    borderWidth: 0,
    borderColor: "AD40AF",
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  containerFlatList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: scale(8),
    paddingVertical: 10,
    marginTop: 15,
  },
  btnDelete: {
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 5,
    zIndex: 3,
  },
  listItemService1: {
    borderWidth: 2,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    border: 10,
    borderColor: "#FF9494",
    height: scale(50),
    alignItems: "center",
    borderRadius: 10,
  },
  listItemService: {
    borderWidth: 2,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    border: 10,
    borderColor: "#FF9494",
    height: scale(50),
    alignItems: "center",
    borderRadius: 10,
  },
  itemService: {
    marginLeft: scale(15),
    marginRight: scale(15),
    color: "gray",
    fontSize: scale(15),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 40,
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
    height: 300,
    width: 350,
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
  add: { position: "absolute", top: 46, right: 20 },
  dropdownButton: {
    width: 60,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
});
