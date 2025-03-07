import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { User } from "@/context/UserContext";
// Handles refreshing the access token
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) {
    window.location.href = "/login";
    // throw new Error("Refresh token is missing. User must log in again.");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/token/refresh`,
      { refresh: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newAccessToken = response.data.access;
    localStorage.setItem("access", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    throw new Error("Token refresh failed. User must log in again.");
  }
};

// Wrapper function for requests with automatic token management
export const fetchWithAuth = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const accessToken = localStorage.getItem("access");

  // Add the Authorization header to the request
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const newAccessToken = await refreshAccessToken();

      // Update Authorization header with the new token
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      const retryResponse = await axios.request<T>(config);
      return retryResponse.data;
    }

    throw error;
  }
};

export type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const url = `${import.meta.env.VITE_API_URL}/api/token/`;
  const data = {
    username: email,
    password,
  };

  try {
    const response = await axios.post<LoginResponse>(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    return response.data; // Access and refresh tokens
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ detail: string }>;
      console.error(
        "Error during login:",
        axiosError.response?.data?.detail || axiosError.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
};

type RegisterResponse = {
  username: string;
  id: number;
  email: string;
  courses: [];
};

export const register = async (
  username: string,
  password: string,
  email: string
): Promise<RegisterResponse> => {
  const url = `${import.meta.env.VITE_API_URL}/api/register/`;
  const data: RegisterRequest = {
    username,
    password,
    email,
  };

  try {
    const response = await axios.post<RegisterResponse>(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Access and refresh tokens
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ detail: string }>;
      console.error(
        "Error during login:",
        axiosError.response?.data?.detail || axiosError.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/`;
    const user = await fetchWithAuth<User>({ url, method: "GET" });
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getUserInfo = async (id: string | number): Promise<User> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/${id}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<User> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/change-password`;
    const user = await fetchWithAuth<User>({
      url,
      method: "PATCH",
      data: { oldPassword, newPassword },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editUser = async (user: FormData): Promise<User> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/`;
    const editedUser = await fetchWithAuth<User>({
      url,
      method: "PATCH",
      data: user,
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return editedUser;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
export type UsersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
};
export const getAllUsers = async (search?: string): Promise<UsersResponse> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/all?search=${
      search || ""
    }`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};