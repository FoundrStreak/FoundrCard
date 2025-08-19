import apiClient from "@/utils/api";
import type { GoogleLoginData, GoogleResponse } from "@/types/auth";
import { storeAuthTokens, clearAuthTokens } from "@/utils/auth";
import { GOOGLE_LOGIN_URL } from "@/constants/api.routes";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";


export const googleSuccess = async (
  credentials: GoogleLoginData, navigate: NavigateFunction, redirectTo: string
): Promise<GoogleResponse> => {
  clearAuthTokens();
  const { data: GoogleResponse } = await apiClient.post(GOOGLE_LOGIN_URL, {
    id_token: credentials,
  });
  storeAuthTokens(GoogleResponse.access, GoogleResponse.refresh);
  if (GoogleResponse.error) {
    console.log("Login failed");
    googleError();
    throw new Error(GoogleResponse.error);
  }
  storeAuthTokens(GoogleResponse.access, GoogleResponse.refresh);
  toast.success("Google Login Successful", {
    description: "Welcome back",
  });
  navigate(redirectTo)
  return GoogleResponse;
};

export const googleError = () => {
  toast.error("Google sign-up failed", {
    description: "Please try again or use email/password",
  });
};
