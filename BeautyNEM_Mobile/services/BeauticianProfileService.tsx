import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/`;

export async function GetBeauticianDetailsWithToken() {
  return await axios.get(
    API_URL + `BeauticianDetails/GetBeauticianDetailsWithToken`,
    {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
      },
    }
  );
}

export async function GetBeauticianDetails(id) {
  return await axios.get(
    API_URL + `BeauticianDetails/GetBeauticianDetails/${id}`
  );
}

export async function GetSkillWithToken() {
  return await axios.get(API_URL + `BeauticianDetails/GetSkillWithToken`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}

export async function GetImageWithToken() {
  return await axios.get(API_URL + `BeauticianDetails/GetImageWithToken`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}
export async function GetAvatarWithToken() {
  return await axios.get(API_URL + `BeauticianDetails/GetAvatarWithToken`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}
export async function UpdateBeauticianInfo(request) {
  return await axios.put(
    API_URL + `BeauticianDetails/UpdateBeauticianInfo`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function UpdatePasswordBeautician(request) {
  return await axios.put(
    API_URL + `BeauticianDetails/UpdatePasswordBeautician`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
export async function GetCities() {
  return await axios.get(API_URL + "BeauticianAccount/GetCities");
}

export async function GetDistricts(CityID) {
  return await axios.get(API_URL + `BeauticianAccount/GetDistricts/${CityID}`);
}

export async function GetServices() {
  return await axios.get(API_URL + "BeauticianAccount/GetServices");
}

export async function DeleteImgBeautician(beauticianId, imageLink) {
  return await axios.delete(API_URL + `BeauticianDetails/DeleteImgBeautician/${beauticianId}/${imageLink}`);
}
export async function DeleteBeauticianService(BeauticianId, serviceId) {
  return await axios.delete(API_URL + `BeauticianDetails/DeleteBeauticianService/${BeauticianId}/${serviceId}`);
}
export async function AddImgBeautician(request) {
  return await axios.post(
    API_URL + `BeauticianDetails/AddImgBeautician`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
export async function UpdateBeauticianService(request) {
  return await axios.put(
    API_URL + `BeauticianDetails/UpdateBeauticianService`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
export async function AddBeauticianService(request) {
  return await axios.post(
    API_URL + `BeauticianDetails/AddBeauticianService`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
export async function UpdateBeauticianAvatar(request) {
  return await axios.put(
    API_URL + `BeauticianDetails/UpdateBeauticianAvatar`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
export async function HandleDiscount(request) {
  return await axios.put(
    API_URL + `BeauticianDetails/HandleDiscount`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
export async function UpdateWorkingTime(request) {
  return await axios.put(
    API_URL + `BeauticianDetails/UpdateWorkingTime`,
    request,
    {
      transformRequest: (request) => {
        return request;
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
