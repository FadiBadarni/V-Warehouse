import { axiosInstance } from "./Service";

export async function getWarehouseItems() {
  try {
    const response = await axiosInstance.get("/warehouseItems");
    if (response.status === 200) {
      console.log("Warehouse itemss fetched successfully");
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

export async function getWarehouseItemById(id) {
  try {
    const response = await axiosInstance.get(`/warehouseItems/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch warehouse item");
      return null;
    }
  } catch (error) {
    console.error(
      "An error occurred while fetching warehouse item by ID:",
      error
    );
    return null;
  }
}
