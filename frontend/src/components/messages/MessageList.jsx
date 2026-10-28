import { useState, useEffect } from "react";
import { getMessages } from "../../services/messageService";
import MessageBubble from "./MessageBubble" ;
import { useAuth } from "../../context/AuthContext" ;

import "./MessageList.css" ;

function MessageList({ chatId }) {
    const [messages, setMessages] = useState([]) ;
    const [isLoading, setLoading] = useState(false) ;
    const [error, setError] = useState("") ;

    const { user } = useAuth() ;

    useEffect(() => {
        let cancelled = false ;

        if(!chatId){
            setMessages([]) ;
            setError("") ;
            setLoading(false) ;
            return ;
        }

        const fetchMessages = async () => {
            setLoading(true) ;
            setError("") ;
            setMessages([]) ;

            try {
                const data = await getMessages(chatId) ;

                if(!cancelled) {
                    setMessages(data.messages) ;
                }

            } catch ( error ) {
                if(!cancelled){
                    setError(
                        error.response?.data?.message || 
                        "Failed to load messages. Please try again."
                    ) ;
                }

            } finally {
                if(!cancelled) {
                    setLoading(false) ;
                }
            }
        } ;

        fetchMessages() ;

        return () => {
            cancelled = true ;
        } ;
    }, [chatId]) ;


    return (
        <div className="message-list">
            {isLoading && <p>Loading messages...</p>}

            {error && <p>{error}</p>}

            {!isLoading && !error && messages.length === 0 && (
                <p>No messages yet. Start the conversation!</p>
            )}

            {!isLoading && !error && messages.map((message) => {
                const isOwnMessage = message?.sender?._id === user?._id ;

                return (
                    <MessageBubble 
                        key={message._id} 
                        messageId={message._id}
                        message={message.text}
                        createdAt={message.createdAt}
                        isOwnMessage={isOwnMessage}
                    />
                )
            })}

        </div>
    ) ;
}

export default MessageList ;