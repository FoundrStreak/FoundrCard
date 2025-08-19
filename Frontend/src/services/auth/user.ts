import apiClient from "@/utils/api";
import { CHECK_USERNAME_URL, CHECK_EMAIL_URL } from "@/constants/api.routes";

export const checkUsername = async (username: string) => {
  const { data } = await apiClient.get(CHECK_USERNAME_URL, {
    params: {
      username,
    },
  });
  return data.message;
};

export const checkEmail = async (email: string) => {
  const { data } = await apiClient.get(CHECK_EMAIL_URL, {
    params: {
      email: email,
    },
  });
  return data.available;
};
