import api from "./api";

export const fetchChats = async () => {
    const response = await api.get("/chats");
    return response.data;
};