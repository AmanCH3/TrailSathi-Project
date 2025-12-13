import axios from "./api";

export const sendChatQueryApi = (data) => {
  return axios.post("v1/chatbot/query", data);
};