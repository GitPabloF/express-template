export interface RegisterData {
  name: string
  email: string
  password: string
  role?: "user" | "admin"
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: Record<string, any>
  token: string
  refreshToken: string
}

export interface TokenPayload {
  id: string
  email: string
  role: "user" | "admin"
}

