import { axiosInstance } from "./Service";
import { apiWrapper } from "./Service";

export async function getWarehouseItems() {
  return apiWrapper(
    async () => await axiosInstance.get("/warehouseItems"),
    "Warehouse items fetched successfully",
    "An error occurred while fetching warehouse items:"
  );
}

export async function getWarehouseItemById(id) {
  return apiWrapper(
    async () => await axiosInstance.get(`/warehouseItems/${id}`),
    "Warehouse item fetched successfully",
    "An error occurred while fetching warehouse item by ID:"
  );
}
