import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
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

export async function apiWrapper(apiCall, successMessage, errorMessage) {
  try {
    const response = await apiCall();
    if (response.status >= 200 && response.status < 300) {
      console.log(successMessage);
      return response.data;
    } else {
      console.log(errorMessage);
      return null;
    }
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}

export { axiosInstance, apiWrapper };
