export interface UserResponse {
  id: string;
  username: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
}

export interface RegisterResponse {
  id?: string;
  token?: string;
  message?: string;
  error?: string;
}

export interface LogoutResponse {
  message: string;
}

export interface GenericResponse {
  message: string;
}
