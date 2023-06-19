import { Button, SearchBar } from "@rneui/themed";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import SelectDropdown from "react-native-select-dropdown";
import { GetServices } from "../../../services/beauticianRegisterService";

const style = StyleSheet.create({
  container: { flex: 1 },
  containterSearch: {
    width: "80%",
    backgroundColor: "#F0F0F0",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 40,
  },
  input: {
    backgroundColor: "#FFF",
    color: "#000",
  },
  icon: {
    color: "#000",
    fontSize: 20,
  },
  filter: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginLeft: 5,
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
  selectDropdownButtonPrices: {
    width: "80%",
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
});

interface Sorting {
  id: number;
  title: string;
}

interface Service {
  id: number;
  item: string;
  isSelected: boolean;
}

const sortingList: Array<Sorting> = [
  { id: 1, title: "Ngày diễn ra mới nhất" },
  { id: 2, title: "Ngày diễn ra cũ nhất" },
  { id: 3, title: "Đánh giá cao nhất" },
  { id: 4, title: "Đánh giá thấp nhất" },
];

const SearchFilterSort = ({
  fetchData,
  request,
  keyword,
  setKeyword,
  services,
  setServices,
  serviceIds,
  setServiceIds,
  sortingId,
  setSortingId,
  setIsLoading,
  placeHolderText,
}) => {
  const timeOutRef = useRef(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEnableSroll, setIsEnableScroll] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const debounce = (fn: Function, ms: number) => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    timeOutRef.current = setTimeout(() => {
      fn();
    }, ms);
  };

  const onSelectService = (service: Service) => {
    const listServices: Array<Service> = services;
    listServices.map((x) => {
      if (x.id === service.id) {
        x.isSelected = !x.isSelected;
      }
    });
    setServices(listServices);
    setIsPress(!isPress);
    onChangeServiceIds();
  };

  const onChangeServiceIds = () => {
    if (services.length > 0) {
      var serviceIdsString = "";
      services.map((x) => {
        if (x.isSelected) {
          serviceIdsString += x.id + ";";
        }
      });
      setServiceIds(serviceIdsString.replace(/^\;+|\;+$/g, ""));
    }
  };

  const toggleModal = () => {
    if (isOpenModal) {
      setIsLoading(true);
      debounce(() => fetchData(request), 1000);
    }
    setIsOpenModal(!isOpenModal);
  };

  useEffect(() => {
    GetServices()
      .then((response) => {
        let listData: Array<Service> = response.data.map((obj) => ({
          ...obj,
          isSelected: false,
        }));
        setServices(listData);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 5,
        }}
      >
        <SearchBar
          placeholder={placeHolderText}
          placeholderTextColor="#A9A9A9"
          onChangeText={(value: any) => {
            setKeyword(value);
            setIsLoading(true);
            debounce(() => fetchData({ ...request, keyword: value }), 1000);
          }}
          value={keyword}
          containerStyle={style.containterSearch}
          inputContainerStyle={style.inputContainer}
          inputStyle={style.input}
          searchIcon={{ iconStyle: style.icon }}
        />
        <Button
          buttonStyle={style.filter}
          icon={
            <FontAwesome name="sliders" size={20} style={{ color: "#000" }} />
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
              <Text style={{ fontWeight: "bold" }}>Sắp xếp theo</Text>
              <View
                style={{
                  margin: 10,
                }}
              >
                <SelectDropdown
                  data={sortingList}
                  defaultValue={
                    sortingList.filter((x) => x.id === sortingId)[0]
                  }
                  onSelect={(selectedItem, index) => {
                    setSortingId(selectedItem.id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.title;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.title;
                  }}
                  defaultButtonText="Chọn sắp xếp"
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
    </View>
  );
};

export default SearchFilterSort;
