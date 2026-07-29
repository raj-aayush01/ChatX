import "./MessageBubble.css";

const MessageBubble = ({ msg, isMine, onDeleteMessage }) => {
    return (
        <div
            className={`message-bubble ${
                isMine ? "sent" : "received"
            }`}
        >
            <div className="message-content-wrapper">
                <p className="message-text">
                    {msg.content}
                </p>

                {onDeleteMessage && (
                    <button
                        className="msg-delete-btn"
                        title="Delete for Everyone"
                        onClick={() => onDeleteMessage(msg._id)}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                )}
            </div>

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