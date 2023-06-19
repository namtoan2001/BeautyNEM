import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";

import { COLORS, SIZES, FONTS, SHADOWS, assets } from "../constants";
import { SubInfo, EthPrice } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { GetBeauticianDetailsWithToken } from "../../../services/BeauticianProfileService";
import {
  DeleteRecruitingMakeupModels,
  GetListRecruitingMakeupModelsImage,
} from "../../../services/RecruitingMakeupModelsService";

const dataForm = {
  beauticianId: "",
  beauticianName: "",
  date: "",
  description: "",
  id: "",
  imageUri: "",
  name: "",
  price: "",
};

const { width: screenWidth } = Dimensions.get("window");
const width = Dimensions.get("window").width;
const scrollX = new Animated.Value(0);
let position = Animated.divide(scrollX, width);

const Post = ({ data, params }) => {
  const navigation = useNavigation(dataForm);
  const [newData, setNewData] = useState([]);
  const [load, setLoad] = useState(false);
  const [images, setImages] = useState([]);
  console.log(params);
  const carouselRef = useRef(null);

  useEffect(() => {
    GetBeauticianDetailsWithToken()
      .then((repponse) => {
        let datas = [data].filter(
          (item, index) => item.beauticianId === repponse.data.id
        );
        let dataA = datas.map((items, index) => {
          setNewData(items);
          GetListRecruitingMakeupModelsImage(items.id)
            .then((response) => {
              setImages(response.data[0]);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        setLoad(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [load, newData]);

  const handleDelete = (id) => {
    Alert.alert("Thông báo", "Bạn có chắc muốn xóa bài đăng này?", [
      {
        text: "Hủy",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          DeleteRecruitingMakeupModels(id)
            .then((response) => {
              Alert.alert("Thông báo", "Xóa bài đăng thành công");
              setLoad(true);
            })
            .catch((err) => {
              // console.log(err);
              Alert.alert(err.response.data);
            });
        },
      },
    ]);
  };

  return (
    <>
      {newData.name !== undefined ? (
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: SIZES.font,
            marginBottom: SIZES.extraLarge,
            margin: SIZES.base,
            ...SHADOWS.dark,
          }}
        >
          <View
            style={{
              width: "100%",
              height: 250,
            }}
          >
            {images
              ? [images].map((item, index) => {
                  return (
                    <View style={styles.item}>
                      <Image
                        source={{
                          uri: `https://res.cloudinary.com/dpwifnuax/image/upload/v1670410310/RecruitingMakeupModels/Image/Id_${data.id}/${item.imageName}`,
                        }}
                        resizeMode="cover"
                        style={{
                          width: "100%",
                          height: "70%",
                          borderTopLeftRadius: SIZES.font,
                          borderTopRightRadius: SIZES.font,
                        }}
                      />
                    </View>
                  );
                })
              : null}

            <TouchableOpacity
              style={{
                right: 10,
                top: 10,
                width: 40,
                height: 40,
                backgroundColor: COLORS.white,
                position: "absolute",
                borderRadius: SIZES.extraLarge,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                handleDelete(newData.id);
              }}
            >
              <FontAwesome
                name="remove"
                style={{
                  top: -2,
                  left: 2,
                  width: 25,
                  height: 24,
                  color: "red",
                }}
                size={26}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "100%",
              padding: SIZES.font,
              paddingTop: Platform.OS === "ios" ? 30 : null,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: SIZES.large,
                color: COLORS.primary,
              }}
            >
              {newData.name}
            </Text>

            <View
              style={{
                marginTop: SIZES.font,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <EthPrice price={newData.price} />
              <RectButton
                minWidth={120}
                fontSize={SIZES.font}
                handlePress={() =>
                  navigation.navigate("EditPost", {
                    newData,
                  })
                }
                buttonName="Chỉnh sửa"
              />
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default Post;

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 16,
    height: screenWidth,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
});
