import "./MessageBubble.css" ;

function MessageBubble ({ messageId, message, createdAt, isOwnMessage }) {
    const messageTime = new Date(createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit" ,
        minute: "2-digit",
        hour12: true
    });

    return (
        <div id={`message-${messageId}`} className={isOwnMessage ? "message-bubble-own" : "message-bubble-received"}>
            <p className="message-text">{message}</p>
            <div className="message-meta">
                <span className="message-time">{messageTime}</span>
            </div>
        </div>
    )

}

export default MessageBubble ;