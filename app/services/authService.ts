const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const login = async (email: string, password: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

export const logout = async (): Promise<any> => {
  // Clear client-side cookies
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

export const register = async (
  username: string,
  name: string,
  email: string,
  password: string,
  phone_number: string
): Promise<any> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, email, password, phone_number }),
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Unauthorized");
  return response.json();
};