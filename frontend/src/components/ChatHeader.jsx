import "./ChatHeader.css";

const ChatHeader = ({
    selectedUser,
    isOnline,
    isTyping,
    onDeleteChat
}) => {
    return (
        <div className="chat-header">
            <div className="chat-header-main">
                <div className="chat-header-avatar">
                    {selectedUser?.name
                        ?.charAt(0)
                        .toUpperCase()}
                </div>

                <div className="chat-header-info">
                    <span className="chat-header-name">
                        {selectedUser?.name}
                    </span>

                    <span
                        className={`chat-header-status ${
                            isTyping
                                ? "typing"
                                : isOnline
                                ? "online"
                                : "offline"
                        }`}
                    >
                        {isTyping
                            ? "Typing..."
                            : isOnline
                            ? "Online"
                            : "Offline"}
                    </span>
                </div>
            </div>

            {onDeleteChat && (
                <div className="chat-header-actions">
                    <button
                        className="chat-delete-btn"
                        title="Delete entire chat conversation"
                        onClick={onDeleteChat}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatHeader;