import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export async function registerUser(email, password, confirmPassword, role) {
  try {
    const response = await axios.post("http://localhost:8080/api/register", {
      email,
      password,
      confirmPassword,
      role,
    });

    if (response.status === 200) {
      console.log("Registration successful");
      return true;
    } else {
      console.log("Registration failed");
      return false;
    }
  } catch (error) {
    console.error("An error occurred during registration:", error);
    return false;
  }
}

export async function loginUser(email, password, login) {
  try {
    const response = await axios.post("http://localhost:8080/api/login", {
      email: email,
      password: password,
    });

    if (response.status === 200) {
      console.log("Login successful");
      window.localStorage.setItem("token", response.data.token);
      // Update the isAuthenticated state after login
      login(response.data.token);
      return {
        token: response.data.token,
        userInfo: response.data.userInfo, // Return userInfo object as part of the result
      };
    } else {
      console.log("Login failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function logoutUser() {
  try {
    const response = await axios.get("/api/logout");
    if (response.status === 200) {
      console.log("Logout successful");
    } else {
      console.log("Logout failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export const getUserInfo = async () => {
  const token = window.localStorage.getItem("token");
  const response = await fetch("/api/v1/userInfo", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    window.localStorage.setItem("userId", data.id);
    return data;
  } else {
    throw new Error("Failed to fetch user info");
  }
};
export function getUserIdFromLocalStorage() {
  return localStorage.getItem("userId");
}
export async function getWarehouseItems() {
  try {
    const response = await axiosInstance.get("/warehouseItems");
    if (response.status === 200) {
      console.log("Warehouse items fetched successfully");
      console.log(response.data);
      return response.data;
    } else {
      console.log("Failed to fetch warehouse items");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching warehouse items:", error);
    return [];
  }
}

export async function getWarehouseItemById(id) {
  try {
    const response = await axiosInstance.get(`/warehouseItems/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch warehouse item");
      return null;
    }
  } catch (error) {
    console.error(
      "An error occurred while fetching warehouse item by ID:",
      error
    );
    return null;
  }
}
export async function getUserNotifications(userId) {
  try {
    const response = await axiosInstance.get(`/notifications/${userId}`);
    if (response.status === 200) {
      console.log("User notifications fetched successfully");
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

export { axiosInstance };
