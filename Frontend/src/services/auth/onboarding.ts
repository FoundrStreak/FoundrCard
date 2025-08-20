import apiClient from "@/utils/api";
import { USER_PROFILE_URL } from "@/constants/api.routes";
import type { User } from "@/types/auth";

export const updateUsernameData = async (
  newUsername: string
): Promise<User> => {
  const usernameData = {
    username: newUsername.toLowerCase().trim().toString(),
  };
  const { data } = await apiClient.patch<User>(USER_PROFILE_URL, usernameData);
  return data;
};
