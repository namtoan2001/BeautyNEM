import React, { useState, useRef, useEffect, MutableRefObject } from "react";
import { 
    StyleSheet,
    Text, 
    View,
    Image,  
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator
  } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Icon } from "@rneui/themed";
import {GetBeauticianDetails, GetImage} from "../../../services/BeauticianDetailsService";
import {CustomerGetSchedule} from "../../../services/customerBookingSerivce";

const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginRight: 20
    },
    worktime: {
        marginTop: 15,
        flexDirection: 'row',
        color: 'gray'
    }
});

export default function InfoBeauticianDetailsScreen(props) {
  const data = [
    {
      phoneNumber: "",
    },
  ];
  const [beauticianDetails, setBeauticianDetails] = useState(data)
  const [image, setImage] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const hideImg = image.map((data) =>data.imageLink).length === 0;
  const [availableSchedule, setAvailableSchedule] = useState(null);

  useEffect(() => {
    GetBeauticianDetails(props.id)
      .then((response) => {
        setBeauticianDetails([
          {
            phoneNumber: response.data.phoneNumber,
          },
        ]);
      })
      .catch((error) => console.log(error));
    GetImage(props.id)
      .then((response) => {
        setImage(response.data);
      })
      .catch((error) => console.log(error));

    const currentDate = new Date();

    const day = currentDate.getDate(); 
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear(); 
      
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const chooseDate = day + "-" + month + "-" + year;

    CustomerGetSchedule(props.id, dayOfWeek, chooseDate).then((response) => {
      setAvailableSchedule(response.data);
      console.log(response.data);
    }).catch((err)=>{
      console.log(err.response.data)
    })
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const carouselRef = useRef(null);
  const flatListRef = useRef(null);
  const SliderWidth = Dimensions.get('window').width + 50
  const ItemWidth = Math.round(SliderWidth * 0.8)

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
        setIndexSelected(indexSelected);
        flatListRef?.current?.scrollToOffset({
            offset: indexSelected * 80,
            animated: true
          });
    };

  const onTouchThumbnail = touched => {
        if (touched === indexSelected) return;
      
        carouselRef?.current?.snapToItem(touched);
      };
  

  if(isLoading){
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
  else{
    return (
      <View style={styles.container}>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>Thông tin</Text>
        </View>
        {availableSchedule.length !== 0 ? (
          <View style={styles.worktime}>
            <Icon name="clock" type="feather" style={{ color: "gray" }} />
            <Text style={{ marginLeft: 7 }}>Giờ làm việc hôm nay: </Text>
            <FlatList
              data={availableSchedule}
              renderItem={({ item, index }) => (
                <Text>
                  {"  "}
                  {item.startTime.slice(0, -3)} - {item.endTime.slice(0, -3)}
                </Text>
              )}
            />
          </View>
        ) : (
          <View style={styles.worktime}>
            <Icon name="clock" type="feather" style={{ color: "gray" }} />
            <Text style={{ marginLeft: 7 }}>
              Hôm nay không có lịch làm việc!
            </Text>
          </View>
        )}
        <View style={styles.worktime}>
          <Icon name="phone" type="ant-design" />
          <Text style={{ marginLeft: 7 }}>
            {beauticianDetails.map((data) => data.phoneNumber)}
          </Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 15, marginTop: 20 }}>
            Hình ảnh
          </Text>
          {hideImg ? (
            <View
              style={{
                height: 300,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "gray", fontSize: 20 }}>
                Chưa có hình ảnh.
              </Text>
            </View>
          ) : null}
          <View
            style={{
              flex: 1 / 2,
              marginTop: 20,
              height: 250,
              alignItems: "center",
            }}
          >
            <Carousel
              layout="default"
              data={image}
              sliderWidth={SliderWidth}
              itemWidth={ItemWidth}
              onSnapToItem={(index) => onSelect(index)}
              renderItem={({ item, index }) => (
                <Image
                  key={index}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                  source={{
                    uri: `https://res.cloudinary.com/dpwifnuax/image/upload/IMG/Beautician_${item.beauticianId}/${item.imageLink}`,
                  }}
                />
              )}
              ref={carouselRef}
            />
          </View>
          <View>
            <Pagination
              inactiveDotColor="gray"
              dotColor={"#FF9494"}
              activeDotIndex={indexSelected}
              dotsLength={image.map((data) => data.imageLink).length}
              animatedDuration={150}
              inactiveDotScale={1}
            />
          </View>
          <FlatList
            ref={flatListRef}
            data={image}
            horizontal={true}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onTouchThumbnail(index)}
              >
                <Image
                  style={{
                    width: 80,
                    height: 100,
                    marginRight: 20,
                    borderRadius: 16,
                    marginBottom: 30,
                    borderWidth: index === indexSelected ? 4 : 0.75,
                    borderColor: index === indexSelected ? "#FF9494" : "white",
                  }}
                  source={{
                    uri: `https://res.cloudinary.com/dpwifnuax/image/upload/IMG/Beautician_${item.beauticianId}/${item.imageLink}`,
                  }}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
};
