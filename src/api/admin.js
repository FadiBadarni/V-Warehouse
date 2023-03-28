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

export const importUsers = async (formData) => {
  try {
    const response = await axiosInstance.post("/importUsers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error importing users:", error);
    return null;
  }
};

export async function getUserById(userId) {
  try {
    const response = await axiosInstance.get(`/userInfo/${userId}`);
    if (response.status === 200) {
      console.log("User data fetched successfully");
      return response.data;
    } else {
      throw new Error(`Failed to fetch user data: Status ${response.status}`);
    }
  } catch (error) {
    console.error("An error occurred while fetching user data:", error);
    throw error;
  }
}

export async function getWarehouseRequests() {
  try {
    const response = await axiosInstance.get("/requests");
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch warehouse items");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching warehouse items:", error);
    return [];
  }
}

export { axiosInstance };
