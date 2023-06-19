import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ScrollView,
  Dimensions,
  FlatList,
  Animated,
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {
  AddRecruitingMakeupModels,
  GetBeauticianDetailsWithToken,
} from "../../../../services/RecruitingMakeupModelsService";

import * as ImagePicker from "expo-image-picker";
import { useFormik } from "formik";
import * as Yup from "yup";

import { SelectList } from "react-native-dropdown-select-list";

const width = Dimensions.get("window").width;
const scrollX = new Animated.Value(0);
let position = Animated.divide(scrollX, width);

const data = [
  { key: "1", value: "Miễn phí" },
  { key: "2", value: "Phụ thu" },
];

const CreatePost = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [beauticianId, setBeauticianId] = useState();

  const [images, setImages] = useState([]);
  const [imageLength, setImageLength] = useState(0);
  const [errImgs, setErrImgs] = useState(false);
  const [errPrice, setErrPrice] = useState(false);
  const [loadAdds, setLoadAdds] = useState(true);

  const loadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.cancelled === false) {
      const selectedImages = result.selected;

      if (selectedImages.length > 10) {
        Alert.alert("Thông báo", "Chọn tối đa 10 ảnh");
        return;
      }

      const arrImg = [];
      const imgs = [];
      const today = new Date();
      const date = `${today.getSeconds()}${today.getMinutes()}${today.getHours()}${today.getDate()}${
        today.getMonth() + 1
      }${today.getFullYear()}`;
      let i = 0;

      selectedImages.forEach((item) => {
        const uri =
          Platform.OS === "android"
            ? item.uri
            : item.uri.replace("file://", "");
        const filename = item.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename as string);
        const ext = match[1];
        const type = match ? `image/${match[1]}` : `image`;
        const name = `image${date}${i++}.${ext}`;
        arrImg.push({ uri, name, type });
        imgs.push(uri);
      });

      formik.setFieldValue("imageFile", arrImg);
      setImages(imgs);
      setErrImgs(true);
      setImageLength(imgs.length);
    }
  };

  useEffect(() => {
    GetBeauticianDetailsWithToken()
      .then((response) => {
        setBeauticianId(response.data.id);
      })
      .catch((error) => {
        console.log(`Không lấy được thông tin: ` + error);
      });
    formik.setFieldValue("price", "0");
  }, []);

  const renderProduct = ({ item, index }) => {
    return (
      <View
        style={{
          width: width,
          height: 240,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    );
  };

  const SignupSchema = Yup.object().shape({
    postName: Yup.string().required("Vui lòng nhập tên bài đăng"),
    // price: Yup.string().required("Vui lòng nhập tên bài đăng"), // "Vui lòng chọn hình thức thu phí"
    description: Yup.string().required("Vui lòng nhập mô tả bài đăng"),
  });

  const dataForm = {
    beauticianId: "",
    imageFile: "",
    postName: "",
    price: "",
    description: "",
  };

  const formik = useFormik({
    initialValues: { dataForm },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let formData = new FormData();
        formData.append("BeauticianId", beauticianId);
        for (const key of Object.keys(values.imageFile)) {
          formData.append("ImageFile", values.imageFile?.[key]);
        }
        formData.append("Name", values.postName);
        formData.append("Price", values.price);
        formData.append("Description", values.description);
        if (errImgs && errPrice === true) {
          const confirmed = await new Promise((resolve, reject) => {
            Alert.alert("Thông báo", "Bạn có muốn tạo bài đăng tuyển mẫu?", [
              {
                text: "Hủy",
                onPress: () => resolve(false),
                style: "cancel",
              },
              {
                text: "Đồng ý",
                onPress: () => resolve(true),
              },
            ]);
          });
          if (confirmed) {
            try {
              await AddRecruitingMakeupModels(formData);
              Alert.alert("Thông báo", "Tạo bài đăng thành công");
              navigation.navigate("ModelRecruitment", loadAdds);
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <ScrollView style={{ flex: 1 }}>
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
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <FlatList
            data={images}
            horizontal
            // sliderWidth={screenWidth}
            // sliderHeight={screenWidth}
            renderItem={renderProduct}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.8}
            snapToInterval={width}
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              marginTop: 32,
            }}
          >
            {images
              ? images.map((data, index) => {
                  let opacity = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0.2, 1, 0.2],
                    extrapolate: "clamp",
                  });
                  return (
                    <Animated.View
                      key={index}
                      style={{
                        width: "8%",
                        height: 2.4,
                        backgroundColor: "#000000",
                        opacity,
                        marginHorizontal: 4,
                        borderRadius: 100,
                      }}
                    ></Animated.View>
                  );
                })
              : null}
          </View>
        </View>
        <View style={styles.context}>
          <TouchableOpacity
            onPress={loadImage}
            onBlur={formik.handleBlur("postName")}
            // disabled={isLoading}
          >
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: 10,
                borderColor: "#666",
                borderWidth: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="camera"
                  size={35}
                  color="#666666"
                  style={{
                    opacity: 0.7,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
          {imageLength <= 0 ? (
            <Text style={styles.errorsImg}>Vui lòng chọn ảnh</Text>
          ) : null}
        </View>

        <View style={styles.action}>
          <Icon name="post-outline" size={24} style={styles.actionIcon} />
          <TextInput
            placeholder="Nhập tên bài đăng"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[styles.textInput]}
            onChangeText={formik.handleChange("postName")}
            onBlur={formik.handleBlur("postName")}
            value={formik.values.postName}
          />
        </View>
        {formik.errors.postName ? (
          <Text style={styles.errors}>{formik.errors.postName}</Text>
        ) : null}

        <View style={styles.viewDropdown}>
          {/* {renderLabel()}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "#FF9494" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.containerStyle}
            itemContainerStyle={styles.itemContainerStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="id"
            placeholder={!isFocus ? "Chọn hình thức thu phí" : "..."}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.id);
              setIsFocus(false);
              formik.setFieldValue("price", item.label);
            }}
            renderLeftIcon={() => (
              <FontAwesome5
                style={styles.icon}
                color={isFocus ? "#FF9494" : "#666"}
                name="money-check-alt"
                size={20}
              />
            )}
          /> */}
          {/* <Text>
            {console.log(
              formik.values.price === "Miễn phí" ||
                formik.values.price === "Phụ thu"
            )}
          </Text> */}
          <SelectList
            setSelected={(val) => {
              formik.setFieldValue("price", val);
              setErrPrice(true);
            }}
            save="value"
            data={data}
            arrowicon={
              <View style={{ marginTop: 4 }}>
                <FontAwesome name="chevron-down" size={12} color={"#ccc"} />
              </View>
            }
            search={false}
            boxStyles={{
              borderColor: "#ccc",
            }}
            defaultOption={{ key: "0", value: "Chọn hình thức thu phí" }}
          />
        </View>
        {formik.values.price === "Miễn phí" ||
        formik.values.price === "Phụ thu" ? null : (
          <Text style={styles.errors}>Vui lòng chọn hình thức thu phí</Text>
        )}

        <View style={styles.action}>
          <TextInput
            placeholder="Nhập mô tả về bài đăng"
            textAlignVertical="top"
            multiline={true}
            numberOfLines={Platform.OS === "ios" ? null : 15}
            minHeight={Platform.OS === "ios" ? 290 : null}
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInputDescription}
            onChangeText={formik.handleChange("description")}
            onBlur={formik.handleBlur("description")}
            value={formik.values.description}
          />
        </View>
        {formik.errors.description ? (
          <Text style={styles.errors}>{formik.errors.description}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.commandButton}
          onPress={formik.handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.panelButtonTitle}>
            {isLoading ? "Loading..." : "Đăng bài"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
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
    marginBottom: 20,
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
  actionIcon: {
    marginLeft: 10,
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
    position: "relative",
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
    position: "absolute",
    top: -36,
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
});
