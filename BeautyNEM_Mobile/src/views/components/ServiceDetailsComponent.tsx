import React, { useEffect, useState} from "react";
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
    Text
  } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { 
  GetImageWithServiceId,  
} from "../../../services/BeauticianDetailsService"
import {
  AddImgBeautician,
  DeleteImgBeautician,
  UpdateBeauticianService,
  HandleDiscount
} from "../../../services/BeauticianProfileService";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HeaderServiceDetails from "./HeaderServiceDetails";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginLeft: scale(10),
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
  },
  serviceName: {
    fontSize: scale(25),
    color: "#FF9494",
    fontWeight: "bold",
  },
  dropdownButton: {
    width: scale(60),
    height: scale(40),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: scale(15),
    color: "#444",
    textAlign: "center",
  },
  column1: {
    fontSize: scale(15),
    width: scale(120),
    fontWeight: "bold",
  },
  containerFlatList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    paddingVertical: 10,
    marginTop: 15,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  btnDelete: {
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 5,
    zIndex: 3,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2
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
    height: scale(250),
    width: scale(300),
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

const ServiceDetailsScreen = ({route}) => {
  const {item} = route.params;
  
  const [refreshing, setRefreshing] = useState(false);
  const [servicePrice, setServicePrice] = useState(0)
  const [serviceDiscount, setServiceDiscount] = useState(0)
  const [changeserviceDiscount, setChangeServiceDiscount] = useState(0)
  const [imageList, setImageList] = useState(null)
  const [BtnDeleteImage, setBtnDeleteImage] = useState(
    <Icon name="delete" color="white" size={25} />
  );
  const [showBtnDelete, setShowBtnDelete] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [modalAddDiscount, setModalAddDiscount] = useState(false);

  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(30);

  useEffect(() => {
    if(item.time !== null){
      setSelectedHour(Number(item.time.split(":")[0]));
      setSelectedMinute(Number(item.time.split(":")[1]));
    }
  }, [item.time]);

  useEffect(() => {
    if(item.price !== null){
      setServicePrice(item.price);
    }
  }, [item.price]);

  useEffect(() => {
    if(item.discount !== null){
      setServiceDiscount(item.discount);
      setChangeServiceDiscount(item.discount);
    }
  }, [item.discount]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString());

  useEffect(() => {
    GetImageWithServiceId(item.beauticianId, item.serviceId).then((res) => {
      setImageList(res.data)
      setTimeout(() => setIsLoadingImage(true), 1000);
    }).catch((err) => {
      console.log(err)
    })
  }, [refreshing])

  const footerImg = () => {
    return (
      <View style={{ alignItems: "center", marginTop: 30 }}>
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

  const addImage = async () => {
    if(imageList === null){
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
          console.log(item.beauticianId + "&&" + item.serviceId);
          formData.append("beauticianId", item.beauticianId);
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
    if (imageList.length >= 9) {
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
          console.log(item.beauticianId + "&&" + item.serviceId)
          formData.append("beauticianId", item.beauticianId);
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

  const ShowBtnDelete = () => {
    setShowBtnDelete(!showBtnDelete);
    if (showBtnDelete === true) {
      setBtnDeleteImage(<Icon name="delete" color="white" size={25} />);
    } else {
      setBtnDeleteImage(<Icon name="delete-off" color="white" size={25} />);
    }
  }

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

  const addDiscount = () => {
    if(Number(changeserviceDiscount) <= 0 || Number(changeserviceDiscount) > 99){
      Alert.alert("Chỉ có thể giảm giá từ 1% đến 99%!");
    }
    else if(changeserviceDiscount === null){
      Alert.alert("Không được phép để trống!");
    }
    else{
      const formData = new FormData();
      formData.append("BeauticianId", item.beauticianId);
      formData.append("ServiceId", item.serviceId);
      formData.append("Discount", changeserviceDiscount.toString())
      HandleDiscount(formData).then((res) => {
        Alert.alert("Thêm giảm giá thành công!");
      }).catch((err) => Alert.alert(err.response.data))
      setServiceDiscount(changeserviceDiscount)
      setModalAddDiscount(false);
      setRefreshing(true);
      wait(1000).then(() => setRefreshing(false));
    }
  }

  const handleDeleteDiscount = () =>{
    Alert.alert("Cảnh báo", "Bạn có chắc xóa giảm giá này không?", [
      { text: "Xác nhận", onPress: () => 
      {
        const formData = new FormData();
      formData.append("BeauticianId", item.beauticianId);
      formData.append("ServiceId", item.serviceId);
      formData.append("Discount", "");
      HandleDiscount(formData)
        .then((response) => {
          Alert.alert("Xóa giảm giá thành công!");
          setServiceDiscount(0)
        })
        .catch((error) => Alert.alert(error.response.data));
      setRefreshing(true);
      wait(1000).then(() => setRefreshing(false));

      }, style: "default" },
      { text: "Hủy bỏ" },
    ]);
  }

  const handleServicePriceChange = (number) => {
    const formattedNumber = number.replace(/\D/g, "");
    setServicePrice(Number(formattedNumber)); 
  }
  const handleServiceDiscount = (number) => {
    setChangeServiceDiscount(Number(number));
  }
  const success = () => {
    if(selectedHour === 0 && selectedMinute < 30){
      Alert.alert("Thời gian thực hiện dịch vụ ít nhất 30 phút!")
    }else{
      const formData = new FormData();
      formData.append("BeauticianId", item.beauticianId);
      formData.append("ServiceId", item.serviceId);
      formData.append("Price", servicePrice.toString());
      formData.append("Discount", serviceDiscount.toString());
      formData.append("Time", selectedHour + ":" +selectedMinute)
      UpdateBeauticianService(formData)
        .then((res) => {
          Alert.alert("cập nhật thành công!");
          setRefreshing(true);
          wait(2000).then(() => {
            setRefreshing(false);
          });
        })
        .catch((err) => console.log(err));
    }
  }
  
  return (
    <View style={styles.container}>
      <HeaderServiceDetails/>
      <View>
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
                  // setServiceDiscount(0)
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
                    fontSize: scale(15),
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
                  style={{ fontSize: scale(15), fontWeight: "bold", color: "#FF9494" }}
                >
                  Phần trăm giảm:
                </Text>
                <TextInput
                  style={{
                    fontSize: scale(15),
                    width: 100,
                    height: 30,
                    margin: 12,
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 5,
                    color: "gray",
                    textAlign: "center",
                  }}
                  value={changeserviceDiscount.toString()}
                  onChangeText={(number) => handleServiceDiscount(number)}
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
                    marginLeft: 15,
                  }}
                  onPress={addDiscount}
                >
                  <Text style={{ color: "white", fontSize: scale(15) }}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.serviceName}>Dịch vụ: </Text>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
        </View>
        <View>
          <View style={styles.row}>
            <Text style={styles.column1}>Giá: </Text>
            <TextInput
              style={{
                fontSize: scale(20),
                width: scale(150),
                height: scale(30),
                borderWidth: 1,
                borderColor: "red",
                borderRadius: 5,
                color: "gray",
                textAlign: "center",
                marginLeft: scale(10)
              }}
              value={servicePrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              onChangeText={handleServicePriceChange}
              keyboardType="number-pad"
            />
            <Text style={{ fontSize: scale(15), marginLeft: scale(5) }}>VND</Text>
          </View>
          <View>
            <View style={styles.row}>
              <Text style={styles.column1}>Giá sau khi được giảm:</Text>
              {serviceDiscount !== 0 ? (
                <Text style={{ fontSize: scale(15), color: "gray", marginLeft: scale(10) }}>
                  {Math.floor(servicePrice - (servicePrice * (serviceDiscount/100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND (Giảm {serviceDiscount}%)
                </Text>
              ) : (
                <Text style={{fontSize: scale(15), color: "gray",marginLeft: scale(10) }}>Chưa có giảm giá</Text>
              )}
            </View>
          </View>
          <View style={{ marginLeft: scale(150), marginTop: 15 }}>
            <TouchableOpacity onPress={() => setModalAddDiscount(true)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="edit"
                  size={20}
                  color="gray"
                ></MaterialIcons>
                <Text
                  style={{
                    fontSize: scale(15),
                    textDecorationLine: "underline",
                    color: "#00CED1",
                  }}
                >
                  Thêm giảm giá
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: scale(150), marginTop: 15 }}>
            <TouchableOpacity onPress={handleDeleteDiscount}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="delete"
                  size={20}
                  color="gray"
                ></MaterialIcons>
                <Text
                  style={{
                    fontSize: scale(15),
                    textDecorationLine: "underline",
                    color: "#ff0000",
                  }}
                >
                  Xóa giảm giá
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {item.time !== null ? (
            <View style={styles.row}>
              <Text style={styles.column1}>Thời gian làm dịch vụ: </Text>
              <SelectDropdown
                data={hours}
                defaultValue={Number(item.time.split(":")[0])}
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
              <Text style={{ fontSize: scale(15) }}> Giờ </Text>
              <SelectDropdown
                data={minutes}
                defaultValue={Number(item.time.split(":")[1])}
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
              <Text style={{ fontSize: scale(15) }}> Phút</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Text style={styles.column1}>Thời gian: </Text>
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
              <Text style={{ fontSize: scale(15) }}> Giờ </Text>
              <SelectDropdown
                data={minutes}
                defaultValue={30}
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
              <Text style={{ fontSize: scale(15) }}> Phút</Text>
            </View>
          )}
        </View>
        <View>
          <View style={{ marginTop: 60 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "gray",
                  fontSize: scale(20),
                  marginLeft: 20,
                }}
              >
                Hình ảnh
              </Text>
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
            <View>
              {imageList === null ? (
                <View
                  style={{
                    marginTop: 50,
                    height: 150,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "gray", fontSize: scale(15) }}>
                    Chưa có hình ảnh.
                  </Text>
                  <View style={{ alignItems: "center", marginTop: 30 }}>
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
                      <MaterialIcons
                        name="add-circle-outline"
                        size={30}
                        color="#F24976"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : isLoadingImage ? (
                <FlatList
                  data={imageList}
                  numColumns={3}
                  // horizontal={true}
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.containerFlatList}>
                        <TouchableOpacity>
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
                  ListFooterComponent={footerImg}
                  extraData={imageList}
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
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color="#FF9494"
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity
          onPress={success}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FF9494",
            height: 70,
          }}
        >
          <Text
            style={{
              fontSize: scale(20),
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Xác nhận thay đổi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default ServiceDetailsScreen;