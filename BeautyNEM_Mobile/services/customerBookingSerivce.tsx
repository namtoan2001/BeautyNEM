import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/CustomerBooking/`;


export async function CustomerGetSkill(id) {
  return await axios.get(API_URL + `CustomerGetSkill/${id}`);
}


export async function CustomerGetSchedule(beauticianID, dayName,date) {
  return await axios.get(API_URL + `CustomerGetSchedule/${beauticianID}/${dayName}/${date}`);
}

export async function CustomerBooking(request) {
  return await axios.post(API_URL + `CustomerBooking`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function CustomerBookingModelRecruit(request) {
  return await axios.post(API_URL + `CustomerBookingModelRecruit`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

