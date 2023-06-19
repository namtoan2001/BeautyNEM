import axios from "axios";

const API_URL = `${process.env.REACT_APP_DOMAIN_API}/api/`;

export async function GetBeauticianStatisticals() {
  return await axios.get(API_URL + "AdminAccount/GetBeauticianStatisticals");
}

export async function GetBeautyShopStatisticals() {
  return await axios.get(API_URL + "AdminAccount/GetBeautyShopStatisticals");
}

export async function GetCustomerStatisticals() {
  return await axios.get(API_URL + "AdminAccount/GetCustomerStatisticals");
}

export async function GetEventStatisticals() {
  return await axios.get(API_URL + "AdminAccount/GetEventStatisticals");
}
