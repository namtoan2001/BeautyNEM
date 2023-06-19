import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { EthPrice, Title } from "./SubInfo";
import { COLORS, SIZES, FONTS } from "../constants";
import { GetRecruitingMakeupModelsDetailsWithId } from "../../../services/RecruitingMakeupModelsService";

const DetailsModelRecruitment = ({ data }) => {
  const [text, setText] = useState(data.description.slice(0, 100));
  const [readMore, setReadMore] = useState(false);
  const [beauticianName, setBeauticianName] = useState();

  useEffect(() => {
    GetRecruitingMakeupModelsDetailsWithId(data.id)
      .then((response) => {
        setBeauticianName(response.data.beauticianName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title
          title={data.name}
          subTitle={beauticianName}
          titleSize={SIZES.extraLarge}
          subTitleSize={SIZES.font}
        />
        <EthPrice price={data.price} />
      </View>

      <View style={{ marginVertical: SIZES.extraLarge * 1.5 }}>
        <Text
          style={{
            fontSize: SIZES.font,
            fontFamily: FONTS.semiBold,
            color: COLORS.primary,
          }}
        >
          Mô tả
        </Text>
        <View
          style={{
            marginTop: SIZES.base,
          }}
        >
          <Text
            style={{
              color: COLORS.secondary,
              fontSize: SIZES.small,
              fontFamily: FONTS.regular,
              lineHeight: SIZES.large,
            }}
          >
            {text}
            {!readMore && "..."}
            <Text
              style={{
                color: COLORS.primary,
                fontSize: SIZES.small,
                fontFamily: FONTS.semiBold,
              }}
              onPress={() => {
                if (!readMore) {
                  setText(data.description);
                  setReadMore(true);
                } else {
                  setText(data.description.slice(0, 100));
                  setReadMore(false);
                }
              }}
            >
              {readMore ? " Ẩn đi" : " Hiện thêm"}
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
};

export default DetailsModelRecruitment;
