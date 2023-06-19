import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Image,
  ScrollView,
  LogBox,
  ActivityIndicator,
  Modal,
  FlatList
} from "react-native";
import { Avatar } from "react-native-paper";
import {
    GetBeautyShopDetailsWithToken,
    UpdateBeautyShop,
    UpdatePasswordBeautyShop,
    UpdateAvatarBeautyShop,
    GetProduct,
    GetListBeautyShopImageWithProductId
} 
from "../../../../services/BeautyShopProfileService"
import {
    GetCities,
    GetDistricts,
  } from "../../../../services/BeauticianProfileService";
import {
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  } from "@expo-google-fonts/dancing-script";
import { useFonts } from "expo-font";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign"
import SelectDropdown from "react-native-select-dropdown";
import * as ImagePicker from "expo-image-picker";

const styles = StyleSheet.create({
  avatarImg: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 50,
  },
  rowModal: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  rowTxt1: {
    width: 150,
    color: "gray",
    fontSize: 16,
    marginLeft: 5,
  },
  rowTxt2: {
    marginLeft: 20,
    color: "gray",
    fontSize: 16,
  },
  rowModalTxt1: {
    width: 150,
    color: "gray",
    fontSize: 16,
    marginLeft: 5,
  },
  rowModalTxt2: {
    marginLeft: 10,
    color: "gray",
    fontSize: 16,
  },
  btnUpdate: {
    height: 50,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF9494",
    borderRadius: 15,
  },
  btnConfirm: {
    height: 50,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32CD32",
    borderRadius: 15,
  },
  btnChangePassword: {
    height: 50,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF9494",
    borderRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    height: 400,
    width: "85%",
  },
  modalProductView:{
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
    height: 600,
    width: "90%",
  },
  txtInput: {
    fontSize: 16,
    width: 160,
    height: 30,
    margin: 12,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    color: "gray",
    textAlign: "center",
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
    height: 50,
    alignItems: "center",
    borderRadius: 10,
  },
  itemService: {
    marginLeft: 15,
    marginRight: 15,
    color: "gray",
    fontSize: 20,
    fontFamily: "DancingScript_700Bold",
  },
});

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

