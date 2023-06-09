import axios from "axios";
import { getWarehouseItemById } from "./WarehouseService";
import { apiWrapper } from "./Service";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ADMIN_BASE_URL,
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
  return apiWrapper(
    () => axiosInstance.get(`/item-by-name/${name}`),
    "Item fetched successfully",
    "Error fetching item by name:"
  );
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

export const getAllUsers = async (formData) => {
  return apiWrapper(
    () => axiosInstance.get("/all-users"),
    "All Users requests fetched successfully",
    "All Users to fetch users requests"
  );
};

export const importUsers = async (formData) => {
  return apiWrapper(
    () =>
      axiosInstance.post("/importUsers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    "Users imported successfully",
    "Error importing users:"
  );
};

export const createUser = async (recipient, role, year) => {
  return apiWrapper(
    () => axiosInstance.put(`/create-user`, { recipient, role, year }),
    "Users imported successfully",
    "Error importing users:"
  );
};

export const updateUser = async (id, email, username, role, year) => {
  return apiWrapper(
    () =>
      axiosInstance.put(`/update-user/${id}`, { email, username, role, year }),
    "User updated successfully",
    "Error updating user:"
  );
};

export const deleteUser = async (id) => {
  return apiWrapper(
    () => axiosInstance.delete(`/delete-user/${id}`),
    "User Deleted successfully",
    "Error Deleting user:"
  );
};

export async function getBorrowRequests() {
  return apiWrapper(
    () => axiosInstance.get("/borrow-requests"),
    "Borrow requests fetched successfully",
    "Failed to fetch borrow requests"
  );
}

export async function getUserById(userId) {
  return apiWrapper(
    () => axiosInstance.get(`/userInfo/${userId}`),
    "User data fetched successfully",
    "An error occurred while fetching user data:"
  );
}

export async function updateRequestStatus(requestId, newStatus) {
  return apiWrapper(
    () =>
      axiosInstance.put(`/borrow-requests/${requestId}?status=${newStatus}`),
    "Borrow request status updated successfully",
    "An error occurred while updating borrow request status:"
  );
}

export async function addItemInstances(requestId, itemInstances) {
  return apiWrapper(
    () =>
      axiosInstance.put(
        `/borrow-additemInstances/${requestId}?itemInstances=${itemInstances}`
      ),
    "Borrow request status updated successfully",
    "An error occurred while updating borrow request status:"
  );
}

export const broadcastMessageToAllUsers = async (message) => {
  return apiWrapper(
    async () =>
      await axiosInstance.post("/broadcast", null, { params: { message } }),
    "Broadcast message sent successfully",
    "Error sending broadcast message:"
  );
};

export const updateEquipmentItem = async (
  instanceId,
  instanceState,
  instanceType
) => {
  return apiWrapper(
    async () =>
      await axiosInstance.put("/update-item", {
        instanceId,
        instanceState,
        instanceType,
      }),
    "Equipment item updated successfully",
    "Error updating equipment item:"
  );
};

export const searchForSeralNumber = async (seralNumber) => {
  return apiWrapper(
    async () => await axiosInstance.get(`/search-serial-number/${seralNumber}`),
    "Serial number found successfully",
    "Error searching for serial number:"
  );
};

export const getImg = async (image) => {
  return apiWrapper(
    async () => await axiosInstance.get(`/data_ulr/${image}`),
    "img found successfully",
    "Error searching for img:"
  );
};

export { axiosInstance };
