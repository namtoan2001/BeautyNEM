import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env"
import { AuthContext } from "../src/context/AuthContext";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_DOMAIN_API}/api/CustomerAccount/`;


export async function EditCustomerAccount(request) {
  return await axios.put(API_URL + `EditCustomerAccount`, request,
    {
      transformRequest: (request) => { return request },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export async function ChangePassword(request) {
  return await axios.put(API_URL + `ChangePassword`, request,
    {
      transformRequest: (request) => { return request },
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export async function GetCustomerProfile() {
  return await axios.get(API_URL + `GetCustomerProfile`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
    },
  });
}