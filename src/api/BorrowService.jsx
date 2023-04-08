import { axiosInstance, apiWrapper } from "./Service";

export async function getBorrowRequests() {
  return apiWrapper(
    () => axiosInstance.get("/borrow-requests"),
    "Borrow requests fetched successfully",
    "Failed to fetch borrow requests"
  );
}

export async function sendBorrowRequest(borrowRequestData) {
  return apiWrapper(
    () => axiosInstance.post(`/borrow-requests`, borrowRequestData),
    "Borrow request sent successfully",
    "An error occurred while sending borrow request:"
  );
}

export async function getPendingBorrowRequestsByItemInstance(itemInstanceId) {
  return apiWrapper(
    () => axiosInstance.get(`/borrow-requests/pending/${itemInstanceId}`),
    "Pending borrow requests fetched successfully",
    "Failed to fetch pending borrow requests"
  );
}

export async function getAllOccupiedDates(itemInstanceIds) {
  if (!Array.isArray(itemInstanceIds)) {
    itemInstanceIds = [itemInstanceIds];
  }
  if (itemInstanceIds.length === 0) {
    throw new Error("Invalid itemInstanceIds parameter");
  }

  return apiWrapper(
    () =>
      axiosInstance.get(`/borrow-requests/occupied-dates`, {
        params: { itemInstanceIds: itemInstanceIds.join(",") },
      }),
    "Occupied Dates fetched successfully",
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
