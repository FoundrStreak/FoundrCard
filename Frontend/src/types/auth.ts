import z from "zod";

export interface User {
  pk: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

// Zod validation schema for LoginSchema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface GoogleLoginData {
  access_token: string;
}

export interface GoogleResponse {
  access_token: string;
  refresh_token: string;
  user_id: number;
  email: string;
  is_staff: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  user: {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  access_token: string;
  refresh_token: string;
}

export type LogoutResponse = {
  detail: string;
};

