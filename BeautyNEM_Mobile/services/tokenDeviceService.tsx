import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/Token/`;

export async function RefreshToken(request) {
  return await axios.put(API_URL + "RefreshToken", request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      // Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function GetTokenDevice(request) {
  return await axios.get(API_URL + "GetTokenDevice", { params: request });
}
