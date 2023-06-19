import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    Image,
    FlatList,
    StyleSheet,
    Alert,
    LogBox
} from 'react-native';
import {
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,

} from '@expo-google-fonts/dancing-script';
import { useFonts } from 'expo-font';
import FooterCustomerChooseServicesScreen from "../../components/FooterCustomerChooseService"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
    GetCustomerProfile,
} from "../../../../services/customerProfileService";
import moment from "moment";
import { GetSkill } from "../../../../services/BeauticianDetailsService";
import { ActivityIndicator } from 'react-native-paper';
import { Card } from 'react-native-paper';
import { Button } from "@rneui/themed";
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    flex: 1,
  },
  viewcontainer: {
    marginTop: 10,
    alignItems: "center",
    margin: "auto",
  },
  list: {
    flex: 1,
    padding: 8,
  },
  item: {
    flexDirection: "row",
    marginTop: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadownRadius: 4,
  },

  wrapText: {
    flex: 1,
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
  },
  serviceButtonOnPress: {
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF9494",
    margin: 5,
    padding: 5,
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
  items: {
    width: "50%",
  },
});

interface Service {
    id: number;
    name: string;
    price: number;
    time: Date,
    isSelected: boolean;
}

const CustomerChooseServicesScreen = ({ navigation, route }) => {


    let [fontsLoaded, error] = useFonts({
        DancingScript_400Regular,
        DancingScript_500Medium,
        DancingScript_600SemiBold,
        DancingScript_700Bold,
    });

    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const beauticianID = route.params.beauticianID;
    const [serviceIds, setServiceIds] = useState("");
    const [serviceIdsNoPrice, setServiceIdsNoPrice] = useState("");
    const [isPress, setIsPress] = useState(false);
    const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;


    useEffect(() => {
        GetSkill(beauticianID.beauticianID).then((response) => {
            setServices(response.data)
            
        })
            .catch((error) => console.log(error))
        setTimeout(() => setIsLoading(false), 1000);

    }, [])

    const onSelectService = (item: Service) => {
        const listServices: Array<Service> = services;
        listServices.map((x) => {
            if (x.id === item.id) {
                x.isSelected = !x.isSelected;
            }
        });
        setServices(listServices);
        setIsPress(!isPress);
        onChangeServiceIds();
    }

    const onChangeServiceIds = () => {
        if (services.length > 0) {
            var serviceIdsString = "";
            var serviceIdsNoPrice ="";
            services.map((x) => {
                if (x.isSelected) {
                    serviceIdsString += x.id + ";";
                    serviceIdsNoPrice += x.serviceId + ";";
                }
            });
            setServiceIds(serviceIdsString.replace(/^\;+|\;+$/g, ""));
            setServiceIdsNoPrice(serviceIdsNoPrice.replace(/^\;+|\;+$/g, ""));
            console.log(serviceIds);
        }
    };

    useEffect(() => {

        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    }, []);


    if (!fontsLoaded) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    return (
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              {services.every(({ price }) => price === 0) ? (
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "gray",
                      paddingBottom: 5,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Thợ làm đẹp hiện tại chưa cập nhật dịch vụ làm đẹp.
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "gray",
                      paddingBottom: 5,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Xin bạn vui lòng lựa chọn thợ làm đẹp khác!
                  </Text>
                </View>
              ) : (
                services.map((service, index) =>
                  service.price !== 0 ? (
                    service.discount !== null ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: "95%",
                          paddingLeft: 15,
                        }}
                        key={service.id}
                      >
                        <View style={styles.items}>
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <Button
                              key={index}
                              buttonStyle={
                                !service.isSelected
                                  ? styles.serviceButton
                                  : styles.serviceButtonOnPress
                              }
                              titleStyle={
                                !service.isSelected
                                  ? styles.serviceTitle
                                  : styles.serviceTitleOnPress
                              }
                              title="+"
                              type="outline"
                              onPress={() => onSelectService(service)}
                            />
                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 15,
                                color: "black",
                                marginBottom: 5,
                                fontWeight: "bold",
                                paddingTop: 10,
                              }}
                            >
                              {service.serviceName}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.items}>
                          <Text
                            style={{
                              alignItems: "center",
                              fontSize: 15,
                              color: "#FF9494",
                              marginBottom: 5,
                              fontWeight: "bold",
                              alignSelf: "flex-end",
                              paddingTop: 10,
                              textDecorationLine: "line-through",
                            }}
                          >
                            {service.price
                              .toString()
                              .replace(currencyRegex, "$1.")}{" "}
                            đ
                          </Text>
                          <Text
                            style={{
                              alignItems: "center",
                              fontSize: 15,
                              color: "#FF9494",
                              marginBottom: 5,
                              fontWeight: "bold",
                              alignSelf: "flex-end",
                              paddingTop: 10,
                            }}
                          >
                            {Math.floor(
                              service.price - (service.price * (service.discount / 100))
                            )
                              .toString()
                              .replace(currencyRegex, "$1.")}{" "}
                            đ
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              alignItems: "center",
                              fontSize: 15,
                              color: "gray",
                              marginBottom: 5,
                              fontWeight: "bold",
                              alignSelf: "flex-end",
                              paddingTop: 10,
                            }}
                          >
                            Thời gian: {service.time}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: "95%",
                          paddingLeft: 15,
                          justifyContent: "space-between",
                        }}
                        key={service.id}
                      >
                        <View style={styles.items}>
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <Button
                              key={index}
                              buttonStyle={
                                !service.isSelected
                                  ? styles.serviceButton
                                  : styles.serviceButtonOnPress
                              }
                              titleStyle={
                                !service.isSelected
                                  ? styles.serviceTitle
                                  : styles.serviceTitleOnPress
                              }
                              title="+"
                              type="outline"
                              onPress={() => onSelectService(service)}
                            />
                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 15,
                                color: "black",
                                marginBottom: 5,
                                fontWeight: "bold",
                                paddingTop: 10,
                              }}
                            >
                              {service.serviceName}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.items}>
                          <Text
                            style={{
                              alignItems: "center",
                              fontSize: 15,
                              color: "#FF9494",
                              marginBottom: 5,
                              fontWeight: "bold",
                              alignSelf: "flex-end",
                              paddingTop: 10,
                            }}
                          >
                            {service.price
                              .toString()
                              .replace(currencyRegex, "$1.")}{" "}
                            đ
                          </Text>
                        </View>
                        {service.time === null ? (
                          <View style={{ justifyContent: "flex-end" }}>
                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 15,
                                color: "gray",
                                marginBottom: 5,
                                fontWeight: "bold",
                                alignSelf: "flex-end",
                                paddingTop: 10,
                              }}
                            >
                              Thời gian: 00:30:00
                            </Text>
                          </View>
                        ) : (
                          <View style={{ justifyContent: "flex-end" }}>
                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 15,
                                color: "gray",
                                marginBottom: 5,
                                fontWeight: "bold",
                                alignSelf: "flex-end",
                                paddingTop: 10,
                              }}
                            >
                              Thời gian: {service.time}
                            </Text>
                          </View>
                        )}
                      </View>
                    )
                  ) : null
                )
              )}
            </View>
          </ScrollView>
        )}
        <FooterCustomerChooseServicesScreen
          navigation={navigation}
          serviceIds={serviceIds}
          serviceIdsNoPrice={serviceIdsNoPrice}
          id={beauticianID.beauticianID}
        />
      </SafeAreaView>
    );
};
export default CustomerChooseServicesScreen
