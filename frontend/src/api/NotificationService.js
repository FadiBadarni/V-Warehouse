import { axiosInstance, apiWrapper } from "./Service";

export async function getUserNotifications(userId) {
  return apiWrapper(
    () => axiosInstance.get(`/notifications/${userId}`),
    "User notifications fetched successfully",
    "An error occurred while fetching user notifications:"
  );
}

export async function clearUserNotifications(userId) {
  return apiWrapper(
    () => axiosInstance.delete(`/notifications/${userId}`),
    "User notifications cleared successfully",
    "An error occurred while clearing user notifications:"
  );
}

export async function markNotificationsAsRead(userId) {
  return apiWrapper(
    () => axiosInstance.put(`/notifications/read/${userId}`),
    "Notifications marked as read successfully",
    "An error occurred while marking notifications as read:"
  );
}

export async function sendToAdminsNotifications(message) {
  return apiWrapper(
    () => axiosInstance.put(`/sendToAdminsNotifications/${message}`),
    "Notifications marked as read successfully",
    "An error occurred while marking notifications as read:"
  );
}
