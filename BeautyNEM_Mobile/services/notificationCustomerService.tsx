import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/NotificationCustomer/`;

export async function AddNotificationForCustomer(request) {
  return await axios.post(API_URL + "AddNotificationForCustomer", request, {
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

export async function GetNotificationForCustomer(customerId) {
  return await axios.get(API_URL + `GetNotificationForCustomer/${customerId}`);
}

export async function UpdateReminderForCustomer(request) {
  return await axios.put(API_URL + "UpdateReminderForCustomer", request, {
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

export async function AddNotificationRMForCustomer(request) {
  return await axios.post(API_URL + "AddNotificationRMForCustomer", request, {
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

export async function GetNotificationRMForCustomer(customerId) {
  return await axios.get(
    API_URL + `GetNotificationRMForCustomer/${customerId}`
  );
}

export async function UpdateReminderRMForCustomer(request) {
  return await axios.put(API_URL + "UpdateReminderRMForCustomer", request, {
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
