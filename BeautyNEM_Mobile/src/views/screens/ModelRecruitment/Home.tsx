import React, { useState, useEffect, useRef, RefObject } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  LogBox,
  ActivityIndicator,
} from "react-native";

import { Card, HomeHeader, FocusedStatusBar } from "../../components";
import { COLORS } from "../../constants";
import {
  GetRecruitingMakeupModelsList,
  SearchFilterRecruits,
} from "../../../../services/RecruitingMakeupModelsService";
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
    id: 1,
    price: 0,
    description: "",
    date: "",
    name: "",
    beauticianId: 0,
    beauticianName: "",
    imageUri: "",
  },
];

interface SearchFilterRecruits {
  Keyword: string;
  CityId: number;
  DistrictId: number;
}

type ScrollRefType = RefObject<ScrollView>;

const Home = ({ route, navigation }) => {
  const [data, setData] = useState(RecruitingMakeupModels);
  const [keyword, setKeyword] = useState("");
  const [cityID, setCityID] = useState(1);
  const [districtID, setDistrictID] = useState(0);
  const [load, setLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef: ScrollRefType = useRef<ScrollView>(null);

  const TopButtonHandler = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  useEffect(() => {
    GetRecruitingMakeupModelsList()
      .then((response) => {
        setData(response.data.reverse());
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [load, districtID === 0, route.params === true]);

  const request: SearchFilterRecruits = {
    Keyword: keyword,
    CityId: cityID,
    DistrictId: districtID,
  };

  const handleSearch = (value) => {
    setKeyword(value);
  };

  const handleSelectCityID = (city) => {
    setCityID(city.id);
  };

  const handleSelectDistrictID = (district) => {
    setDistrictID(district.id);
  };

  useEffect(() => {
    if (keyword === "" && cityID === 1 && districtID === 0) {
      setLoad(true);
    } else {
      console.log(request);
      SearchFilterRecruits(request).then((response) => {
        // console.log(response.data);
        GetRecruitingMakeupModelsList()
          .then((list) => {
            let filteredDatas = [];
            for (let i = 0; i < response.data.length; i++) {
              const filteredData = list.data.filter((item) => {
                if (response.data[i].id === item.id) {
                  filteredDatas.push(item);
                }
              });
            }
            // console.log(filteredDatas);
            if (filteredDatas.length === undefined) {
              setData(list.data);
            } else {
              setData(filteredDatas);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }, [keyword, cityID, districtID]);

  return (
    <>
      {isLoading && (
        <ActivityIndicator
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "#FFF",
            width: "100%",
            height: "100%",
          }}
          color="#FF9494"
          animating={isLoading}
          size={50}
        />
      )}
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader
          onSearch={handleSearch}
          selectCity={handleSelectCityID}
          selectDistrict={handleSelectDistrictID}
          navigation={navigation}
        />
        <ScrollView ref={scrollRef}>
          <FocusedStatusBar backgroundColor={COLORS.mainColor} />
          <View style={{ flex: 1 }}>
            <View style={{ zIndex: 0 }}>
              <FlatList
                data={data}
                renderItem={({ item }) => <Card data={item} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                // ListHeaderComponent={}
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
              <View
                style={{ height: 300, backgroundColor: COLORS.mainColor }}
              />
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
    </>
  );
};

export default Home;
