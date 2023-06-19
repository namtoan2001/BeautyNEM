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
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {
  UpdateRecruitingMakeupModels,
  GetListRecruitingMakeupModelsImage,
  DeleteRecruitingMakeupModelsImage,
  AddRecruitingMakeupModelsImage,
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

const EditPost = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [imageLength, setImageLength] = useState(0);
  const [errImgs, setErrImgs] = useState(false);
  const [reLoad, setReLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchEditPostePage();
      setReLoad(true);
    }, [reLoad === false])
  );

  const fetchEditPostePage = () => {
    GetListRecruitingMakeupModelsImage(route.params.newData.id).then(
      (response) => {
        setImage(response.data);
        setImageLength(response.data.length);
        setIsLoading(false);
      }
    );
  };

  const loadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.cancelled === false)
      if (result.selected.length + imageLength > 10) {
        Alert.alert(
          "Thông báo",
          `Bài đăng chỉ được tạo tối đa 10 ảnh. Hiện tại bạn đã tạo ${imageLength} ảnh trước đó.`
        );
      } else {
        let arrImg = [];
        let imgs = [];
        let i = 0;
        var today = new Date();
        var date = `${today.getSeconds()}${today.getMinutes()}${today.getHours()}${today.getDate()}${
          today.getMonth() + 1
        }${today.getFullYear()}`;
        result.selected.map((item, index) => {
          const uri =
            Platform.OS === "android"
              ? item.uri
              : item.uri.replace("file://", "");
          const filename = item.uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename as string);
          const ext = match[1];
          const type = match ? `image/${match[1]}` : `image`;
          arrImg.push({ uri, name: `image${date}${i++}.${ext}`, type });
          formik.setFieldValue("imageFile", arrImg);
          imgs.push(uri);
          setImage(imgs);
          setErrImgs(true);
        });
        setImageLength(imgs.length);
        setRefreshing(true);
      }
  };

  const handleDelete = (recruitingMakeupModelsId, imageName) => {
    Alert.alert("Thông báo", "Bạn chắc muốn xóa ảnh bài đăng này?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          DeleteRecruitingMakeupModelsImage(recruitingMakeupModelsId, imageName)
            .then((result) => {
              Alert.alert("Thông báo", "Xóa ảnh thành công");
              setIsLoading(true);
              setReLoad(false);
            })
            .catch((error) => {
              console.log(error);
            });
        },
      },
    ]);
  };

  const renderProduct = ({ item, index }) => (
    <View
      style={{
        width: width,
        height: 240,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {refreshing === true ? (
        <Image
          source={{
            uri: item,
          }}
          style={styles.image}
        />
      ) : (
        <Image
          source={{
            uri: `https://res.cloudinary.com/dpwifnuax/image/upload/RecruitingMakeupModels/Image/Id_${item.recruitingMakeupModelsId}/${item.imageName}`,
          }}
          style={styles.image}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          handleDelete(item.recruitingMakeupModelsId, item.imageName);
        }}
        style={{
          position: "absolute",
          top: 1,
          left: 1,
        }}
      >
        <Icon
          name="delete-forever"
          style={{
            fontSize: 26,
            color: "red",
            borderRadius: 10,
            borderColor: "#F0F0F3",
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const SignupSchema = Yup.object().shape({
    postName: Yup.string().required("Vui lòng nhập tên bài đăng"),
    description: Yup.string().required("Vui lòng nhập mô tả bài đăng"),
  });

  const dataForm = {
    id: 0,
    postName: "",
    price: "",
    description: "",
  };

  const formik = useFormik({
    initialValues: { dataForm },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      let formData = new FormData();
      let formImg = new FormData();
      formData.append("Id", route.params.newData.id);
      formData.append("Name", values.postName);
      formData.append("Price", values.price);
      formData.append("Description", values.description);

      if (refreshing === true) {
        formImg.append("RecruitingMakeupModelsId", route.params.newData.id);
        for (const key of Object.keys(values.imageFile)) {
          formImg.append("ImageFile", values.imageFile?.[key]);
          console.log(values.imageFile?.[key]);
        }
      }
      Alert.alert("Thông báo", "Xác nhận chỉnh sửa bài đăng?", [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            if (refreshing === true) {
              UpdateRecruitingMakeupModels(formData)
                .then((result) => {})
                .catch((error) => {
                  console.log(error);
                });
              AddRecruitingMakeupModelsImage(formImg)
                .then((result) => {})
                .catch((error) => {
                  console.log(error);
                });
              Alert.alert("Thông báo", "Chỉnh sửa bài đăng thành công");
              navigation.navigate("PersonalPost", reLoad);
            } else {
              UpdateRecruitingMakeupModels(formData)
                .then((result) => {
                  Alert.alert("Thông báo", "Chỉnh sửa bài đăng thành công");
                  navigation.navigate("PersonalPost", reLoad);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          },
        },
      ]);
    },
  });

  useEffect(() => {
    formik.setFieldValue("price", route.params.newData.price);
    formik.setFieldValue("postName", route.params.newData.name);
    formik.setFieldValue("description", route.params.newData.description);
  }, [formik.values.price === undefined]);

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
            marginTop: 12,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <FlatList
            data={image}
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
              { useNativeDriver: isLoading }
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
            {image
              ? image.map((data, index) => {
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
        </View>

        <View style={styles.action}>
          <Icon name="post-outline" size={24} />
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
          <SelectList
            setSelected={(val) => {
              formik.setFieldValue("price", val);
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
            defaultOption={{ key: "0", value: `${route.params.newData.price}` }}
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
          // disabled={true}
        >
          <Text style={styles.panelButtonTitle}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditPost;

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
    marginBottom: 8,
  },
  commandButtonDisabled: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ccc",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 8,
    marginBottom: 8,
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
});
