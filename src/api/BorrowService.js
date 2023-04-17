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
    () => axiosInstance.post(`/borrow-requests2`, borrowRequestData),
    "Borrow request sent successfully",
    "An error occurred while sending borrow request:"
  );
}

export async function getPendingBorrowRequestsByItemInstance(itemId) {
  return apiWrapper(
    () => axiosInstance.get(`/borrow-requests/pendingByItemId/${itemId}`),
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

export async function getScheduleByItemId(itemId) {
  return apiWrapper(
    () => axiosInstance.get(`borrow-requests/schedule/${itemId}`),
    "Item instances fetched successfully",
    "An error occurred while fetching item instances:"
  );
}

export async function findScheduleIdsByItemIdAndDate(id, date) {
  return apiWrapper(
    async () => await axiosInstance.get(`/indScheduleIdsByItemIdAndDate/${id}`, {params: {date: date}}),
    "Warehouse item fetched successfully",
    "An error occurred while fetching warehouse item by ID:"
  );
}
export async function getEveryTimeSchedule(quantity, localDateTime,itemId) {
  return apiWrapper(
    async () =>
      await axiosInstance.get(`/borrow-requests/get_every_time_schedule/${quantity}`, {
        params: { localDateTime: localDateTime ,itemId: itemId},
      }),
    "Every time schedule fetched successfully",
    "An error occurred while fetching every time schedule:"
  );
}

export async function getEveryTimeToReturnInSchedule(quantity, localDateTimeStart, localDateTimeReturn,itemId,data ) {
  return apiWrapper(
    async () =>
      await axiosInstance.post(`/borrow-requests/get_every_time_to-return/${quantity}?localDateTimeStart=${localDateTimeStart}&localDateTimeReturn=${localDateTimeReturn}&itemId=${itemId}`, data),
    "Every time schedule fetched successfully",
    "An error occurred while fetching every time schedule:"
  );
}