const BeautyShopProfileScreen = ({navigation}) => {
  const dataform = {
    id: "",
    storeName: "",
    username: "",
    phoneNumber: "",
    cityId: "",
    cityName: "",
    districtId: "",
    districtName: "",
    avatar: "",
  };
  const detailProduct = {
    id: "",
    productName: "",
    productDescription: "",
    price: "",
    shopId: "",
  }
  let [fontsLoaded, error] = useFonts({
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleChangePassword, setVisibleChangePassword] = useState(false);
  const [visibleDetailProduct, setVisibleDetailProduct] = useState(false);
  const [infoBeautyShopProfile, setInfo] = useState(dataform)
  const [StoreName, setStoreName] = useState("");
  const [cityList, setCityList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [districtName, setDistrictName] = useState("")
  const [districtId, setDistrictId] = useState()
  const [cityId, setCityId] = useState()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [product, setProduct] = useState([])
  const [DetailProduct, setDetailProduct] = useState(detailProduct)
  const [image, setImage] = useState([])
  const hideImgAvt = infoBeautyShopProfile.avatar === null
  const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;

  useEffect(() => {
    GetBeautyShopDetailsWithToken()
      .then((response) => {
        setInfo(response.data);
        setStoreName(response.data.storeName);
        setDistrictName(response.data.districtName);
        setDistrictId(response.data.districtId);
        setCityId(response.data.cityId);
        GetDistricts(response.data.cityId).then((res) => {
          setDistrictList(res.data);
        }).catch((error) => console.log(error));
        GetProduct(response.data.id).then((res) =>{
          setProduct(res.data)
        }).catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
    GetCities().then((response) => {
      setCityList(response.data);
    }).catch((error) => console.log(error));
    setTimeout(() => setIsLoading(false), 2000);
  }, [refreshing])

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  
  const handleUpdateAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.cancelled === false) {
      setIsLoading(true)
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
        formData.append("BeautyShopId", infoBeautyShopProfile.id)
        formData.append("avtImgFile", {
          uri,
          name: `image${date}.${ext}`,
          type,
        } as any);
        UpdateAvatarBeautyShop(formData)
          .then((result) => {
            Alert.alert("Cập nhật ảnh đại diện thành công!");
            setTimeout(() => setIsLoading(false), 2000);
            setRefreshing(true);
            wait(1000).then(() => setRefreshing(false));
          })
          .catch((err) => {
            Alert.alert(err.response.data);
          });
      }
    }
  }

  const HandleUpdateInfo = () =>{
    if(StoreName === ""){
      Alert.alert("Tên cửa hàng không được phép để trống!")
    }else if(StoreName.length >= 16){
      Alert.alert("Tên không được quá 16 kí tự!");
    }
    else{
        const formdata = new FormData();
        formdata.append("id", infoBeautyShopProfile.id)
        formdata.append("StoreName", StoreName)
        formdata.append("CityId", cityId)
        formdata.append("DistrictId", districtId)
        UpdateBeautyShop(formdata).then((response) => {
            Alert.alert("Cập nhật thành công");
            setVisibleUpdate(false);
        }).catch((err) => Alert.alert(err.response.data))
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }
  }
  
  const HandleChangePassword = () => {
    if(newPassword !== confirmPassword){
      Alert.alert("Nhập lại mật khẩu không đúng!")
    }
    else if(oldPassword.length === 0 || newPassword.length ===0 || confirmPassword.length === 0){
      Alert.alert("Mật khẩu không được để trống")
    }
    else if(newPassword.length < 6 || confirmPassword.length < 6){
      Alert.alert("Mật khẩu không được nhập ít hơn 6 kí tự!")
    }
    else if(oldPassword === newPassword){
      Alert.alert("Mật khẩu mới không được trùng với mật khẩu cũ!")
    }
    else{
      const formdata = new FormData();
      formdata.append("oldPassword", oldPassword);
      formdata.append("newPassword", newPassword);
      UpdatePasswordBeautyShop(formdata).then((res) => {
        Alert.alert("Cập nhật mật khẩu thành công!");
        setVisibleChangePassword(false)
        setNewPassword("")
        setOldPassword("")
        setConfirmPassword("")
      }).catch((err) => Alert.alert(err.response.data))
    }
  }

  if(isLoading){
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
        <ActivityIndicator size="large" color="#FF9494"/>
      </View>
    )
  }
  else{
    return (
      <ScrollView>
        {/* Modal của chỉnh sửa thông tin cửa hàng */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleUpdate}
          onRequestClose={() => {
            setVisibleUpdate(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  top: 5,
                  left: "43%",
                }}
                onPress={() => setVisibleUpdate(!visibleUpdate)}
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
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#FF9494",
                }}
              >
                Chỉnh sửa thông tin
              </Text>
              <View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowModalTxt1}>Tên cửa hàng:</Text>
                  <TextInput
                    style={styles.txtInput}
                    value={StoreName}
                    onChangeText={(value) => setStoreName(value)}
                  />
                </View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowModalTxt1}>Chọn Thành phố:</Text>
                  <SelectDropdown
                    data={cityList}
                    onSelect={(selectedItem, index) => {
                      setCityId(selectedItem.id);
                      GetDistricts(selectedItem.id)
                        .then((res) => {
                          setDistrictList(res.data);
                          setDistrictId(res.data[0].id);
                          setDistrictName(res.data[0].item);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.item;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.item;
                    }}
                    defaultButtonText={infoBeautyShopProfile.cityName}
                    buttonStyle={{
                      width: 160,
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
                      fontSize: 16,
                    }}
                    rowTextStyle={{
                      backgroundColor: "white",
                      color: "gray",
                      fontSize: 16,
                    }}
                  />
                </View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowModalTxt1}>Chọn Quận:</Text>
                  <SelectDropdown
                    data={districtList}
                    onSelect={(selectedItem, index) => {
                      setDistrictId(selectedItem.id);
                      setDistrictName(selectedItem.item);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.item;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.item;
                    }}
                    defaultButtonText={districtName}
                    buttonStyle={{
                      width: 160,
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
                      fontSize: 16,
                    }}
                    rowTextStyle={{
                      backgroundColor: "white",
                      color: "gray",
                      fontSize: 16,
                    }}
                  />
                </View>
                <View style={{ alignItems: "center", marginTop: 30 }}>
                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={HandleUpdateInfo}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Xác nhận
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal của đổi mật khẩu */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleChangePassword}
          onRequestClose={() => {
            setVisibleChangePassword(false);
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
                  setVisibleChangePassword(!visibleChangePassword);
                  setNewPassword("");
                  setOldPassword("");
                  setConfirmPassword("");
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
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#FF9494",
                }}
              >
                Thay đổi mật khẩu
              </Text>
              <View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowModalTxt1}>Mật khẩu cũ:</Text>
                  <TextInput
                    style={styles.txtInput}
                    secureTextEntry={true}
                    onChangeText={(value) => setOldPassword(value)}
                  />
                </View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowModalTxt1}>Mật khẩu mới:</Text>
                  <TextInput
                    style={styles.txtInput}
                    secureTextEntry={true}
                    onChangeText={(value) => setNewPassword(value)}
                  />
                </View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowModalTxt1}>Nhập lại mật khẩu:</Text>
                  <TextInput
                    style={styles.txtInput}
                    secureTextEntry={true}
                    onChangeText={(value) => setConfirmPassword(value)}
                  />
                </View>
                <View style={{ alignItems: "center", marginTop: 30 }}>
                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={HandleChangePassword}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Xác nhận
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/*Modal thông tin chi tiết sản phẩm*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleDetailProduct}
          onRequestClose={() => {
            setVisibleDetailProduct(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalProductView}>
              <TouchableOpacity
                style={{
                  top: 5,
                  left: "43%",
                }}
                onPress={() => {
                  setVisibleDetailProduct(!visibleDetailProduct);
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
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#FF9494",
                }}
              >
                Chi tiết sản phẩm
              </Text>
              <View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowTxt1}>Tên sản phẩm:</Text>
                  <Text style={styles.rowTxt2}>
                    {DetailProduct.productName}
                  </Text>
                </View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowTxt1}>Giá:</Text>
                  <Text style={styles.rowTxt2}>
                    {DetailProduct.price
                      .toString()
                      .replace(currencyRegex, "$1.")}{" "}
                    đ
                  </Text>
                </View>
                <View style={styles.rowModal}>
                  <Text style={styles.rowTxt1}>Mô tả:</Text>
                  <Text style={styles.rowTxt2}>
                    {DetailProduct.productDescription}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#FF9494",
                  marginTop: 50,
                }}
              >
                Hình ảnh sản phẩm
              </Text>
              <View>
              <FlatList
                data={image}
                numColumns={3}
                // horizontal={true}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        // flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        paddingVertical: 10,
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity>
                        <Image
                          source={{
                            uri: `https://res.cloudinary.com/dpwifnuax/image/upload/BeautyShop/ImageProduct/Id_${item.beautyShopId}/${item.image}`,
                          }}
                          style={{ width: 120, height: 120, borderRadius: 15 }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
            </View>
          </View>
        </Modal>

        {/* Thông tin chủ cửa hàng */}
        <View style={styles.avatarImg}>
          <TouchableOpacity onPress={handleUpdateAvatar}>
            {hideImgAvt ? (
              <View>
                <Image
                  style={{
                    marginTop: 20,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                  }}
                  source={{
                    uri: `https://res.cloudinary.com/dpwifnuax/image/upload/v1671019855/Beauty_N.E.M-1_qkwh3k.png`,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 15,
                    position: "absolute",
                    zIndex: 2,
                    top: "80%",
                    left: "75%",
                  }}
                >
                  <FontAwesome name="camera-retro" color={"gray"} size={20} />
                </View>
              </View>
            ) : (
              <View>
                <Image
                  style={{
                    marginTop: 20,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                  }}
                  source={{
                    uri: `https://res.cloudinary.com/dpwifnuax/image/upload/v1672830868/BeautyShop/Avatar/Id_${infoBeautyShopProfile.id}/${infoBeautyShopProfile.avatar}`,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 15,
                    position: "absolute",
                    zIndex: 2,
                    top: "80%",
                    left: "75%",
                  }}
                >
                  <FontAwesome name="camera-retro" color={"gray"} size={20} />
                </View>
              </View>
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Fontisto name="shopping-store" color={"gray"} size={15} />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 25,
                fontWeight: "bold",
                color: "#FF9494",
                fontFamily: "DancingScript_700Bold",
              }}
            >
              {infoBeautyShopProfile.storeName}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.row}>
            <FontAwesome name="user" size={20} />
            <Text style={styles.rowTxt1}>Tên đăng nhập:</Text>
            <Text style={styles.rowTxt2}>{infoBeautyShopProfile.username}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome name="phone" size={20} />
            <Text style={styles.rowTxt1}>Số điện thoại:</Text>
            <Text style={styles.rowTxt2}>
              {infoBeautyShopProfile.phoneNumber}
            </Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="location-arrow" size={15} />
            <Text style={styles.rowTxt1}>Địa chỉ:</Text>
            <Text style={styles.rowTxt2}>
              {infoBeautyShopProfile.districtName +
                ", " +
                infoBeautyShopProfile.cityName}
            </Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <TouchableOpacity
              style={styles.btnUpdate}
              onPress={() => setVisibleUpdate(true)}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Chỉnh sửa thông tin
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TouchableOpacity
              style={styles.btnChangePassword}
              onPress={() => setVisibleChangePassword(true)}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={{ marginTop: 20, marginLeft: 20 }}>
            <Text style={{ color: "gray", fontSize: 20, fontWeight: "bold" }}>
              Sản Phẩm
            </Text>
          </View>
          <View>
            <FlatList
              data={product}
              renderItem={({ item, index }) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setVisibleDetailProduct(true);
                      setDetailProduct(item);
                      GetListBeautyShopImageWithProductId(
                        infoBeautyShopProfile.id,
                        item.id
                      )
                        .then((res) => {
                          setImage(res.data);
                        })
                        .catch((err) => console.log(err));
                    }}
                  >
                    <View style={styles.listItemService}>
                      <Text style={styles.itemService}>{item.productName}</Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.itemService}>
                          {item.price === 0
                            ? "Chưa có giá"
                            : `${item.price
                                .toString()
                                .replace(currencyRegex, "$1.")} đ`}
                        </Text>
                        <AntDesign name="form" size={20} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default BeautyShopProfileScreen;