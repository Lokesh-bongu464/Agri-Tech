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

/**
 * Initialize Axios interceptors.
 * @param {function} setLoadingFn - Function to set loading state.
 * @param {function} setErrorFn - Function to set global error state.
 */
export const initializeApiInterceptors = (setLoadingFn, setErrorFn) => {
  setAppErrorGlobal = setErrorFn;

  // Eject existing interceptors if any
  if (requestInterceptorId !== null) {
    api.interceptors.request.eject(requestInterceptorId);
  }
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
  }

  // Request interceptor to add auth header and clear errors on new requests
  requestInterceptorId = api.interceptors.request.use(
    (config) => {
      setAppErrorGlobal(null);
      const token = localStorage.getItem("jwtToken"); // <-- Use localStorage here
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(
        "Axios Request URL (from interceptor):",
        `${config.baseURL}${config.url}`
      );
      return config;
    },
    (error) => {
      setAppErrorGlobal(error.message || "Request failed.");
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors globally
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

      // Handle 401 Unauthorized or 403 Forbidden: force logout
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Clear stored auth info
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");

        // Optionally clear more app-level auth state here by calling auth context logout if available

        // Redirect user to login page
        window.location.href = "/ulogin"; // Adjust to your login route
      }

      return Promise.reject(error);
    }
  );
};

export default api;
