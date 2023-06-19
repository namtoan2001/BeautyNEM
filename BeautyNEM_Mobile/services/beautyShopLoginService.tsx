import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/BeautyShopAccount/`;

export async function LoginBeautyShop(request) {
  return await axios.post(API_URL + `Login`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}


