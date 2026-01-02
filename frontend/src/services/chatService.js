
import { sendChatQueryApi } from "../api/chatbotApi";

export const sendChatQueryService = async (data) => {
  try {
    const response = await sendChatQueryApi(data);
    return response.data; 
  } catch (err) {

    throw err.response?.data || { message: "Failed to get a response from TrailSathi." };
  }
};