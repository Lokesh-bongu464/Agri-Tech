import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";

console.log("API_BASE_URL in api.js:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let setAppErrorGlobal = (errorMessage) => {};

let requestInterceptorId = null;
let responseInterceptorId = null;

export const initializeApiInterceptors = (setLoadingFn, setErrorFn) => {
  setAppErrorGlobal = setErrorFn;

  if (requestInterceptorId !== null) {
    api.interceptors.request.eject(requestInterceptorId);
  }
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
  }

  requestInterceptorId = api.interceptors.request.use(
    (config) => {
      setAppErrorGlobal(null);
      const token = localStorage.getItem("jwtToken"); // <-- Use localStorage here
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(
        "Axios Request URL (from interceptor):",
        config.baseURL + config.url
      );
      return config;
    },
    (error) => {
      setAppErrorGlobal(error.message || "Request failed.");
      return Promise.reject(error);
    }
  );

  responseInterceptorId = api.interceptors.response.use(
    (response) => {
      setAppErrorGlobal(null);
      return response;
    },
    (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      setAppErrorGlobal(errorMessage);
      console.error(
        "API Response Error (from api.js interceptor):",
        error.response || error
      );

      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Optional: trigger logout action here if token is invalid/expired
      }
      return Promise.reject(error);
    }
  );
};

export default api;
