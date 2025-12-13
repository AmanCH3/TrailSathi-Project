// src/hooks/useChatbot.js
import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { sendChatQueryService } from '../services/chatService';


const formatHistoryForApi = (messages) => {
    return messages.slice(1).map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        text: msg.text,
    }));
};

export const useChatbot = () => {
    
    const [messages, setMessages] = useState([
        { text: 'Hey Hiker! I’m TrailMate. How can I help you navigate your next adventure today?', sender: 'bot' },
    ]);

    const mutation = useMutation({
        mutationKey: ['chatbot_query'],
        mutationFn: sendChatQueryService,
        
        onSuccess: (data) => {
            const botReply = data?.data?.reply;
            if (botReply) {
                const botMessage = { text: botReply, sender: 'bot' };
                setMessages(prev => [...prev, botMessage]);
            } else {
                toast.error("Received an empty response from the bot.");
            }
        },
        
        onError: (err) => {
            // The API call failed. `err` is the object thrown from the service.
            const errorMessage = err.message || "Oops! I seem to have lost the trail. Please try again.";
            toast.error(errorMessage);
            const errorBotMessage = { text: errorMessage, sender: 'bot' };
            setMessages(prev => [...prev, errorBotMessage]);
        }
    });

   
    const sendMessage = (userInput) => {
        if (!userInput.trim() || mutation.isPending) return;

        // 1. Add user's message to the UI immediately for a responsive feel.
        const userMessage = { text: userInput, sender: 'user' };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);

        // 2. Prepare the payload for the API.
        const history = formatHistoryForApi(currentMessages);
        const payload = { query: userInput, history };
        
        //  Trigger the mutation.
        mutation.mutate(payload);
    };

    return {
        // The state and functions the UI component will need:
        messages,
        sendMessage,
        isLoading: mutation.isPending, // Use `isPending` for loading state
        error: mutation.error,
    };
};