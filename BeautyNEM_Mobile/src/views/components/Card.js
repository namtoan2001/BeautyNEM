import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  Platform,
} from "react-native";

import { COLORS, SIZES, FONTS, SHADOWS, assets } from "../constants";
import { EthPrice } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";
import { GetListRecruitingMakeupModelsImage } from "../../../services/RecruitingMakeupModelsService";

const { width: screenWidth } = Dimensions.get("window");
const width = Dimensions.get("window").width;
const scrollX = new Animated.Value(0);
let position = Animated.divide(scrollX, width);

const Card = ({ data }) => {
  const [images, setImages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    GetListRecruitingMakeupModelsImage(data.id)
      .then((response) => {
        setImages(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  return (
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
          position: "relative",
        }}
      >
        {images
          ? [images].map((item, index) => {
              return (
                <View style={styles.item}>
                  <Image
                    source={{
                      uri: `https://res.cloudinary.com/dpwifnuax/image/upload/RecruitingMakeupModels/Image/Id_${item.recruitingMakeupModelsId}/${item.imageName}`,
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

        {/* <CircleButton imgUrl={assets.heart} right={10} top={10} /> */}
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
          {data.name}
        </Text>

        <View
          style={{
            marginTop: SIZES.font,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <EthPrice price={data.price} />
          <RectButton
            minWidth={120}
            fontSize={SIZES.font}
            handlePress={() =>
              navigation.navigate("ModelRecruitmentDetails", {
                data,
                images,
              })
            }
            buttonName="Chi tiết"
          />
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 16,
    height: screenWidth,
  },
});
