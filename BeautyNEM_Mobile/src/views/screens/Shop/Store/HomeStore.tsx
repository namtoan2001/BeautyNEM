import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Header, SearchBar, Button } from "@rneui/themed";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Ionicons";

import {
  GetBeautyShopDetailsWithToken,
  GetListBeautyShopImageWithToken,
} from "../../../../../services/beautyShopService";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const COLOURS = {
  white: "#ffffff",
  black: "#000000",
  green: "#00AC76",
  red: "#C04345",
  blue: "#0043F9",
  backgroundLight: "#F0F0F3",
  backgroundMedium: "#B9B9B9",
  backgroundDark: "#777777",
  light: "#F5F8FE",
  primary: "#487DD2",
  dark: "#04031D",
  transparent: "rgba(0, 0, 0, 0.3)",
};

const HomeStore = ({ navigation }) => {
  const navigations = useNavigation();
  let number = 1;

  const [products, setProducts] = useState([]);
  const [numberShop, setNumberShop] = useState(number);
  const [accessory, setAccessory] = useState([]);
  const [reLoad, setReLoad] = useState(false);

  useEffect(() => {
    GetBeautyShopDetailsWithToken()
      .then((respone) => {
        // GetProduct(respone.data.id)
        //   .then((product) => {
        //     setProducts(product.data);
        //     setNumberShop(product.data.length);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
        GetListBeautyShopImageWithToken().then((respone) => {
          console.log(respone);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // GetListBeautyShopImageWithToken().then((respone) => {
    //   // console.log(respone.data);
    // });
  }, [reLoad, products]);

  const handleDelete = (id, shopId) => {
    Alert.alert("Thông báo", "Bạn chắc muốn bỏ sản phẩm này?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          // DeleteShopProduct(id, shopId)
          //   .then((result) => {
          //     Alert.alert("Thông báo", "Xóa sản phẩm thành công");
          //     setReLoad(true);
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
        },
      },
    ]);
  };

  //get called on screen loads
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     // getDataFromDB();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  //get data from DB

  // const getDataFromDB = () => {
  //   let productList = [];
  //   let accessoryList = [];
  //   for (let index = 0; index < Items.length; index++) {
  //     if (Items[index].category == "product") {
  //       productList.push(Items[index]);
  //     } else if (Items[index].category == "accessory") {
  //       accessoryList.push(Items[index]);
  //     }
  //   }

  //   setProducts(productList);
  //   setAccessory(accessoryList);
  // };

  //create an product reusable card

  const ProductCard = ({ data }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductInfo", data)}
        style={{
          width: "48%",
          marginVertical: 14,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            backgroundColor: COLOURS.backgroundLight,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              handleDelete(data.id, data.shopId);
            }}
            style={{
              position: "absolute",
              top: 1,
              right: 1,
            }}
          >
            <MaterialCommunityIcons
              name="delete-forever"
              style={{
                fontSize: 22,
                color: "red",
                borderRadius: 10,
                borderColor: COLOURS.backgroundLight,
              }}
            />
          </TouchableOpacity>
          {data.isOff ? (
            <View
              style={{
                position: "absolute",
                width: "20%",
                height: "24%",
                backgroundColor: COLOURS.green,
                top: 0,
                left: 0,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Text
                style={{
                  fontSize: 12,
                  color: COLOURS.white,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                {data.offPercentage}%
              </Text> */}
            </View>
          ) : null}
          <Image
            source={data.productImage}
            style={{
              width: "80%",
              height: "80%",
              resizeMode: "contain",
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 14,
            color: COLOURS.black,
            fontWeight: "600",
            marginBottom: 2,
          }}
        >
          {data.productName}
        </Text>
        {data.category == "accessory" ? (
          data.isAvailable ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="circle"
                style={{
                  fontSize: 12,
                  marginRight: 6,
                  color: COLOURS.green,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: COLOURS.green,
                }}
              >
                Available
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="circle"
                style={{
                  fontSize: 12,
                  marginRight: 6,
                  color: COLOURS.red,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: COLOURS.red,
                }}
              >
                Unavailable
              </Text>
            </View>
          )
        ) : null}
        <Text
          style={{
            fontSize: 12,
          }}
        >
          {data.price}đ
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: COLOURS.white,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          centerComponent={{
            text: "Cửa hàng",
            style: styles.header,
          }}
          containerStyle={styles.header}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Tài khoản");
          }}
          style={styles.iconBack}
        >
          <Icons name="arrow-back" color="#FFF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CreateProduct");
          }}
          style={styles.add}
        >
          <MaterialIcons name="add-business" color="#FFF" size={24} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FF9494",
            paddingBottom: 5,
          }}
        >
          <SearchBar
            placeholder="Tìm kiếm..."
            placeholderTextColor="#FFF"
            // value={keyword}
            containerStyle={styles.containterSearch}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            searchIcon={{ iconStyle: styles.icon }}
            // showLoading={isLoading}
          />
          <Button
            buttonStyle={styles.filter}
            icon={
              <MaterialCommunityIcons
                name="filter"
                size={20}
                style={{ color: "#989898" }}
              />
            }
            // onPress={toggleModal}
          />
        </View>
        {/* <TouchableOpacity>
            <Entypo
              name="shopping-bag"
              style={{
                fontSize: 18,
                color: COLOURS.backgroundMedium,
                padding: 12,
                borderRadius: 10,
                backgroundColor: COLOURS.backgroundLight,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
            <MaterialCommunityIcons
              name="cart"
              style={{
                fontSize: 18,
                color: COLOURS.backgroundMedium,
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLOURS.backgroundLight,
              }}
            />
          </TouchableOpacity> */}

        <View
          style={{
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: COLOURS.black,
                  fontWeight: "500",
                  letterSpacing: 1,
                }}
              >
                Tất cả Sản phẩm
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.black,
                  fontWeight: "400",
                  opacity: 0.5,
                  marginLeft: 10,
                }}
              >
                {numberShop}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {products.map((data, index) => {
              return <ProductCard data={data} key={index} />;
            })}
          </View>
        </View>

        {/* <View
          style={{
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: COLOURS.black,
                  fontWeight: "500",
                  letterSpacing: 1,
                }}
              >
                Accessories
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.black,
                  fontWeight: "400",
                  opacity: 0.5,
                  marginLeft: 10,
                }}
              >
                78
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {accessory.map((data) => {
              return <ProductCard data={data} key={data.id} />;
            })}
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default HomeStore;

const styles = StyleSheet.create({
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
  add: { position: "absolute", top: 46, right: 16 },
  containterSearch: {
    width: "85%",
    backgroundColor: "#FF9494",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#f7b2b2",
    borderRadius: 10,
    height: 40,
  },
  input: {
    backgroundColor: "#f7b2b2",
    color: "#FFF",
  },
  icon: {
    color: "#FFF",
    fontSize: 20,
  },
  filter: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginLeft: 5,
  },
});
