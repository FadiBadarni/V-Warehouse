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

// apiWrapper with custom error handling
export async function apiWrapper(apiCall, successMessage, errorMessage) {
  try {
    const response = await apiCall();

    if (response.status >= 200 && response.status < 300) {
      console.log(successMessage);
      return response.data;
    } else {
      throw new Error(`Error status: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `${errorMessage} (status: ${error.response.status})`,
        error.response.data
      );

      switch (error.response.status) {
        case 400:
          throw new Error("Bad Request");
        case 401:
          throw new Error("Unauthorized");
        case 403:
          throw new Error("Forbidden");
        case 404:
          throw new Error("Not Found");
        case 500:
          throw new Error("Internal Server Error");
        default:
          throw new Error("An unexpected error occurred");
      }
    } else {
      console.error(errorMessage, error);
      throw error;
    }
  }
}

export { axiosInstance };
