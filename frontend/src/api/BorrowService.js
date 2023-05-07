import { axiosInstance, apiWrapper } from "./Service";

export async function getBorrowRequests() {
  return apiWrapper(
    () => axiosInstance.get("/borrow-requests"),
    "Borrow requests fetched successfully",
    "Failed to fetch borrow requests"
  );
}

export async function createBorrowRequest(borrowRequestData) {
  return apiWrapper(
    () => axiosInstance.post(`/borrow-requests`, borrowRequestData),
    "Borrow request sent successfully",
    "An error occurred while sending borrow request:"
  );
}

export async function getItemInstancesByRequestId(requestId) {
  return apiWrapper(
    () => axiosInstance.get(`/borrow-requests/${requestId}/instances`),
    "Item instances fetched successfully",
    "An error occurred while fetching item instances:"
  );
}

export async function getItemsIdsByRequestId(requestId) {
  return apiWrapper(
    () => axiosInstance.get(`/borrow-requests/${requestId}/itemsIds`),
    "Items Ids fetched successfully",
    "An error occurred while fetching items Ids:"
  );
}

export async function getItemInstancesByItemId(itemId) {
  return apiWrapper(
    () => axiosInstance.get(`/items/${itemId}/instances`),
    "Item instances fetched successfully",
    "An error occurred while fetching item instances:"
  );
}

export async function cancelBorrowRequest(requestId) {
  return apiWrapper(
    () => axiosInstance.put(`/borrow-requests/${requestId}/cancel`),
    "Borrow request cancelled successfully",
    "Failed to cancel borrow request"
  );
}
