import "./MessageBubble.css";

const MessageBubble = ({ msg, isMine }) => {
    return (
        <div
            className={`message-bubble ${
                isMine ? "sent" : "received"
            }`}
        >
            <p className="message-text">
                {msg.content}
            </p>

            <div className="message-footer">
                <span className="message-time">
                    {new Date(
                        msg.createdAt
                    ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;