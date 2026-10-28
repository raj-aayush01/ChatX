import { useAuth } from "../../context/AuthContext" ;
import "./ChatHeader.css" ;

function ChatHeader({ selectedChat }) {
    const { user } = useAuth() ;

    const otherParticipant = selectedChat?.participants?.find(
        participant => participant._id !== user?._id
    ) ;

    return (
        <header className="chat-header"> 
            <div className="chat-header-avatar">
                {otherParticipant?.avatar ? 
                    (
                        <img src={otherParticipant.avatar} alt={otherParticipant.name} />
                    ):
                    (
                        <div className="avatar-fallback">
                            {otherParticipant?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )
                }
            </div>

            <div className="chat-header-info">
                <div className="chat-header-name">
                    {otherParticipant?.name || "Loading..."}
                </div>
                <div className="chat-header-status">
                    Offline
                </div>
            </div>
        </header>
    )
}

export default ChatHeader