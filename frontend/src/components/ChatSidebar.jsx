import "./ChatSidebar.css";

const ChatSidebar = ({
    chats,
    currentUser,
    search,
    setSearch,
    setSelectedChat,
    selectedChat,
}) => {
    return (
        <div className="chat-sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">
                    ChatX
                </h2>
            </div>

            <div className="sidebar-search">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            <div className="user-list">
                {chats.map((chat) => {
                    const otherUser = chat.users.find(
                        (user) =>
                            user._id !==
                            currentUser._id
                    );

                    return (
                        <div
                            key={chat._id}
                            className={`user-item ${
                                selectedChat?._id === chat._id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className="user-avatar">
                                {otherUser?.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="user-info">
                                <div className="user-name">
                                    {otherUser?.name}
                                </div>

                                <div className="user-last-msg">
                                    {chat.latestMessage?.content ||
                                        "No messages yet"}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChatSidebar;