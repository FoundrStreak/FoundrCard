import apiClient from "@/utils/api";
import { USER_DATA_URL } from "@/constants/api.routes";
import type { User } from "@/types/auth";

export const fetchUserData = async (): Promise<User> => {
    const { data } = await apiClient.get<User>(USER_DATA_URL);
    return data;
};