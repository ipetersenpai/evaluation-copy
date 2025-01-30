import axios from "axios";
import Cookies from "js-cookie";

const Token = Cookies.get("token");
axios.defaults.baseURL = "http://127.0.0.1:8000/api";
axios.defaults.headers.common["Authorization"] = Token;
axios.defaults.headers.post['Content-Type'] = 'application/json';
export default axios;
