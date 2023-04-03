import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export function handleResponse(response, successMessage, errorMessage) {
  if (response.status >= 200 && response.status < 300) {
    console.log(successMessage);
    return response.data;
  } else {
    console.log(errorMessage);
    return null;
  }
}

export async function apiWrapper(apiCall, successMessage, errorMessage) {
  try {
    const response = await apiCall();
    return handleResponse(response, successMessage, errorMessage);
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}

export { axiosInstance };
