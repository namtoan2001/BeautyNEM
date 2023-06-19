import axios from "axios";
import { REACT_APP_DOMAIN_API } from "@env"

const API_URL = `${REACT_APP_DOMAIN_API}/api/CustomerAccount/`;

export async function CreateAccount(request) {
  return await axios.post(API_URL + `CreateAccount`, request,
    {
      transformRequest: (request) => { return request },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export async function GetCustomerByID(id) {
  return await axios.get(API_URL + `GetCustomerByID/${id}`);
}
