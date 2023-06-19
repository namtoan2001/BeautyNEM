import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/`;

export async function BeauticianReview(request) {
  return await axios.post(
    API_URL + `CustomerBooking/BeauticianReview`,
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

export async function GetRating(id) {
  return await axios.get(API_URL + `BeauticianDetails/GetRating/${id}`);
}
