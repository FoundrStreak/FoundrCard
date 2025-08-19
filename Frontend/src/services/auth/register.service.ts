import apiClient from "@/utils/api";
import { storeAuthTokens, storeUserData } from "@/utils/auth";
import type { RegisterFormData, RegisterResponse } from "@/types/auth";
import { REGISTER_URL } from "@/constants/api.routes";
import { fetchUserData } from "./fetchUser.service";

export const registerUser = async (
  data: RegisterFormData
): Promise<RegisterResponse> => {
  const { data: registerResponse } = await apiClient.post(REGISTER_URL, {
    email: data.email,
    password1: data.password,
    password2: data.confirmPassword,
  });
  if (registerResponse.error) {
    console.log("Registration failed");
    throw new Error(registerResponse.error);
  }
  storeAuthTokens(registerResponse.access, registerResponse.refresh);
  await storeUserData(await fetchUserData());
  return registerResponse;
};
