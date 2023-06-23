import axios from "axios";
import cookie from "./cookie";
const baseURL = "http://192.168.7.30:3000/api";
// const baseURL = "http://localhost:3000/api";


export const signin = async (signinUser) => {
  console.log(signinUser);

  return axios.post(`${baseURL}/user/login`, signinUser).then(response => {
    console.log(response)
    if (response.status == 200) {
      cookie.setCookie("auth-token", response.data.token, 30); 
      localStorage.setItem("LastLogged", Date.now());
      return true
    }
  }).catch(error => {
    console.log("Failed to login",error)
    return false
  })
  
};


export const signout = () => {
  cookie.setCookie("auth-token", "", 30);
  localStorage.setItem("LastLogged", Date.now());
  window.location.reload();
};




export const getUser = async () => {
  const data = await makeGetRequest("/user");
  return data;
};

//use these when u need to use Authorization Bearer (access private routes)
export const makeGetRequest = async (route) => {
  const token = cookie.getCookie("auth-token");
  //concat the route and the baseURL together for example, our baseURL is http://localhost:3000 and route is /user => we get http://localhost:3000/user
  const url = baseURL + route;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const makePostRequest = async (route, data, alterRoute) => {
  const token = cookie.getCookie("auth-token");
  let url = baseURL + route;
  if(alterRoute) url = alterRoute
  const response = await axios.post(url, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const makeDeleteRequest = async (route, plate_data) => {
  console.log(plate_data)
  const token = cookie.getCookie("auth-token");
  const url = baseURL + route;
  const response = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` }, data: plate_data
  });
  return response.data;
};

export const makeEditRequest = async (route, data) => {
  const token = cookie.getCookie("auth-token");
  const url = baseURL + route;
  const response = await axios.patch(url, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
