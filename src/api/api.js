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

function handleResponse(response, successMessage, errorMessage) {
  if (response.status >= 200 && response.status < 300) {
    console.log(successMessage);
    return response.data;
  } else {
    console.log(errorMessage);
    return null;
  }
}

export async function registerUser(
  email,
  username,
  year,
  password,
  confirmPassword
) {
  try {
    const response = await axiosInstance.post("/register", {
      email,
      username,
      year,
      password,
      confirmPassword,
    });

    return handleResponse(
      response,
      "Registration successful",
      "Registration failed"
    );
  } catch (error) {
    console.error("An error occurred during registration:", error);
    return false;
  }
}

export async function loginUser(username, password) {
  try {
    const response = await axiosInstance.post("/login", {
      username,
      password,
    });

    if (response.status === 200) {
      console.log("Login successful");
      return {
        token: response.data.token,
        userInfo: response.data.userInfo, // Return userInfo object as part of the result
      };
    } else {
      console.log("Login failed");
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    const response = await axiosInstance.get("/logout");
    handleResponse(response, "Logout successful", "Logout failed");
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
  if (response.status === 403 || response.status === 401) {
    return { status: "TokenExpired" };
  }
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

export const translateText = async (text, targetLanguage) => {
  try {
    const apiKey = "AIzaSyARi94taMPUOMUWQiQVjvosqJpMO8rontE";
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLanguage,
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};

export { axiosInstance };
