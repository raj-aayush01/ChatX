import "./ChatHeader.css";

const ChatHeader = ({
    selectedUser,
    isOnline,
}) => {
    return (
        <div className="chat-header">
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
                        isOnline
                            ? "online"
                            : "offline"
                    }`}
                >
                    {isOnline
                        ? "Online"
                        : "Offline"}
                </span>
                
            </div>
        </div>
    );
};

export default ChatHeader;