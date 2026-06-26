import api from "./api";

export const fetchMessages = async (chatId) => {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
};

export const sendMessage = async (content, chatId) => {
    const response = await api.post("/messages", {
        content,
        chatId,
    });

    return response.data;
};