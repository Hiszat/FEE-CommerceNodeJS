import axios from "axios";
import Cookies from 'js-cookie'

const LogIn = async ({ email, password }) => {
  try {
    const response = await axios.post('http://localhost:2020/auth/login', {
      email,
      password
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const isLogin = () => {
  if(Cookies.get("token")){
    return true;
  }
  return false;
}

function getToken(){
  const token = Cookies.get("token");
  return token;
}

const configHeader = {
  headers :   {
    Authorization: `Bearer ${getToken()}`
  }
}

export { LogIn, isLogin, getToken, configHeader };
