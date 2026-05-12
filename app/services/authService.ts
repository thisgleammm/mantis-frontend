import { apiFetch } from "./apiClient";
import type { LoginResponse, RegisterResponse, UserResponse, LogoutResponse, GenericResponse } from "../types/auth";

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

export const forgotPassword = async (email: string): Promise<GenericResponse> => {
  return apiFetch<GenericResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token: string, password: string): Promise<GenericResponse> => {
  return apiFetch<GenericResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
};

export const confirmPassword = async (password: string): Promise<GenericResponse> => {
  return apiFetch<GenericResponse>("/auth/confirm-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
};