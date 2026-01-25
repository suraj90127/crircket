import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    // baseURL: "/api",
});

export default api;


export const host = "ws://localhost:5000";
// export const host = "/";