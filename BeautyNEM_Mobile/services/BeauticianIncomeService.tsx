import axios from 'axios';
import {REACT_APP_DOMAIN_API} from "@env";

const API_URL = `${REACT_APP_DOMAIN_API}/api/Money/`;

export async function GetMoneyByMonth(beauticianId, month, year){
  return axios.get(API_URL + `GetMoneyByMonth/${beauticianId}/${month}/${year}`);
}

export async function GetMoneyByYear(beauticianId, year){
    return axios.get(API_URL + `GetMoneyByYear/${beauticianId}/${year}`);
}