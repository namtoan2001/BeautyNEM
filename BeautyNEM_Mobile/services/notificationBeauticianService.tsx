import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/NotificationBeautician/`;

export async function AddNotificationForBeautician(request) {
  return await axios.post(API_URL + "AddNotificationForBeautician", request, {
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

export async function GetNotificationForBeautician(beauticianId) {
  return await axios.get(API_URL + `GetNotificationForBeautician/${beauticianId}`);
}

export async function ConfirmRequestForBeautician(request) {
  return await axios.put(API_URL + "ConfirmRequestForBeautician", request, {
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

export async function AddNotificationRMForBeautician(request) {
  return await axios.post(API_URL + "AddNotificationRMForBeautician", request, {
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

export async function GetNotificationRMForBeautician(beauticianId) {
  return await axios.get(API_URL + `GetNotificationRMForBeautician/${beauticianId}`);
}

export async function ConfirmRequestRMForBeautician(request) {
  return await axios.put(API_URL + "ConfirmRequestRMForBeautician", request, {
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