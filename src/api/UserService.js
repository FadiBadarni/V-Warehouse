import { axiosInstance } from "./Service";

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
        userInfo: response.data.userInfo,
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
  const response = await fetch("/api/userInfo", {
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
