import axios from "axios";

const API_URL = `${process.env.REACT_APP_DOMAIN_API}/api/AdminAccount/`;

export async function GetServiceList() {
  return await axios.get(API_URL + "GetServiceList");
}

export async function AddServiceName(request) {
  return await axios.post(API_URL + `AddService`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function DeleteService(id) {
  return await axios.delete(API_URL + `DeleteService/${id}`);
}

export async function UpdateService(request) {
  return await axios.put(API_URL + `UpdateService`, request, {
    transformRequest: (request) => {
      return request;
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}
