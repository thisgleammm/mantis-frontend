import { apiFetch } from "./apiClient";
import type { LoginResponse, RegisterResponse, UserResponse, LogoutResponse } from "../types/auth";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async (): Promise<LogoutResponse> => {
  // Clear client-side cookies
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  return apiFetch<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
};

export const register = async (
  username: string,
  name: string,
  email: string,
  password: string,
  phone_number: string
): Promise<RegisterResponse> => {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, name, email, password, phone_number }),
  });
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  return apiFetch<UserResponse>("/users/me");
};