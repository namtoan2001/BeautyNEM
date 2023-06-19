import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button } from "@rneui/themed";
import { GetRating } from "../../../services/reviewService";

const numColumns = 2;
const HEIGHT = Dimensions.get("window").height;

const style = StyleSheet.create({
  containter: {},
  flatList: {
    padding: 5,
  },
  item: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemBlank: {
    flex: 1,
    width: 0,
    height: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  service: {
    width: "100%",
    color: "#3f5efb",
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  wrapStarNumber: {
    position: "absolute",
    width: "100%",
    alignItems: "flex-end",
  },
  starNumber: {
    zIndex: 1,
    width: 40,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#fc466b",
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 20,
    marginRight: 10,
    paddingLeft: 3,
  },
  title: {
    width: "100%",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 5,
    paddingLeft: 5,
  },
  address: {
    width: "100%",
    fontSize: 10,
    color: "#808080",
    textAlign: "center",
    marginLeft: 2,
  },
  listEmpty: {
    height: Dimensions.get("window").height,
    alignItems: "center",
    paddingTop: 50,
  },
});
interface Star {
  id: number;
  startAvg: number;
}

const Stars: Array<Star> = [
  {
    id: 1,
    startAvg: 0,
  },
];

const GridViewBeaucianList = ({
  beauticians,
  count,
  navigation,
  onResetFilter,
}) => {
  const [newBeauticians, setNewBeauticians] = useState<Star[]>([]);

  const formatData = (data, numColumns) => {
    const totalRows = Math.floor(data.length / numColumns);
    let totalLastRow = beauticians.length - totalRows * numColumns;
    while (totalLastRow != 0 && totalLastRow != numColumns) {
      beauticians.push({ id: 0, isEmpty: true });
      totalLastRow++;
    }

    return beauticians;
  };

  useEffect(() => {
    const updateRatings = async () => {
      const updatedBeauticians = await Promise.all(
        beauticians.map(async (beautician) => {
          try {
            const ratings = await GetRating(beautician.id);
            const arr = ratings.data.map((data) => data.rating);
            const avg =
              arr.reduce((sum, curr) => sum + Number(curr), 0) / arr.length;
            const result = Math.round(avg * 10) / 10;
            return { id: beautician.id, startAvg: result };
          } catch (error) {
            return { id: beautician.id, startAvg: 0 };
          }
        })
      );
      setNewBeauticians(updatedBeauticians);
    };
    updateRatings();
  }, [beauticians]);

  const HeaderComponent = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 10,
          paddingRight: 5,
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#808080",
          }}
        >
          Có {count} thợ làm đẹp phù hợp
        </Text>
        <Button
          title="Reset"
          type="clear"
          titleStyle={{ fontSize: 14 }}
          buttonStyle={{ padding: 0 }}
          onPress={onResetFilter}
        />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    let newStart;
    newBeauticians.map((itemStart) => {
      if (itemStart.id === item.id) {
        newStart = itemStart.startAvg;
      }
    });
    const hideimg = item.avatar === null;
    if (item.isEmpty) {
      return <View style={[style.item, style.itemBlank]} />;
    }
    return (
      <TouchableOpacity
        style={style.item}
        onPress={() =>
          navigation.navigate("BeauticianDetails", { id: item.id })
        }
      >
        <View style={{ width: "100%", height: 80 }}>
          {hideimg ? (
            <Image
              style={style.image}
              source={require("../../assets/images/avatarSearch.jpeg")}
            />
          ) : (
            <Image
              style={style.image}
              source={{
                uri: `https://res.cloudinary.com/dpwifnuax/image/upload/BeauticianAvatar/Id_${item.id}/${item.avatar}`,
              }}
            />
          )}
        </View>
        <Text style={style.service}>{item.skillName}</Text>
        <View style={style.wrapStarNumber}>
          <View style={style.starNumber}>
            <Text style={{ color: "#fc466b" }}>{newStart}</Text>
            <MaterialIcons name="star" size={10} color="orange" />
          </View>
        </View>
        <Text style={style.title}>{item.fullName}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            marginBottom: 3,
          }}
        >
          <Ionicons name="location-outline" size={14} color="#808080" />
          <View>
            <Text style={style.address}>
              {item.districtName}, {item.cityName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View style={style.listEmpty}>
        <Image
          style={{ width: 300, height: 300, opacity: 0.8 }}
          source={require("../../assets/images/noResultFound.png")}
        />
        <Text>Không tìm thấy kết quả tìm kiếm</Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        style={style.flatList}
        data={formatData(beauticians, numColumns)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={HeaderComponent}
      />
    </View>
  );
};

export default GridViewBeaucianList;
