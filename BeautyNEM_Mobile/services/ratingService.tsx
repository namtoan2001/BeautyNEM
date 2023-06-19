import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/Rating/`;

export async function AddRatingBeautician(request) {
  return await axios.post(API_URL + "AddRatingBeautician", request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}