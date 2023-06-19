import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/EventBooking/`;

export async function GetEventsForBeautician() {
  return await axios.get(API_URL + "GetEventsForBeautician", {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function SearchFilterSortForBeautician(request) {
  return await axios.get(API_URL + "SearchFilterSortForBeautician", {
    params: request,
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function GetEventsForCustomer() {
  return await axios.get(API_URL + "GetEventsForCustomer", {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function SearchFilterSortForCustomer(request) {
  return await axios.get(API_URL + "SearchFilterSortForCustomer", {
    params: request,
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function GetEventDetailById(id) {
  return await axios.get(API_URL + `GetEventDetailById/${id}`);
}

export async function GetEventRMDetailById(id) {
  return await axios.get(API_URL + `GetEventRMDetailById/${id}`);
}


export async function CompleteEventBooking(Id) {
  return await axios.put(API_URL + `CompleteEventBooking/${Id}`);
}

export async function CancelEventBooking(Id, cancelReason) {
  return await axios.delete(
    API_URL + `CancelEventBooking/${Id}/${cancelReason}`
  );
}

export async function InProgressEventBooking(Id) {
  return await axios.put(API_URL + `InProgressEventBooking/${Id}`);
}
