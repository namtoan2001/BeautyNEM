import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/`;

export async function GetListRecruitingMakeupModelsImage(id) {
  return await axios.get(
    API_URL + `RecruitingMakeupModels/GetListRecruitingMakeupModelsImage/${id}`
  );
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
