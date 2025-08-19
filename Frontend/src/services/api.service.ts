import apiClient from "@/utils/api";
import { getRefreshToken, storeAuthTokens } from "@/utils/auth";
import { TOKEN_REFRESH_URL } from "@/constants/api.routes";

export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  const { data } = await apiClient.post(TOKEN_REFRESH_URL, {
    refresh: refreshToken,
  });
  if (data.error) {
    return false;
  }
  storeAuthTokens(data.access, data.refresh);

  return data.access;
};