import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Header } from "@rneui/themed";

const style = StyleSheet.create({
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  containter: {
    backgroundColor: "#FF9494",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#f7b2b2",
  },
  input: {
    backgroundColor: "#f7b2b2",
    color: "#FFF",
  },
  icon: {
    color: "#FFF",
    fontSize: 20,
  },
});

const FilterScreen = () => {
  return (
    <View>
      <Header
        centerComponent={{ text: "Tài khoản", style: style.header }}
        containerStyle={style.header}
      />
      <Text>FilterScreen</Text>
    </View>
  );
};

export default FilterScreen;
