import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/BeauticianAccount/`;

export async function CreateAccount(request) {
  return await axios.post(API_URL + `CreateAccount`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function GetCities() {
  return await axios.get(API_URL + "GetCities");
}

export async function GetDistricts(CityID) {
  return await axios.get(API_URL + `GetDistricts/${CityID}`);
}

export async function GetServices() {
  return await axios.get(API_URL + "GetServices");
}
