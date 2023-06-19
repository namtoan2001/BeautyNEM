import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/`;

export async function GetListRecruitingMakeupModelsImage(id) {
  return await axios.get(
    API_URL + `RecruitingMakeupModels/GetListRecruitingMakeupModelsImage/${id}`
  );
}

export async function GetRecruitingMakeupModelsList() {
  return await axios.get(
    API_URL + "RecruitingMakeupModels/GetRecruitingMakeupModelsList"
  );
}

export async function GetRecruitingMakeupModelsImage() {
  return await axios.get(
    API_URL + "RecruitingMakeupModels/GetRecruitingMakeupModelsImage"
  );
}

export async function GetRecruitingMakeupModelsDetailsWithId(id) {
  return await axios.get(
    API_URL +
      `RecruitingMakeupModels/GetRecruitingMakeupModelsDetailsWithId/${id}`
  );
}

export async function GetBeauticianDetails(id) {
  return await axios.get(
    API_URL + `BeauticianDetails/GetBeauticianDetails/${id}`
  );
}

export async function AddRecruitingMakeupModels(request) {
  return await axios.post(
    API_URL + `RecruitingMakeupModels/AddRecruitingMakeupModels`,
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

export async function DeleteRecruitingMakeupModels(id) {
  return await axios.delete(
    API_URL + `RecruitingMakeupModels/DeleteRecruitingMakeupModels/${id}`
  );
}

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

export async function SearchFilterRecruits(request) {
  return await axios.get(API_URL + "Searching/SearchFilterRecruits", {
    params: request,
  });
}

export async function UpdateRecruitingMakeupModels(request) {
  return await axios.put(
    API_URL + `RecruitingMakeupModels/UpdateRecruitingMakeupModels`,
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

export async function DeleteRecruitingMakeupModelsImage(
  recruitingMakeupModelsId,
  imageName
) {
  return await axios.delete(
    API_URL +
      `RecruitingMakeupModels/DeleteRecruitingMakeupModelsImage/${recruitingMakeupModelsId}/${imageName}`
  );
}

export async function AddRecruitingMakeupModelsImage(request) {
  return await axios.post(
    API_URL + `RecruitingMakeupModels/AddRecruitingMakeupModelsImage`,
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
