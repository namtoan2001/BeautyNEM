import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/Searching/`;

export async function SearchFilter(request) {
  return await axios.get(API_URL + "SearchFilter", { params: request });
}
