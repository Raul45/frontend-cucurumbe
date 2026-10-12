import { apiRequest } from "./api";
export interface MessageApi {
  message: string;
}

// LOGIN DATA 
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
// VALIDAR USUARIO POR REQ
export interface CurrentUser {
  userId: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/auth/me');
}

// LOGOUT
export async function logout(): Promise<MessageApi> {
  return apiRequest('/logout');
}