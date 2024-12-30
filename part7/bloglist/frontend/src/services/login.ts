import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const baseUrl = backendURL + "/api/login";

export default class loginService {
  static async login(usernameString: string, passwordString: string) {
    console.log(baseUrl);

    const response = await axios.post(baseUrl, {
      username: usernameString,
      password: passwordString,
    });

    return response.data;
  }
}
