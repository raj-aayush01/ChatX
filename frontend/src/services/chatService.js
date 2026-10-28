import api from "./api" ;

export const getChats = async () => {
    const response = await api.get("/chats") ;
    return response.data.chats ;
}

export const getChatById = async (chatId) => {
    const response = await api.get(`/chats/${chatId}`) ;
    return response.data ;
}