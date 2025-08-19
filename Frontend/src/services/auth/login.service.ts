import apiClient from "@/utils/api";
import { storeAuthTokens, storeUserData } from "@/utils/auth";
import type {
  LoginFormData,
} from "@/types/auth";
import type { LoginResponse } from "@/types/auth";
import { LOGIN_URL } from "@/constants/api.routes";
import { fetchUserData } from "./fetchUser.service";

export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const { data: loginResponse } = await apiClient.post(LOGIN_URL, data);
  if (loginResponse.error) {
    console.log("Login failed");
    throw new Error(loginResponse.error);
  }
  storeAuthTokens(loginResponse.access, loginResponse.refresh);
  await storeUserData(await fetchUserData());
  return loginResponse;
};

