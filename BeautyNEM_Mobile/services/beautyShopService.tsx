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

export async function GetListBeautyShopImageWithToken() {
  return await axios.get(API_URL + `BeautyShop/GetBeautyShopDetailsWithToken`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function AddProduct(request) {
  return await axios.post(API_URL + `BeautyShopProduct/AddProduct`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function GetProduct(id) {
  return await axios.get(API_URL + `BeautyShopProduct/GetProduct/${id}`);
}

export async function UpdateProduct(request) {
  return await axios.put(API_URL + `BeautyShopProduct/UpdateProduct`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function DeleteShopProduct(ProductId, ShopId) {
  return await axios.delete(
    API_URL + `BeautyShopProduct/DeleteShopProduct/${ProductId}/${ShopId}`
  );
}

export async function GetListBeautyShopImageWithProductId(
  BeautyShopId,
  ProductId
) {
  return await axios.get(
    API_URL +
      `BeautyShop/GetListBeautyShopImageWithProductId/${BeautyShopId}/${ProductId}`
  );
}
