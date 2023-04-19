import { axiosInstance, apiWrapper } from "./Service";

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
  const response = await apiWrapper(
    () =>
      axiosInstance.post("/register", {
        email,
        username,
        year,
        password,
        confirmPassword,
      }),
    "Registration successful",
    "Registration failed"
  );
  return response !== null;
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

    // Check for invalid username or password error
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid username or password");
    } else {
      throw new Error("An error occurred, please try again later");
    }
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
