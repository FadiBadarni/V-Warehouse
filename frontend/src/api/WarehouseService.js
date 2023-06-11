import { axiosInstance, apiWrapper } from "./Service";

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

export async function getWarehouseItemsByIds(ids) {
  return apiWrapper(
    async () => await axiosInstance.get(`/warehouseItemsByIds?ids=${ids}`),
    "Warehouse items fetched successfully",
    "An error occurred while fetching warehouse items by IDs:"
  );
}

export async function fetchedItemTypes() {
  return apiWrapper(
    async () => await axiosInstance.get(`/itemTypes`),
    "Warehouse types fetched successfully",
    "An error occurred while fetching warehouse item by ID:"
  );
}

//can delete it  but you must to delete in java too
export async function itemInstancesCountById(id) {
  return apiWrapper(
    async () => await axiosInstance.get(`/quantityItemsByType/${id}`),
    "Warehouse item fetched successfully",
    "An error occurred while fetching warehouse item by ID:"
  );
}

export async function getCountInstancesTime(id) {
  return apiWrapper(
    async () => await axiosInstance.get(`/getCountInstancesTime/${id}`),
    "Warehouse item fetched successfully",
    "An error occurred while fetching warehouse item by ID:"
  );
}

export async function getWarehouseRoomItems() {
  return apiWrapper(
    async () => await axiosInstance.get(`/warehouseRoomItems/`),
    "Warehouse  Room item fetched successfully",
    "An error occurred while fetching warehouse item by ID:"
  );
}
