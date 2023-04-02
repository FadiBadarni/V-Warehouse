import axios from "axios";
import { getWarehouseItemById } from "./WarehouseService";
import { apiWrapper } from "./Service";
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

// export const addEquipmentItem = async (item) => {
//   try {
//     const response = await axiosInstance.post("/add-item", item);
//     return response.data;
//   } catch (error) {
//     console.error("Error adding equipment item:", error);
//     return null;
//   }
// };

export const addEquipmentItem = async (item) => {
  return apiWrapper(
    async () => await axiosInstance.post("/add-item", item),
    "Equipment item added successfully",
    "Error adding equipment item:"
  );
};

export const fetchItemNames = async () => {
  return apiWrapper(
    async () => await axiosInstance.get("/item-names"),
    "Item names fetched successfully",
    "Error fetching item names:"
  );
};

export const getItemByName = async (name) => {
  try {
    const response = await axiosInstance.get(`/item-by-name/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item by name:", error);
    return null;
  }
};

export const getAllItemInstances = async () => {
  try {
    const response = await axiosInstance.get("/all-item-instances");
    const instances = response.data;

    const instancesWithDetails = await Promise.all(
      instances.map(async (instance) => {
        const item = await getWarehouseItemById(instance.itemId);
        return {
          ...instance,
          instanceId: instance.id,
          itemName: item.name,
          itemDescription: item.description,
          itemType: item.itemType,
          itemAttributes: item.itemAttributes,
        };
      })
    );

    return instancesWithDetails;
  } catch (error) {
    console.error("Error fetching item instances:", error);
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

export async function getBorrowRequests() {
  try {
    const response = await axiosInstance.get("/borrow-requests");
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch warehouse REQUESTS");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching warehouse items:", error);
    return [];
  }
}

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

export async function updateRequestStatus(requestId, newStatus) {
  try {
    const response = await axiosInstance.put(
      `/borrow-requests/${requestId}?status=${newStatus}`
    );

    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Failed to update borrow request status: Status ${response.status}`
      );
    }
  } catch (error) {
    console.error(
      "An error occurred while updating borrow request status:",
      error
    );
    throw error;
  }
}

export { axiosInstance };
