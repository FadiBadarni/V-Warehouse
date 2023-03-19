import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/admin",
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

export const addEquipmentItem = async (item) => {
  try {
    const response = await axiosInstance.post("/add-item", item);
    return response.data;
  } catch (error) {
    console.error("Error adding equipment item:", error);
    return null;
  }
};

export { axiosInstance };
