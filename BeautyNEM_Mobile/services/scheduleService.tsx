import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/Schedule/`;

export async function CreateSchedule(request) {
  return await axios.post(API_URL + "CreateSchedule", request, {
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

export async function GetSchedules() {
  return await axios.get(API_URL + "GetSchedules", {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function SearchFilterSortSchedule(request) {
  return await axios.get(API_URL + "SearchFilterSortSchedule", {
    params: request,
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function GetScheduleById(Id) {
  return await axios.get(API_URL + `GetScheduleById/${Id}`);
}

export async function EditScheduleRequest(request) {
  return await axios.put(API_URL + "EditSchedule", request, {
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

export async function DeleteSchedule(Id) {
  return await axios.delete(API_URL + `DeleteSchedule/${Id}`);
}
