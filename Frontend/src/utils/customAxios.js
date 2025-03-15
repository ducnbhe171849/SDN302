import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1";

export const customFetch = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // allow to pass with cookies
});
