import { axiosInstance, apiWrapper } from "./Service";

export async function sendBorrowRequest(borrowRequestData) {
  return apiWrapper(
    () => axiosInstance.post(`/borrow-requests`, borrowRequestData),
    "Borrow request sent successfully",
    "An error occurred while sending borrow request:"
  );
}
