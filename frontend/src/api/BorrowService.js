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

export async function getAllStartTime(localDateTime, itemIds) {
  return apiWrapper(
    () =>
      axiosInstance.get("/borrow-requests/get_all_start_time", {
        params: {
          localDateTime: localDateTime,
          itemIds: itemIds.toString(),
        },
      }),
    "Start time fetched successfully",
    "An error occurred while fetching start time:"
  );
}

export async function getAllRetrunTime(
  startTime,
  returnTime,
  itemIds,
  itemInstances
) {
  const params = {
    localDateTimeStart: startTime,
    localDateTimeReturn: returnTime,
    itemIds: itemIds,
    itemInstances: itemInstances,
  };

  return apiWrapper(
    () => axiosInstance.post("/borrow-requests/get_all_return_time", params),
    "Start time fetched successfully",
    "An error occurred while fetching start time:"
  );
}

export async function cancelBorrowRequest(requestId) {
  return apiWrapper(
    () => axiosInstance.put(`/borrow-requests/${requestId}/cancel`),
    "Borrow request cancelled successfully",
    "Failed to cancel borrow request"
  );
}

export async function transferOwnership(requestId, newOwner) {
  return apiWrapper(
    () => axiosInstance.put(`/transferOwnership/${requestId}/${newOwner}`),
    "transfer Ownership successfully",
    "Failed to transfer Ownership"
  );
}


export const getAllUsersNameAndID = async () => {
  return apiWrapper(
    () => axiosInstance.get("/get_all_users_username_and_Id"),
    "All Users requests fetched successfully",
    "All Users to fetch users requests"
  );
};