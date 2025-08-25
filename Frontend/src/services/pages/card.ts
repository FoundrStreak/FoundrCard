import apiClient from "@/utils/api";
import { CARD_URL } from "@/constants/api.routes";

const fetchCardData = async () => {
    const { data } = await apiClient.get(`${CARD_URL}/`);
    return data;
};

export default fetchCardData;