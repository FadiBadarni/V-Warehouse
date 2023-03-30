import { axiosInstance } from "./Service";

export async function sendBorrowRequest(borrowRequestData) {
  try {
    const response = await axiosInstance.post(
      `/borrow-requests`,
      borrowRequestData
    );
    console.log(borrowRequestData);
    if (response.status === 201) {
      console.log("Borrow request sent successfully");
      return response.data;
    } else {
      console.log("Failed to send borrow request");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while sending borrow request:", error);
    return null;
  }
}
