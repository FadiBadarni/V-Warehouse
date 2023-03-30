import { axiosInstance } from "./Service";

export async function getUserNotifications(userId) {
  try {
    const response = await axiosInstance.get(`/notifications/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch user notifications");
      return [];
    }
  } catch (error) {
    console.error(
      "An error occurred while fetching user notifications:",
      error
    );
    return [];
  }
}
export async function clearUserNotifications(userId) {
  try {
    const response = await axiosInstance.delete(`/notifications/${userId}`);
    if (response.status === 204) {
      console.log("User notifications cleared successfully");
    } else {
      console.log("Failed to clear user notifications");
    }
  } catch (error) {
    console.error(
      "An error occurred while clearing user notifications:",
      error
    );
  }
}
export async function markNotificationsAsRead(userId) {
  try {
    const response = await axiosInstance.put(`/notifications/read/${userId}`);
    if (response.status === 200) {
      console.log("Notifications marked as read successfully");
    } else {
      console.log("Failed to mark notifications as read");
    }
  } catch (error) {
    console.error(
      "An error occurred while marking notifications as read:",
      error
    );
  }
}
