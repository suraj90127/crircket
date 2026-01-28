import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:5001/api",
    // baseURL: "https://aura444.org/api",
});

export default api;


export const host = "ws://localhost:5001";
// export const host = "https://aura444.org/";
