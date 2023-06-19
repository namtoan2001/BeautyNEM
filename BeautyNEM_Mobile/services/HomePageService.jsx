import axios from "axios";

const API_URL = `${process.env.REACT_APP_DOMAIN_API}/api/AdminAccount/`;
const API_URL_ARRANGE = `${process.env.REACT_APP_DOMAIN_API}/api/Arrange/`;

export async function GetTitle() {
  return await axios.get(API_URL + "GetTitle");
}

export async function UpdateTitle(request) {
  return await axios.put(API_URL + `UpdateTitle`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function GetTitleImage() {
  return await axios.get(API_URL + "GetTitleImage");
}

export async function AddTitleImage(request) {
  return await axios.post(API_URL + `AddTitleImage`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function DeleteTitleImage(id) {
  return await axios.delete(API_URL + `DeleteTitleImage/${id}`);
}

export async function SortBeauticianByRating() {
  return await axios.get(API_URL_ARRANGE + "SortBeauticianByRating");
}

export async function SortBeauticianByDiscount() {
  return await axios.get(API_URL_ARRANGE + "SortBeauticianByDiscount");
}

export async function GetServiceList() {
  return await axios.get(API_URL + "GetServiceList");
}
