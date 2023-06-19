import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  LogBox,
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Alert
} from 'react-native';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { GetSkill,
         GetImageWithServiceId         
} from "../../../services/BeauticianDetailsService"
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20
  },
  listItemService: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FF9494",
    height: scale(50),
    alignItems: "center",
    borderRadius: 10,
  },
  itemService: {
    marginLeft: 15,
    marginRight: 15,
    color: "white",
    fontSize: scale(12),
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
    width: "100%",
  },
});


const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};


export default function ServiceBeauticianDetailsScreen(props) {

  const [refreshing, setRefreshing] = useState(false);
  const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const [beauticianService, setBeauticianService] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000000);
  const [firstValue, setFirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(50000);
  const [image, setImage] = useState([]);
  const hideService = beauticianService.map((data) => data.serviceName).length === 0;
  const SliderWidth = Dimensions.get('window').width + 50
  const ItemWidth = Math.round(SliderWidth * 0.8)
  const carouselRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [indexSelected, setIndexSelected] = useState(0);

  useEffect(() => {
    GetSkill(props.id)
      .then((response) => {
        setBeauticianService(response.data);
      })
      .catch((error) => console.log(error));
    setTimeout(() => setIsLoading(false), 1000);
  }, [refreshing])

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])

  const onTouchThumbnail = touched => {
    if (touched === indexSelected) return;
  
    carouselRef?.current?.snapToItem(touched);
  };

  const onValuesChangeSlider = (values) => {
    setFirstValue(values[0]);
    setSecondValue(values[1]);
    GetSkill(props.id)
      .then((response) => {
        let list = [];
        response.data.map((data) => {
          if (data.price >= values[0] && data.price <= values[1]) {
            list.push(data)
          }
          else if (data.price === null) {
            list.push()
          }
        })
        setBeauticianService(list)
      })
      .catch((error) => console.log(error));
  }

  const renderService = ({ item, index }) => {
    wait(500).then(() => setRefreshing(true));
    if(item.price===0){
      return (
        <TouchableOpacity disabled={true}>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#A9A9A9",
              height: scale(50),
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text style={styles.itemService}>{item.serviceName}</Text>
            <Text style={styles.itemService}>
              Dịch vụ này không khả dụng
            </Text>
          </View>
        </TouchableOpacity>
      );
    }if(item.time===null){
      return (
        <View>
          {item.discount === null ? (
            <TouchableOpacity style={{marginTop: 20}} onPress={() => handleImageService(item)}>
              <View style={styles.listItemService}>
                <Text style={styles.itemService}>{item.serviceName}</Text>
                <Text style={styles.itemService}>
                  {item.price.toString().replace(currencyRegex, "$1.")} đ
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{marginTop: 20}} onPress={() => handleImageService(item)}>
              <View style={{ alignItems: "flex-end", marginRight: 7 }}>
                <Text
                  style={{
                    backgroundColor: "pink",
                    width: 100,
                    height: 20,
                    color: "gray",
                    textAlign: "center",
                    borderTopRightRadius: 7,
                    borderTopLeftRadius: 7,
                  }}
                >
                  Giảm {item.discount} %
                </Text>
              </View>
              <View style={styles.listItemService}>
                <Text style={styles.itemService}>{item.serviceName}</Text>
                <View>
                  <Text
                    style={{
                      marginLeft: 15,
                      marginRight: 15,
                      color: "white",
                      textDecorationLine: "line-through",
                      fontSize: scale(12)
                    }}
                  >
                    {item.price.toString().replace(currencyRegex, "$1.")} đ
                  </Text>
                  <Text style={styles.itemService}>
                    {Math.floor(item.price - (item.price * (item.discount/100))).toString().replace(currencyRegex, "$1.")} đ
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    else{
      const [hours, minutes, seconds] = item.time.split(":"); // tách ra từng phần giờ, phút, giây
      const formattedTime = hours + " Giờ " + minutes + " Phút";
      return (
        <View>
          {item.discount === null ? (
            <TouchableOpacity style={{marginTop: 20}} onPress={() => handleImageService(item)}>
              <View style={styles.listItemService}>
                <Text style={styles.itemService}>{item.serviceName}({formattedTime})</Text>
                <Text style={styles.itemService}>
                  {item.price.toString().replace(currencyRegex, "$1.")} đ
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{marginTop: 20}} onPress={() => handleImageService(item)}>
              <View style={{ alignItems: "flex-end", marginRight: 7 }}>
                <Text
                  style={{
                    backgroundColor: "pink",
                    width: 100,
                    height: 20,
                    color: "gray",
                    textAlign: "center",
                    borderTopRightRadius: 7,
                    borderTopLeftRadius: 7,
                  }}
                >
                  Giảm {item.discount} %
                </Text>
              </View>
              <View style={styles.listItemService}>
                <Text style={styles.itemService}>{item.serviceName}({formattedTime})</Text>
                <View>
                  <Text
                    style={{
                      marginLeft: 15,
                      marginRight: 15,
                      color: "white",
                      textDecorationLine: "line-through",
                      fontSize: scale(12)
                    }}
                  >
                    {item.price.toString().replace(currencyRegex, "$1.")} đ
                  </Text>
                  <Text style={styles.itemService}>
                    {Math.floor(item.price - (item.price * (item.discount/100))).toString().replace(currencyRegex, "$1.")} đ
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  }

  const renderImageService = ({ item, index }) => {
    return (
      <Image
        key={item.id}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
        source={{
          uri: `https://res.cloudinary.com/dpwifnuax/image/upload/IMG/Beautician_${item.beauticianId}/${item.imageLink}`,
        }}
      />
    );
  }

  const handleImageService = (item) => {
    GetImageWithServiceId(props.id, item.serviceId)
      .then((response) => {
        setVisible(true);
        setImage(response.data);
      })
      .catch((error) => Alert.alert("Dịch vụ này hiện chưa có hình ảnh!"));
  }
  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",

        }}
      >
        <ActivityIndicator animating={true} size="large" color="#FF9494" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{
                top: 5,
                left: "43%",
              }}
              onPress={() => setVisible(!visible)}
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
                fontSize: scale(24),
                fontWeight: "bold",
                color: "#FF9494",
              }}
            >
              Hình ảnh dịch vụ
            </Text>
            <Carousel
              layout="default"
              data={image}
              sliderWidth={SliderWidth}
              itemWidth={ItemWidth}
              renderItem={renderImageService}
              keyExtractor={(item, index) => item.id}
              onSnapToItem={(index) => setIndexSelected(index)}
              ref={carouselRef}
            />
            <Pagination
              dotsLength={image.length}
              activeDotIndex={indexSelected}
              carouselRef={carouselRef}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: "orange",
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              tappableDots={true}
            />
          </View>
        </View>
      </Modal>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Dịch vụ</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "gray", width: 80 }}>
          {firstValue.toString().replace(currencyRegex, "$1.")} đ
        </Text>
        <MultiSlider
          values={[firstValue, secondValue]}
          min={min}
          max={max}
          step={50000}
          sliderLength={200}
          trackStyle={{ height: 3 }}
          markerStyle={{
            height: 25,
            width: 25,
            backgroundColor: "#FFF",
            borderWidth: 2,
            borderColor: "#C0C0C0",
          }}
          selectedStyle={{ backgroundColor: "#FF9494" }}
          onValuesChange={onValuesChangeSlider}
        />
        <Text
          style={{
            fontWeight: "bold",
            color: "gray",
            width: 80,
            marginLeft: 15,
          }}
        >
          {secondValue.toString().replace(currencyRegex, "$1.")} đ
        </Text>
      </View>
      <FlatList
        data={beauticianService}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
      />
      {hideService ? (
        <View
          style={{
            height: 300,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "gray", fontSize: scale(20) }}>
            Không tìm thấy dịch vụ.
          </Text>
        </View>
      ) : null}
    </View>
  );
};
