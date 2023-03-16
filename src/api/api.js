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
      return response.data;
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
    console.log("getUserInfo response data:", data);
    return data;
  } else {
    throw new Error("Failed to fetch user info");
  }
};

export { axiosInstance };
