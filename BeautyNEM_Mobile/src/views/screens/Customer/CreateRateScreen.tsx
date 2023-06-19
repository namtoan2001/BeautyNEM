import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  Platform,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BeauticianReview } from "../../../../services/reviewService";
import { number } from "yup";

const CreateRateScreen = ({ route, navigation }) => {
  const [defaultRating, setdefaultRating] = useState(5);
  const [images, setImages] = useState("");
  const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    "https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png";
  const starImgCorner =
    "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";

  const SignupSchema = Yup.object().shape({
    comment: Yup.string().required("Vui lòng nhập đánh giá về dịch vụ."),
    // imageFile: Yup.string().required("Vui lòng chọn hình ảnh."),
  });

  const dataForm = {
    starNumber: 1,
    comment: "",
    imageFile: "",
  };

  const formik = useFormik({
    initialValues: { dataForm },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("BeauticianId", route.params.beauticianId);
      formData.append("CustomerId", route.params.customerId);
      formData.append("EventId", route.params.eventId);
      formData.append("ImageFile", values.imageFile);
      formData.append("StarNumber", defaultRating);
      formData.append("Comment", values.comment);

      Alert.alert("Thông báo", "Xác nhận hoàn thành đánh giá?", [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            BeauticianReview(formData)
              .then((result) => {
                Alert.alert("Thông báo", "Đánh giá dịch vụ thành công");
                navigation.navigate("RateListScreen");
                console.log("Đánh giá thành công: ", formData);
              })
              .catch((error) => {
                console.log("Đánh giá thất bại: ", formData);
                console.log(error.response);
              });
          },
        },
      ]);
    },
  });

  const addImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.cancelled === false) {
      if (result.fileSize >= 3145728) {
        Alert.alert("Hình ảnh không được lớn hơn 3MB.");
      } else {
        var today = new Date();
        var date = `${today.getSeconds()}${today.getMinutes()}${today.getHours()}${today.getDate()}${
          today.getMonth() + 1
        }${today.getFullYear()}`;
        const uri =
          Platform.OS === "android"
            ? result.uri
            : result.uri.replace("file://", "");
        const filename = result.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename as string);
        const ext = match?.[1];
        const type = match ? `image/${match[1]}` : `image`;
        formik.setFieldValue("imageFile", {
          uri,
          name: `image${date}.${ext}`,
          type,
        } as any);
        // imgs.push(uri);
        setImages(uri);
      }
    }
  };

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setdefaultRating(item)}
            >
              <Image
                style={styles.starImgStyle}
                source={
                  item <= defaultRating
                    ? { uri: starImgFilled }
                    : { uri: starImgCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 16,
          }}
        >
          Chất lượng {`\n`} dịch vụ
        </Text>
        <CustomRatingBar />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={addImg}>
          <View
            style={{
              height: 120,
              width: 120,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#FF9494",
              borderRadius: 10,
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
                color="#FF9494"
                style={{
                  opacity: 0.7,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </View>
            <Text
              style={{
                color: "#FF9494",
                marginBottom: 10,
              }}
            >
              Thêm hình ảnh
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: 120,
            height: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {images !== "" ? (
            <Image
              source={{
                uri: images,
              }}
              style={styles.image}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.action}>
        <TextInput
          placeholder="Đánh giá dịch vụ làm đẹp..."
          textAlignVertical="top"
          multiline={true}
          numberOfLines={Platform.OS === "ios" ? null : 20}
          minHeight={Platform.OS === "ios" ? 350 : null}
          placeholderTextColor="#666666"
          autoCorrect={false}
          style={styles.textInputDescription}
          onChangeText={formik.handleChange("comment")}
          onBlur={formik.handleBlur("comment")}
          value={formik.values.comment}
        />
      </View>
      {formik.errors.comment ? (
        <Text style={styles.errors}>{formik.errors.comment}</Text>
      ) : null}
      <TouchableOpacity
        // activeOpacity={0.7}
        style={styles.buttonStyle}
        onPress={formik.handleSubmit}
      >
        <Text style={styles.panelButtonTitle}>Xác nhận</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textStyle: {
    textAlign: "center",
    fontSize: 23,
    marginTop: 20,
  },
  customRatingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  starImgStyle: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  buttonStyle: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FF9494",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 8,
    marginBottom: 20,
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
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  errors: {
    fontSize: 14,
    color: "red",
    left: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default CreateRateScreen;
