import api from "./api";

export const fetchChats = async () => {
    const response = await api.get("/chats");
    return response.data;
};

export const accessChat = async (userId) => {
    const response = await api.post("/chats", {
        userId,
    });

    return response.data;
};