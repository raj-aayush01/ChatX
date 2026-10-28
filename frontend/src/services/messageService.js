import api from "./api" ;

export const getMessages = async ( chatId, cursorTime, cursorId ) => {
    const params = {} ;

    if(cursorTime && cursorId) {
        params.cursorTime = cursorTime ;
        params.cursorId = cursorId ;
    }

    const response = await api.get(`/messages/${chatId}`, { params }) ;

    return response.data ;
}