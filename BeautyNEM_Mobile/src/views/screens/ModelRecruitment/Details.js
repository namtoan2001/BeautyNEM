import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList,
  Alert,
  Dimensions,
  Animated,
  Text,
  StyleSheet,
} from "react-native";

import { assets, SIZES, SHADOWS } from "../../constants";
import {
  CircleButton,
  RectButton,
  SubInfo,
  DetailsModelRecruitment,
  FocusedStatusBar,
} from "../../components";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetListRecruitingMakeupModelsImage } from "../../../../services/RecruitingMakeupModelsService";

const width = Dimensions.get("window").width;
const scrollX = new Animated.Value(0);
let position = Animated.divide(scrollX, width);

const renderProduct = ({ item, index }) => (
  <View
    style={{
      width: width,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Image
      source={{
        uri: `https://res.cloudinary.com/dpwifnuax/image/upload/RecruitingMakeupModels/Image/Id_${item.recruitingMakeupModelsId}/${item.imageName}`,
      }}
      style={styles.image}
    />
  </View>
);

const DetailsHeader = ({ data, navigation, images }) => (
  <View style={{ width: "100%", height: 373 }}>
    <View style={{ width: "100%", height: "100%" }}>
      <FlatList
        data={images}
        horizontal
        renderItem={renderProduct}
        showsHorizontalScrollIndicator={false}
        decelerationRate={0.8}
        snapToInterval={width}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          marginTop: 20,
        }}
      >
        {images
          ? images.map((data, index) => {
              let opacity = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0.2, 1, 0.2],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={index}
                  style={{
                    width: "7%",
                    height: 2.4,
                    backgroundColor: "#000000",
                    opacity,
                    marginHorizontal: 4,
                    borderRadius: 100,
                  }}
                ></Animated.View>
              );
            })
          : null}
      </View>
    </View>

    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.goBack()}
      left={15}
      top={StatusBar.currentHeight + 10}
    />

    {/* <CircleButton
      imgUrl={assets.heart}
      right={15}
      top={StatusBar.currentHeight + 10}
    /> */}
  </View>
);

const Details = ({ route, navigation }) => {
  const { data, image } = route.params;

  const [images, setImages] = useState([]);
  useEffect(() => {
    GetListRecruitingMakeupModelsImage(data.id).then((response) => {
      setImages(response.data);
    });
  }, []);

  const { userToken, userRole, logout } = useContext(AuthContext);

  const booking = () => {
    if (userRole === "Customer") {
      let token = userToken;
      navigation.navigate("GetRecruitment", {
        beauticianId: data.beauticianId,
        description: data.description,
        name: data.name,
        id: data.id,
      });
    } else {
      if (userRole === "Beautician") {
        Alert.alert(
          "Thông báo",
          "Bạn phải đăng xuất và đăng nhập dưới tư cách khách hàng thì mới thực hiện được chức năng này",
          [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Đăng xuất và chuyển đến màn hình đăng nhập",
              onPress: () => {
                logout();
                props.navigation.navigate("CustomerLoginScreen");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Thông báo",
          "Bạn phải đăng nhập dưới tư cách khách hàng thì mới thực hiện được chức năng này",
          [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Chuyển đến màn hình đăng nhập",
              onPress: () => {
                props.navigation.navigate("CustomerLoginScreen");
              },
            },
          ]
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingVertical: SIZES.font,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5)",
          zIndex: 1,
        }}
      >
        <RectButton
          minWidth={170}
          fontSize={SIZES.large}
          {...SHADOWS.dark}
          handlePress={booking}
          buttonName="Đặt lịch"
        />
      </View>

      <FlatList
        data={[data]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SIZES.extraLarge * 3,
        }}
        ListHeaderComponent={() => (
          <React.Fragment>
            <DetailsHeader
              data={data}
              navigation={navigation}
              images={images}
            />
            <View style={{ padding: SIZES.font }}>
              <DetailsModelRecruitment data={data} />
            </View>
          </React.Fragment>
        )}
      />
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
});