import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/Favorite/`;

export async function GetFavoriteList() {
  return await axios.get(API_URL + `GetFavoriteList`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function AddBeauticianToFavorite(request) {
  return await axios.post(API_URL + `AddBeauticianToFavorite`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function RemoveBeauticianToFavorite(BeauticianId, CustomerId) {
  return await axios.delete(
    API_URL + `RemoveBeauticianToFavorite/${BeauticianId}/${CustomerId}`
  );
}
