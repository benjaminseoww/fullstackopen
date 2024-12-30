import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const baseUrl = backendURL + "/api/blogs";

let token: string | null = null;

function setToken(newToken: string) {
  token = `Bearer ${newToken}`;
}

async function getAllBlogs() {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
}

async function getBlog(id: string) {
  const request = axios.get(baseUrl + "/" + id);
  return request.then((response) => response.data);
}

async function createBlog(title: string, author: string, url: string) {
  const request = axios.post(
    baseUrl,
    { author, title, url },
    {
      headers: { authorization: token },
    },
  );
  return request.then((response) => response.data);
}

async function likeBlog(id: string) {
  const request = axios.put(
    baseUrl + "/" + id,
    { incrementLikes: 1 },
    {
      headers: { authorization: token },
    },
  );
  return request.then((response) => response.data);
}

async function deleteBlog(id: string) {
  const request = axios.delete(baseUrl + "/" + id, {
    headers: { authorization: token },
  });
  return request.then((response) => response.data);
}

export default { getAllBlogs, getBlog, setToken, createBlog, likeBlog, deleteBlog };
