import apiClient from "@/utils/api";
import { LOGOUT_URL } from "@/constants/api.routes";
import type { LogoutResponse } from "@/types/auth";
import { clearAuthTokens } from "@/utils/auth";
import { getRefreshToken } from "@/utils/auth";

export const Logout = async (): Promise<boolean> => {
  try {
    await apiClient.post<LogoutResponse>(LOGOUT_URL, {
      refresh: getRefreshToken(),
    });

    clearAuthTokens();
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};
