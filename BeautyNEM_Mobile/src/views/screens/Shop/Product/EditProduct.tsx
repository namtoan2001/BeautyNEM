import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ScrollView,
  Animated,
  FlatList,
  Dimensions,
} from "react-native";

import { Header } from "@rneui/themed";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Icons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { UpdateProduct } from "../../../../../services/beautyShopService";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Dropdown } from "react-native-element-dropdown";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const EditProduct = ({ route, navigation }) => {
  const SignupSchema = Yup.object().shape({
    productName: Yup.string().required("Vui lòng nhập tên sản phẩm"),
    price: Yup.string().required("Vui lòng nhập giá sản phẩm"),
    productDescription: Yup.string().required("Vui lòng nhập mô tả sản phẩm"),
  });

  const dataForm = {
    price: 1,
    productDescription: "",
    productName: "",
  };

  const formik = useFormik({
    initialValues: { dataForm },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("id", route.params.id);
      formData.append("productName", values.productName);
      formData.append("price", values.price);
      formData.append("productDescription", values.productDescription);
      Alert.alert("Thông báo", "Xác nhận chỉnh sửa thông tin sản phẩm?", [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            console.log(formData);
            UpdateProduct(formData)
              .then((response) => {
                console.log(response);
                Alert.alert(
                  "Thông báo",
                  "Chỉnh sửa thông tin sản phẩm thành công"
                );
                navigation.navigate("HomeProduct");
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
      ]);
    },
  });

  useEffect(() => {
    formik.setFieldValue("price", route.params.price);
    formik.setFieldValue("productName", route.params.productName);
    formik.setFieldValue("productDescription", route.params.productDescription);
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "Chỉnh sửa thông tin",
            style: styles.header,
          }}
          containerStyle={styles.header}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.iconBack}
        >
          <Icons name="arrow-back" color="#FFF" size={24} />
        </TouchableOpacity>

        <View style={styles.action}>
          <MaterialIcons
            name="drive-file-rename-outline"
            size={24}
            style={styles.actionIcon}
          />
          <TextInput
            placeholder="Nhập tên sản phẩm"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[styles.textInput]}
            onChangeText={formik.handleChange("productName")}
            onBlur={formik.handleBlur("productName")}
            value={formik.values.productName}
          />
        </View>
        {formik.errors.productName ? (
          <Text style={styles.errors}>{formik.errors.productName}</Text>
        ) : null}

        <View style={styles.action}>
          <FontAwesome5
            name="money-check-alt"
            size={22}
            style={styles.actionIcon}
          />
          <TextInput
            placeholder="Nhập giá sản phẩm"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[styles.textInput]}
            onChangeText={formik.handleChange("price")}
            onBlur={formik.handleBlur("price")}
            value={formik.values.price}
            keyboardType="numeric"
            returnKeyType="go"
          />
        </View>
        {formik.errors.price ? (
          <Text style={styles.errors}>{formik.errors.price}</Text>
        ) : null}

        <View style={styles.action}>
          <TextInput
            placeholder="Nhập mô tả về sản phẩm"
            textAlignVertical="top"
            multiline={true}
            numberOfLines={15}
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInputDescription}
            onChangeText={formik.handleChange("productDescription")}
            onBlur={formik.handleBlur("productDescription")}
            value={formik.values.productDescription}
          />
        </View>
        {formik.errors.productDescription ? (
          <Text style={styles.errors}>{formik.errors.productDescription}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.commandButton}
          onPress={formik.handleSubmit}
        >
          <Text style={styles.panelButtonTitle}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    position: "relative",
  },
  iconBack: {
    position: "absolute",
    top: 46,
    left: 8,
  },
  commandButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FF9494",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 8,
  },
  context: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#666",
    fontSize: 15,
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  textInputDescription: {
    flex: 1,
    padding: 8,
    color: "#666",
    fontSize: 15,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 8,
    marginRight: 8,
  },
  viewDropdown: {
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "#f2f2f2",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerStyle: {
    top: 126,
    fontSize: 16,
  },
  itemContainerStyle: {
    fontSize: 16,
  },
  errors: {
    fontSize: 14,
    color: "red",
    left: 20,
  },
  errorsImg: {
    fontSize: 14,
    color: "red",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  actionIcon: {
    marginLeft: 10,
  },
});
