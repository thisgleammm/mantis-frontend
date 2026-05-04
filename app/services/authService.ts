const BASE_URL = "https://mantis-backend.fly.dev/api/v1";

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