import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  auth: {
    username: "hospitaluser",
    password: "Hospital@123",
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;