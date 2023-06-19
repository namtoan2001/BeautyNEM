import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Header, SearchBar, Button } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {
  GetCities,
  GetDistricts,
  GetServices,
} from "../../../services/beauticianRegisterService";
import GridViewBeaucianList from "../components/GridViewBeaucianList";
import { SearchFilter } from "../../../services/searchingService";

const style = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
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
  selectDropdownButton: {
    backgroundColor: "#FF9494",
  },
  selectDropdownButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "right",
  },
  selectDropdownButtonPrices: {
    height: 40,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 5,
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  selectDropdownButtonTextPrices: {
    color: "#000",
    fontSize: 12,
    textAlign: "left",
  },
  modal: {
    backgroundColor: "#FFF",
    marginTop: 200,
    borderRadius: 10,
    justifyContent: "flex-start",
  },
  viewFilter: { paddingLeft: 30, paddingTop: 0, paddingBottom: 10 },
  serviceButton: {
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#A9A9A9",
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceButtonOnPress: {
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF9494",
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceTitle: {
    fontSize: 12,
    color: "#A9A9A9",
  },
  serviceTitleOnPress: {
    fontSize: 12,
    color: "#FF9494",
  },
  slider: {
    borderWidth: 2,
  },
  activityIndicator: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
  iconBack: {
    position: "absolute",
    top: 44,
    left: 14,
    // display: "flex",
    // justifyContent: "flex-start",
    // alignSelf: "flex-start",
  },
});

interface Beautician {
  id: number;
  fullName: string;
  skillName: string;
  cityName: string;
  districtName: string;
  starNumber: number;
  avatar: string;
}

interface SearchFilterObject {
  keyword: string;
  fromPrice: number;
  toPrice: number;
  serviceIds: string;
  cityId: number;
  districtId: number;
  starNumber: number;
}

interface Service {
  id: number;
  item: string;
  isSelected: boolean;
}

interface Star {
  id: number;
  title: string;
}

const votes: Array<Star> = [
  { id: 0, title: "Tất cả" },
  { id: 1, title: "Từ 1 sao" },
  { id: 2, title: "Từ 2 sao" },
  { id: 3, title: "Từ 3 sao" },
  { id: 4, title: "Từ 4 sao" },
  { id: 5, title: "5 sao" },
];

const beauticianList: Array<Beautician> = [
  {
    id: 0,
    fullName: "",
    skillName: "",
    cityName: "",
    districtName: "",
    starNumber: 0,
    avatar: "",
  },
];

const HomeScreen = ({ route, navigation }) => {
  const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10000000);
  const [firstValue, setFirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(1000000);
  const timeOutRef = useRef(null);
  const [isEnableSroll, setIsEnableScroll] = useState(true);
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState(1);
  const [districtId, setDistrictId] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceIds, setServiceIds] = useState("");
  const [starNumber, setStarNumber] = useState(0);
  const [beauticians, setBeauticians] = useState(beauticianList);
  const [count, setCount] = useState(0);

  const request: SearchFilterObject = {
    keyword: keyword,
    fromPrice: firstValue,
    toPrice: secondValue,
    serviceIds: serviceIds,
    cityId: cityId,
    districtId: districtId,
    starNumber: starNumber,
  };

  const chooseService: SearchFilterObject = {
    keyword: "",
    fromPrice: 0,
    toPrice: 1000000,
    serviceIds: route.params,
    cityId: 1,
    districtId: 0,
    starNumber: 0,
  };

  const debounce = (fn: Function, ms: number) => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    timeOutRef.current = setTimeout(() => {
      fn();
    }, ms);
  };

  const onResetFilter = () => {
    const resetData: SearchFilterObject = {
      keyword: "",
      fromPrice: 0,
      toPrice: 1000000,
      cityId: cityId,
      districtId: 0,
      serviceIds: "",
      starNumber: 0,
    };
    setIsLoadingPage(true);
    setKeyword("");
    setFirstValue(0);
    setSecondValue(1000000);
    setDistrictId(0);
    setServiceIds("");
    setStarNumber(0);
    const listServices: Array<Service> = services;
    listServices.map((x) => (x.isSelected = false));
    setServices(listServices);
    fetchBeaucianSearchFilter(resetData);
  };

  const toggleModal = () => {
    if (isOpenModal) {
      setIsLoading(true);
      debounce(() => fetchBeaucianSearchFilter(request), 1000);
    }
    setIsOpenModal(!isOpenModal);
  };

  const onChangeServiceIds = () => {
    if (services.length > 0) {
      var serviceIdsString = "";
      services.map((x) => {
        if (x.isSelected) {
          serviceIdsString += x.id + ";";
        }
      });
      console.log(serviceIdsString.replace(/^\;+|\;+$/g, ""));
      setServiceIds(serviceIdsString.replace(/^\;+|\;+$/g, ""));
    }
  };

  const onSelectService = (service: Service) => {
    // console.log(service);
    const listServices: Array<Service> = services;
    listServices.map((x) => {
      if (x.id === service.id) {
        x.isSelected = !x.isSelected;
      }
    });
    // console.log(!isPress);
    setServices(listServices);
    setIsPress(!isPress);
    onChangeServiceIds();
  };

  const onValuesChangeSlider = (values) => {
    setFirstValue(values[0]);
    setSecondValue(values[1]);
  };

  const fetchBeaucianSearchFilter = (request: SearchFilterObject) => {
    setIsLoading(true);
    SearchFilter(request)
      .then((response) => {
        setBeauticians(response.data);
        let _count = 0;
        response.data.map((x) => {
          if (x.id !== 0) {
            _count++;
          }
        });
        setCount(_count);
        setIsLoading(false);
        setIsLoadingPage(false);
      })
      .catch((error) => {
        Alert.alert(error.response.data);
        setIsLoading(false);
        setIsLoadingPage(false);
      });
  };

  useEffect(() => {
    setIsLoadingPage(true);
    if (route.params) {
      fetchBeaucianSearchFilter(chooseService);
    } else {
      fetchBeaucianSearchFilter(request);
    }
    // fetchBeaucianSearchFilter(request);
    GetCities()
      .then((response) => {
        setCities(response.data);
        setCityId(response.data[0].id);
      })
      .catch((error) => console.log(error));

    GetServices()
      .then((response) => {
        let listData: Array<Service> = response.data.map((obj) => ({
          ...obj,
          isSelected: false,
        }));
        setServices(listData);
        setTimeout(() => {
          setIsLoadingPage(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error.response.data);
        setTimeout(() => {
          setIsLoadingPage(false);
        }, 1000);
      });
  }, []);

  useEffect(() => {
    if (cityId !== 0) {
      GetDistricts(cityId)
        .then((response) => {
          setDistricts([{ id: 0, item: "Tất cả" }, ...response.data]);
        })
        .catch((error) => console.log(error));
    }
  }, [cityId]);

  return (
    <View style={style.container}>
      <Header
        centerComponent={{
          text: "Tìm kiếm",
          style: style.header,
        }}
        containerStyle={style.header}
      />
      {route.params ? (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={style.iconBack}
        >
          <Icons name="arrow-back" color="#FFF" size={24} />
        </TouchableOpacity>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FF9494",
          paddingLeft: 10,
          paddingRight: 5,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 18,
            fontWeight: "200",
          }}
        >
          Bạn đang ở khu vực
        </Text>
        <SelectDropdown
          data={cities}
          onSelect={(selectedItem, index) => {
            setIsLoadingPage(true);
            setDistricts([]);
            setCityId(selectedItem.id);
            setDistrictId(0);
            debounce(() => {
              fetchBeaucianSearchFilter({
                ...request,
                cityId: selectedItem.id,
                districtId: 0,
              });
            }, 500);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem.item;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item.item;
          }}
          defaultButtonText="Chọn khu vực"
          defaultValue={cities[0]}
          renderDropdownIcon={() => (
            <MaterialIcons name="keyboard-arrow-down" size={20} color="#FFF" />
          )}
          statusBarTranslucent={true}
          buttonStyle={style.selectDropdownButton}
          buttonTextStyle={style.selectDropdownButtonText}
        />
      </View>
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
          onChangeText={(value: any) => {
            setKeyword(value);
            setIsLoading(true);
            debounce(
              () => fetchBeaucianSearchFilter({ ...request, keyword: value }),
              1000
            );
          }}
          value={keyword}
          containerStyle={style.containterSearch}
          inputContainerStyle={style.inputContainer}
          inputStyle={style.input}
          searchIcon={{ iconStyle: style.icon }}
          showLoading={isLoading}
        />
        <Button
          buttonStyle={style.filter}
          icon={
            <MaterialCommunityIcons
              name="filter"
              size={20}
              style={{ color: "#989898" }}
            />
          }
          onPress={toggleModal}
        />
      </View>
      <View style={{}}>
        <Modal
          isVisible={isOpenModal}
          onSwipeComplete={toggleModal}
          style={style.modal}
        >
          <ScrollView stickyHeaderIndices={[0]} scrollEnabled={isEnableSroll}>
            <View style={{ alignItems: "flex-end" }}>
              <Button
                buttonStyle={style.filter}
                icon={
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#989898"
                  />
                }
                onPress={toggleModal}
              />
            </View>
            <View style={style.viewFilter}>
              <Text style={{ fontWeight: "bold" }}>Chọn dịch vụ</Text>
              <View
                style={{
                  margin: 10,
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {services.map((service, index) => (
                  <Button
                    key={index}
                    buttonStyle={
                      !service.isSelected
                        ? style.serviceButton
                        : style.serviceButtonOnPress
                    }
                    titleStyle={
                      !service.isSelected
                        ? style.serviceTitle
                        : style.serviceTitleOnPress
                    }
                    title={service.item}
                    type="outline"
                    onPress={() => onSelectService(service)}
                  />
                ))}
              </View>
            </View>
            <View style={style.viewFilter}>
              <Text style={{ fontWeight: "bold" }}>Chọn mức giá</Text>
              <View
                style={{
                  margin: 10,
                  padding: 10,
                  paddingBottom: 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingRight: 30,
                  }}
                >
                  <Text>
                    {firstValue.toString().replace(currencyRegex, "$1.")} đ
                  </Text>
                  <Text>
                    {secondValue.toString().replace(currencyRegex, "$1.")} đ
                  </Text>
                </View>
                <MultiSlider
                  values={[firstValue, secondValue]}
                  min={min}
                  max={max}
                  step={500000}
                  sliderLength={270}
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
                  onValuesChangeStart={() => setIsEnableScroll(false)}
                  onValuesChangeFinish={() => setIsEnableScroll(true)}
                />
              </View>
            </View>
            <View style={style.viewFilter}>
              <Text style={{ fontWeight: "bold" }}>Chọn quận huyện</Text>
              <View
                style={{
                  margin: 10,
                }}
              >
                <SelectDropdown
                  data={districts}
                  defaultValue={districts.filter((x) => x.id === districtId)[0]}
                  onSelect={(selectedItem, index) => {
                    setDistrictId(selectedItem.id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem.item;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item.item;
                  }}
                  defaultButtonText="Quận huyện"
                  renderDropdownIcon={() => (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color="#000"
                    />
                  )}
                  buttonStyle={style.selectDropdownButtonPrices}
                  buttonTextStyle={style.selectDropdownButtonTextPrices}
                />
              </View>
            </View>
            <View style={style.viewFilter}>
              <Text style={{ fontWeight: "bold" }}>Chọn đánh giá</Text>
              <View
                style={{
                  margin: 10,
                }}
              >
                <SelectDropdown
                  data={votes}
                  defaultValue={votes.filter((x) => x.id === starNumber)[0]}
                  onSelect={(selectedItem, index) =>
                    setStarNumber(selectedItem.id)
                  }
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem.title;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item.title;
                  }}
                  defaultButtonText="Đánh giá"
                  renderDropdownIcon={() => (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color="#000"
                    />
                  )}
                  buttonStyle={style.selectDropdownButtonPrices}
                  buttonTextStyle={style.selectDropdownButtonTextPrices}
                />
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
      <View style={{ flex: 1 }}>
        {isLoadingPage && (
          <ActivityIndicator
            style={style.activityIndicator}
            color="#FF9494"
            animating={isLoadingPage}
            size={50}
          />
        )}
        <GridViewBeaucianList
          beauticians={beauticians}
          count={count}
          navigation={navigation}
          onResetFilter={onResetFilter}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
