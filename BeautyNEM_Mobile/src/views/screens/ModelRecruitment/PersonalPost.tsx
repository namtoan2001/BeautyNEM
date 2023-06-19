import React, { useState, useEffect, useRef, RefObject } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Post, PostHeader, FocusedStatusBar } from "../../components";
import { COLORS } from "../../constants";
import { GetRecruitingMakeupModelsList } from "../../../../services/RecruitingMakeupModelsService";
import AntDesign from "react-native-vector-icons/AntDesign";

interface RecruitingMakeupModel {
  id: number;
  price: number;
  description: string;
  date: string;
  name: string;
  beauticianId: number;
  beauticianName: string;
  imageUri: string;
}

const RecruitingMakeupModels: Array<RecruitingMakeupModel> = [
  {
    id: 0,
    price: 0,
    description: "",
    date: "",
    name: "",
    beauticianId: 0,
    beauticianName: "",
    imageUri: "",
  },
];

type ScrollRefType = RefObject<ScrollView>;

const PersonalPost = ({ route, navigation }) => {
  const [data, setData] = useState(RecruitingMakeupModels);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef: ScrollRefType = useRef<ScrollView>(null);

  // console.log(route.params);

  const TopButtonHandler = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: 0,
        animated: true,
      });
    }
  };
  // useEffect(() => {
  //   GetRecruitingMakeupModelsList()
  //     .then((response) => {
  //       setData(response.data.reverse());
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [data, route.params === true]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchPersonalPost();
    }, [])
  );

  const fetchPersonalPost = () => {
    GetRecruitingMakeupModelsList()
      .then((response) => {
        setData(response.data.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = (value) => {
    if (value.length === 0) {
      GetRecruitingMakeupModelsList()
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredData.length === 0) {
      setData(data);
    } else {
      setData(filteredData);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <FocusedStatusBar backgroundColor={COLORS.mainColor} />
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 0 }}>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Post data={item} params={route.params} />
              )}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <PostHeader onSearch={handleSearch} navigation={navigation} />
              }
            />
          </View>

          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              zIndex: -1,
            }}
          >
            <View style={{ height: 300, backgroundColor: COLORS.mainColor }} />
            <View style={{ flex: 1, backgroundColor: COLORS.white }} />
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

export default PersonalPost;
