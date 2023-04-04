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
export async function fetchedItemTypes() {
  return apiWrapper(
    async () => await axiosInstance.get(`/itemTypes`),
    "Warehouse item fetched successfully",
    "An error occurred while fetching warehouse item by ID:"
  );
}

  export async function fetchedQuantityItemsByTypeId(id) {
    return apiWrapper(
      async () => await axiosInstance.get(`/quantityItemsByType/${id}`),
      "Warehouse item fetched successfully",
      "An error occurred while fetching warehouse item by ID:"
    );

}




