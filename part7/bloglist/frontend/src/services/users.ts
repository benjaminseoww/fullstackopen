import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const baseUrl = backendURL + "/api/users";

let token: string | null = null;

function setToken(newToken: string) {
  token = `Bearer ${newToken}`;
}

async function getAll() {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
}

async function get(id: string) {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
}

export default { getAll, get, setToken };