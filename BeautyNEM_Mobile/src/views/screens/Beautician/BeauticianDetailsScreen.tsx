import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  LogBox,
} from "react-native";
import { DataTable } from "react-native-paper";
import { Icon } from "@rneui/themed";
import FooterBeauticianDetailsScreen from "../../components/FooterBeauticianDetailsScreen";
import InfoBeauticianDetailsScreen from "../../components/InfoBeauticianDetailsScreen";
import ServiceBeauticianDetailsScreen from "../../components/ServiceBeauticianDetailsScreen";
import RateBeauticianDetailsScreen from "../../components/RateBeauticianDetailsScreen";
import { GetBeauticianDetails } from "../../../../services/BeauticianDetailsService";
import { GetCustomerProfile } from "../../../../services/customerProfileService";
import {
  GetFavoriteList,
  AddBeauticianToFavorite,
} from "../../../../services/FavoriteService";
import { renderNode } from "@rneui/base";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
    position: "relative",
  },

  infoBeautician: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  table: {
    marginTop: 20,
    borderBottomWidth: 0.1,
  },
});

const BeauticianDetailsScreen = ({ navigation, route, props }) => {
  const data = [
    {
      fullName: "",
      address: "",
      phoneNumber: "",
    },
  ];
  const [colorInfo, setColorInfo] = useState("#FF9494");
  const [colorService, setColorService] = useState("gray");
  const [colorRate, setColorRate] = useState("gray");
  const [showInfo, setShowInfo] = useState(true);
  const [showService, setShowService] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [beauticianDetails, setBeauticianDetails] = useState(data);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetBeauticianDetails(route.params.id)
      .then((response) => {
        setBeauticianDetails([
          {
            fullName: response.data.fullName,
            address: `${response.data.district}, ${response.data.city}`,
            phoneNumber: response.data.phoneNumber,
          },
        ]);
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch((error) => console.log(error));

    GetCustomerProfile()
      .then((response) => {
        // console.log(response.data.id);
        // console.log(route.params.id);
      })
      .catch((err) => {
        console.log(err);
      });

    // GetFavoriteList()
    //   .then((response) => {
    //     console.log(response.data);
    //     // console.log(route.params.id);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const handleInfo = () => {
    setColorInfo("#FF9494");
    setColorService("gray");
    setColorRate("gray");
    setShowInfo(true);
    setShowService(false);
    setShowRate(false);
  };
  const handleService = () => {
    setColorService("#FF9494");
    setColorInfo("gray");
    setColorRate("gray");
    setShowInfo(false);
    setShowService(true);
    setShowRate(false);
  };
  const handleRate = () => {
    setColorRate("#FF9494");
    setColorInfo("gray");
    setColorService("gray");
    setShowInfo(false);
    setShowService(false);
    setShowRate(true);
  };

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size="large" color="#FF9494" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ marginTop: 10, marginLeft: 15 }}>
            <View style={styles.infoBeautician}>
              <Image
                source={require("../../../assets/beautician-icon.jpg")}
                style={{ height: 30, width: 30 }}
              />
              <TouchableOpacity>
                <Text style={{ fontSize: 20, marginLeft: 5 }}>
                  {beauticianDetails.map((data) => data.fullName)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoBeautician}>
              <Icon name="location-arrow" type="font-awesome" size={15} />
              <Text style={{ fontSize: 15, marginLeft: 5, color: "gray" }}>
                {beauticianDetails.map((data) => data.address)}
              </Text>
            </View>
          </View>
          <DataTable style={styles.table}>
            <DataTable.Header style={{ borderBottomWidth: 0 }}>
              <DataTable.Cell
                style={{
                  justifyContent: "center",
                  borderBottomWidth: 1,
                  borderColor: colorInfo,
                }}
              >
                <TouchableOpacity onPress={handleInfo}>
                  <Text style={{ color: colorInfo, fontSize: 20 }}>
                    Thông tin
                  </Text>
                </TouchableOpacity>
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  justifyContent: "center",
                  borderBottomWidth: 1,
                  borderColor: colorService,
                }}
              >
                <TouchableOpacity onPress={handleService}>
                  <Text style={{ color: colorService, fontSize: 20 }}>
                    Dịch vụ
                  </Text>
                </TouchableOpacity>
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  justifyContent: "center",
                  borderBottomWidth: 1,
                  borderColor: colorRate,
                }}
              >
                <TouchableOpacity onPress={handleRate}>
                  <Text style={{ color: colorRate, fontSize: 20 }}>
                    Đánh giá
                  </Text>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Header>
          </DataTable>
          <View style={{ marginTop: 15 }}>
            {showInfo ? (
              <InfoBeauticianDetailsScreen id={route.params.id} />
            ) : null}
            {showService ? (
              <ServiceBeauticianDetailsScreen id={route.params.id} />
            ) : null}
            {showRate ? (
              <RateBeauticianDetailsScreen
                id={route.params.id}
                navigation={(routeName) => {
                  navigation.navigate(routeName, { id: route.params.id });
                }}
              />
            ) : null}
          </View>
        </ScrollView>
        <FooterBeauticianDetailsScreen
          id={route.params.id}
          navigation={navigation}
        />
      </View>
    );
  }
};

export default BeauticianDetailsScreen;
