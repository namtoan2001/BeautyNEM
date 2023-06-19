import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import React, { useState, useEffect, useRef, RefObject } from "react";
import { SliderBox } from "react-native-image-slider-box";
import AntDesign from "react-native-vector-icons/AntDesign";

import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  GetTitle,
  GetTitleImage,
  SortBeauticianByRating,
  SortBeauticianByDiscount,
  GetServiceList,
} from "../../../services/HomePageService";
import { GetImageWithServiceId } from "../../../services/BeauticianDetailsService";
import { GetRating } from "../../../services/reviewService";

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

const SPACING = 10;

const WIDTH = Dimensions.get("screen").width;

type ScrollRefType = RefObject<ScrollView>;

const IntroductionPageScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [titleHome, setTitleHome] = useState("");
  const [imgsHome, setImgsHome] = useState([]);
  const [beauticianRating, setBeauticianRating] = useState([]);
  const [beauticianDiscount, setBeauticianDiscount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef: ScrollRefType = useRef<ScrollView>(null);
  // const scrollRef = useRef();

  const TopButtonHandler = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchHomePage();
    }, [])
  );

  const fetchHomePage = () => {
    Promise.all([GetTitle(), GetTitleImage()])
      .then((responses) => {
        const titleResponse = responses[0];
        const imageResponse = responses[1];

        titleResponse.data.forEach((item) => {
          setTitleHome(item.titleName);
        });

        const newImagesHome = imageResponse.data.map(
          (img) =>
            `https://res.cloudinary.com/dpwifnuax/image/upload/TitleImage/${img.image}`
        );
        setImgsHome(newImagesHome);

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(true);
      });
    SortBeauticianByRating().then(async (response) => {
      const beauticianIds = response.data.map((item) => item.id);
      const ratingPromises = beauticianIds.map((id) => GetRating(id));
      const ratings = await Promise.all(ratingPromises);
      const newBeauticianRating = response.data.map((item, index) => {
        const ratingData = ratings[index].data;
        const ratingValues = ratingData.map((rating) => rating.rating);
        const ratingSum = ratingValues.reduce((acc, val) => acc + val, 0);
        const ratingAvg = ratingSum / ratingValues.length;
        return {
          ...item,
          starNumber: ratingAvg.toFixed(1),
        };
      });
      const sortedBeauticianRating = newBeauticianRating.sort(
        (a, b) => b.starNumber - a.starNumber
      );
      setBeauticianRating(sortedBeauticianRating);
      setIsLoading(false);
    });
    SortBeauticianByDiscount().then(async (response) => {
      const beauticianDiscountData = response.data;
      setBeauticianDiscount(beauticianDiscountData);

      const imagePromises = beauticianDiscountData.map((item) => {
        return GetImageWithServiceId(item.beauticianId, item.serviceId)
          .then((response) => {
            const imageData = response.data;
            return imageData.map((image) => {
              return {
                serviceId: item.serviceId,
                imageLink: image.imageLink,
              };
            });
          })
          .catch((error) => {
            console.log(error);
            return [];
          });
      });

      const imageResponses = await Promise.all(imagePromises);
      const imageMap = imageResponses.reduce((acc, val) => {
        val.forEach((image) => {
          acc[image.serviceId] = image.imageLink;
        });
        return acc;
      }, {});

      const newBeauticianDiscount = beauticianDiscountData.map((item) => {
        const imageLink = imageMap[item.serviceId] || "";
        return {
          ...item,
          imageLink: imageLink,
        };
      });

      setBeauticianDiscount(newBeauticianDiscount);
      setIsLoading(false);
    });
    GetServiceList().then((response) => {
      setServices(response.data);
      setIsLoading(false);
    });
  };

  const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;

  const DiscountService = ({ data }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("BeauticianDetails", { id: data.beauticianId })
        }
        style={{
          width: "48%",
          marginVertical: 14,
          marginLeft: 5,
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
            marginBottom: 4,
          }}
        >
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
              zIndex: 10,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: COLOURS.white,
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              {data.discount}%
            </Text>
          </View>
          <Image
            source={{
              uri: `https://res.cloudinary.com/dpwifnuax/image/upload/IMG/Beautician_${data.beauticianId}/${data.imageLink}`,
            }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
              resizeMode: "contain",
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: COLOURS.black,
            fontWeight: "600",
            marginBottom: 2,
          }}
        >
          {data.serviceName}
        </Text>
        <Text>{data.price.toString().replace(currencyRegex, "$1.")} đ</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {isLoading && (
        <ActivityIndicator
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "#FFF",
            width: "100%",
            height: "100%",
            // marginLeft: 10,
          }}
          color="#FF9494"
          animating={isLoading}
          size={50}
        />
      )}
      <ScrollView ref={scrollRef}>
        <View
          style={{
            backgroundColor: "#FFFBFC",
            paddingTop: 36,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",

              paddingTop: 10,
              paddingRight: 10,
              paddingLeft: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 4,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2.5,
                  fontWeight: "bold",
                  color: "#FF9494",
                }}
              >
                {titleHome}
                {/* Khám phá vũ trụ làm đẹp {"\n"}BeautyNEM nhé, {"\n"}Bạn mới! */}
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <SliderBox
                images={imgsHome}
                sliderBoxHeight={250}
                ImageComponentStyle={{
                  marginRight: 40,
                }}
                dotColor="#F7E3E0"
                inactiveDotColor="#90A4AE"
                paginationBoxVerticalPadding={20}
                autoplay
                circleLoop
              />
            </View>
            <ScrollView
              horizontal
              style={{ marginVertical: SPACING * 1 }}
              showsHorizontalScrollIndicator={false}
            >
              {services.map((data) => (
                <TouchableOpacity
                  key={data.id}
                  style={{
                    marginRight: 5 * 3,
                    padding: 10,
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate("HomeScreen", data.id)}
                >
                  <View style={{ width: SPACING * 3, height: SPACING * 3 }}>
                    <Image
                      source={{
                        uri: `https://res.cloudinary.com/dpwifnuax/image/upload/ServiceIcon/${data.icon}`,
                      }}
                      resizeMode="contain"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  <Text
                    style={{
                      textTransform: "uppercase",
                      fontSize: SPACING,
                      marginTop: SPACING,
                    }}
                  >
                    {data.serviceName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              marginTop: 20,
              paddingRight: 10,
              paddingLeft: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                paddingLeft: 4,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "bold",
                  color: COLOURS.dark,
                }}
              >
                Thợ nổi bật
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={WIDTH * 0.7}
              decelerationRate="fast"
              pagingEnabled
              style={{ marginVertical: SPACING * 2 }}
            >
              {beauticianRating.map((data, index) => (
                <TouchableOpacity
                  style={{
                    width: WIDTH * 0.7,
                    height: WIDTH * 0.9,
                    overflow: "hidden",
                    borderRadius: SPACING * 2,
                    marginRight: SPACING * 2,
                  }}
                  key={index}
                  onPress={() =>
                    navigation.navigate("BeauticianDetails", { id: data.id })
                  }
                >
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      height: "100%",
                      width: "100%",
                      backgroundColor: COLOURS.transparent,
                      justifyContent: "space-between",
                      padding: SPACING,
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignSelf: "flex-end",
                        marginRight: 4,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: COLOURS.white,
                          fontWeight: "500",
                          marginRight: 5,
                        }}
                      >
                        {data.starNumber}
                      </Text>
                      <FontAwesome name="star" size={18} color="orange" />
                    </View>
                    <Text
                      style={{
                        fontSize: SPACING * 2,
                        color: COLOURS.white,
                        fontWeight: "700",
                        marginLeft: 10,
                      }}
                    >
                      {data.fullName}
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: `https://res.cloudinary.com/dpwifnuax/image/upload/BeauticianAvatar/Id_${data.id}/${data.avatar}`,
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              marginTop: 20,
              paddingRight: 10,
              paddingLeft: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                paddingLeft: 4,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "bold",
                  color: COLOURS.dark,
                }}
              >
                Dịch vụ giảm giá
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: COLOURS.white,
              }}
            >
              <View
                style={{
                  padding: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    // justifyContent: "space-around",
                  }}
                >
                  {beauticianDiscount.map((data, index) => {
                    return <DiscountService data={data} key={index} />;
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          alignItems: "center",
          backgroundColor: "#cccc",
          borderRadius: 10,
          right: 30,
          bottom: 50,
          zIndex: 11,
        }}
        onPress={TopButtonHandler}
      >
        <AntDesign
          name="arrowup"
          style={{
            fontSize: 25,
            marginTop: 8,
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default IntroductionPageScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
