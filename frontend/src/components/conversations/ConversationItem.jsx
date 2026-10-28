function formatConversationTime(timestamp) {
    if(!timestamp) return "" ;

    const messageDate = new Date(timestamp) ;

    // Handling invalid dates
    if(Number.isNaN(messageDate.getTime())){
        return "" ;
    }

    const now = new Date() ;

    const isToday = 
        messageDate.getDate() === now.getDate() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear() ;

    if(isToday){
        return messageDate.toLocaleTimeString([], {
            hour: "numeric" ,
            minute: "2-digit" ,
            hour12: true
        }) ;
    }

    const yesterday = new Date(now) ;
    yesterday.setDate(now.getDate() - 1) ;

    const isYesterday = 
        messageDate.getDate() === yesterday.getDate() &&
        messageDate.getMonth() === yesterday.getMonth() &&
        messageDate.getFullYear() === yesterday.getFullYear() ;

    if(isYesterday) {
        return "Yesterday" ;
    }

    const isThisYear =
        messageDate.getFullYear() === now.getFullYear();

    return messageDate.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        ...(isThisYear ? {} : { year: "numeric" })
    });
}


function ConversationItem({ chat, isSelected, onClick }){
    const formattedTime = formatConversationTime(chat.time) ;

    return (
        <button
            className={`conversation-item ${isSelected ? "selected" : ""}`}
            onClick={onClick} 
            type="button"
        >
            <div className="conversation-avatar">
                {chat.name.charAt(0).toUpperCase()}
            </div>

            <div className="conversation-details">
                <div className="conversation-top">
                    <span 
                        className="conversation-name"
                    >
                        {chat.name}
                    </span>

                    <span 
                        className={`conversation-time ${chat.isOnline ? "online-status" : ""}`}
                    >   
                        {chat.isOnline ? "Online" : formattedTime}
                    </span>

                </div>

                <p className="conversation-message">{chat.lastMessage}</p>
            </div>

        </button>
    );
}

export default ConversationItem ;