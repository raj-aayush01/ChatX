import { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";
import { getChats } from "./../../services/chatService" ;
import { useAuth } from "../../context/AuthContext" ;
import "./ConversationList.css";

function ConversationList({ selectedChatId, onSelectedChat }) {
    const [chats, setChats] = useState([]) ;
    const [isLoading, setIsLoading] = useState(true) ;
    const [error, setError] = useState("") ;

    const { user, isAuthLoading } = useAuth();

    const fetchChats = async () => {
        try {
            setIsLoading(true) ;
            setError("") ;

            const data = await getChats() ;
            console.log(data) ;
            console.log("Current user:", user);
            setChats(data) ;

        } catch ( err ) {
            setError(
                err.response?.data?.message || "Failed to load coversations"
            ) ;

        } finally {
            setIsLoading(false) ;
        }
    }

    useEffect(() => {
        if (isAuthLoading || !user) return;

        fetchChats();
    }, [isAuthLoading, user]);

    return (
        <div className="conversation-list">
            <h3>Chats</h3>

            {isLoading && <p>Loading conversations...</p>}

            {!isLoading && error && (
                <div>
                    <p>{error}</p>
                    <button type="button" onClick={fetchChats}>
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !error && chats.length === 0 && (
                <p>No conversation yet.</p>
            )}

            {!isLoading && !error && chats.map((chat) => {
               const otherUser = chat.participants.filter(
                    (participant) => participant._id !== user?._id
                )[0];

                return (
                    <ConversationItem
                        key={chat._id}
                        chat={{
                            ...chat, 
                            name: otherUser?.name || "Unknown user" ,
                            lastMessage: chat?.latestMessage || "No messages yet" ,
                            time: chat.updatedAt,
                            isOnline: false
                        }}
                        isSelected={selectedChatId === chat._id}
                        onClick={() => onSelectedChat(chat)}
                    />
                );
            })}

        </div>
    );
}

export default ConversationList;
