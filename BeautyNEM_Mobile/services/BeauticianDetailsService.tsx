import axios from 'axios';
import {REACT_APP_DOMAIN_API} from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/BeauticianDetails/`;
// const API_URL = `https://0e2b-171-235-170-2.ap.ngrok.io/api/BeauticianDetails/`;

export async function GetBeauticianDetails(id){
  return axios.get(API_URL + `GetBeauticianDetails/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
}
export async function GetSkill(id){
  return axios.get(API_URL + `GetSkill/${id}`);
}
export async function GetRating(id){
  return axios.get(API_URL + `GetRating/${id}`);
}
export async function GetImage(id){
  return axios.get(API_URL + `GetImage/${id}`);
}
export async function GetImageWithServiceId(beauticianId, serviceId){
  return axios.get(API_URL + `GetImageWithServiceId/${beauticianId}/${serviceId}`);
}