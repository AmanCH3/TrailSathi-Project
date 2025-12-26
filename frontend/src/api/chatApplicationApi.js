import api from "./api"; 

export const getMessagesForGroup = async (groupId) => {
  try {
    const response = await api.get(`/messages/${groupId}`);
  
    return response.data.data;
  } catch (error) {
  
    console.error("API error fetching messages:", error);
    throw new Error("Failed to fetch messages from API.");
  }
};

export const createConversation = async (data) => {
    try {
        const response = await api.post('/conversations', data);
        return response.data.data.conversation;
    } catch (error) {
        console.error("API error creating conversation:", error);
        throw new Error("Failed to create conversation.");
    }
};