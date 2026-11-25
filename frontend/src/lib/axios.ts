import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({ baseURL: BASE_URL, withCredentials: true }); // send the login cookie

// Session expired while using the app: go back to login.
// /auth/* is skipped because a 401 there is expected (wrong password, not logged in yet).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? "";
    if (error.response?.status === 401 && !url.startsWith("/auth")) {
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
