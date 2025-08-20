import apiClient from "@/utils/api";
import { USER_PROFILE_URL,  } from "@/constants/api.routes";
import type { UserProfile } from "@/types/auth";

export const getUserProfileData = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>(USER_PROFILE_URL);
  return data;
};