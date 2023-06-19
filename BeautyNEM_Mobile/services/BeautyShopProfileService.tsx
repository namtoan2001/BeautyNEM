import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/`;

export async function GetBeautyShopDetailsWithToken() {
  return await axios.get(API_URL + `BeautyShop/GetBeautyShopDetailsWithToken`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function UpdateBeautyShop(request) {
  return await axios.put(
    API_URL + `BeautyShop/UpdateBeautyShop`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function UpdatePasswordBeautyShop(request) {
  return await axios.put(
    API_URL + `BeautyShop/UpdatePasswordBeautyShop`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function UpdateAvatarBeautyShop(request) {
  return await axios.put(
    API_URL + `BeautyShop/UpdateAvatarBeautyShop`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function GetProduct(ShopId) {
  return await axios.get(API_URL + `BeautyShopProduct/GetProduct/${ShopId}`)
}

export async function GetListBeautyShopImageWithProductId(BeautyShopId, ProductId) {
  return await axios.get(API_URL + `BeautyShop/GetListBeautyShopImageWithProductId/${BeautyShopId}/${ProductId}`)
}