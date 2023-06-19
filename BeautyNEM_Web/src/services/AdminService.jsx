import axios from "axios";

const API_URL = `${process.env.REACT_APP_DOMAIN_API}/api/AdminAccount`;

export async function Login(request){
    return await axios.post(API_URL + "/Login", request, {
      transformRequest: (request) => {
        return request;
      },
    });
}