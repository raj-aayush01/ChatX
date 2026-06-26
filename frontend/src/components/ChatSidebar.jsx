import "./ChatSidebar.css";

const ChatSidebar = ({
    chats,
    currentUser,
    search,
    handleSearch,
    searchResults,
    handleUserSelect,
    setSelectedChat,
    selectedChat,
}) => {
    return (
        <div className="chat-sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">ChatX</h2>
            </div>

            <div className="sidebar-search">
                <div className="search-wrapper">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div
                            key={user._id}
                            className="user-item"
                            onClick={() => handleUserSelect(user)}
                        >
                            <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                                <div className="user-name">{user.name}</div>
                                <div className="user-last-msg">{user.email}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {search.trim() === "" && (
                <div className="user-list">
                    {chats.map((chat) => {
                        const otherUser = chat.users.find(
                            (user) => user._id !== currentUser._id
                        );
                        const isActive = selectedChat?._id === chat._id;

                        return (
                            <div
                                key={chat._id}
                                className={`user-item ${isActive ? "active" : ""}`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <div className={`user-avatar ${isActive ? "avatar-active" : ""}`}>
                                    {otherUser?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-info">
                                    <div className="user-name-row">
                                        <span className="user-name">{otherUser?.name}</span>
                                    </div>
                                    <div className="user-last-msg">
                                        {chat.latestMessage?.content || "No messages yet"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;