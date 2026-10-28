import Sidebar from "./Sidebar" ;
import EmptyChat from "./EmptyChat" ;
import ChatHeader from "./ChatHeader";
import MessageList from "../messages/MessageList";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getChatById } from "../../services/chatService";

import "./ChatLayout.css" ;

function ChatLayout() {
    const [selectedChat, setSelectedChat] = useState(null) ;
    const [isChatLoading, setIsChatLoading] = useState(false) ;
    const [chatError, setChatError] = useState("") ;

    const { chatId } = useParams() ;
    const navigate = useNavigate() ;

    useEffect(() => {
        console.log("========== ChatLayout ==========");
        console.log("Current URL:", window.location.pathname);
        console.log("Chat ID from URL:", chatId);
    }, [chatId]);

    const handleSelectChat = (chat) => {
        console.log("========== Chat Selected ==========");
        console.log("Clicked chat ID:", chat._id);
        
        navigate(`/chat/${chat._id}`) ;
    }

    useEffect(() => {
        let cancelled = false ; 

        if(!chatId) {
            setSelectedChat(null) ;
            setChatError("") ;
            setIsChatLoading(false) ;
            return ;
        }

        const fetchChat = async () => {
            setIsChatLoading(true) ;
            setChatError("") ;
            setSelectedChat(null) ;

            try {
                const data = await getChatById(chatId) ;

                if(!cancelled) {
                    setSelectedChat(data.chat) ;
                }

            } catch ( error ) {
                if(!cancelled) {
                    setChatError(error.response?.data?.message || "Failed to load conversation. Please try again.") ;
                }
            } finally {
                if(!cancelled) {
                    setIsChatLoading(false) ;
                }
            }
        } ;

        fetchChat() ;

        return () => {
            cancelled = true ;
        } ;

    }, [chatId]) ;

    return (
        <div className="chat-layout">
            <Sidebar 
                selectedChatId={chatId}
                onSelectedChat={handleSelectChat}
            />

            {chatId ?   (
                            isChatLoading ? (
                                <main className="chat-main">
                                    <p>Loading conversation...</p>
                                </main>
                            ) : 
                            chatError ? (
                                <main className="chat-main">
                                    <p>{chatError}</p>
                                    <button onClick={() => navigate(0)}>
                                        Retry
                                    </button>
                                </main>
                            ) :
                            selectedChat ? (
                                <main className="chat-main">
                                    <ChatHeader selectedChat={selectedChat} />
                                    <MessageList chatId={chatId} />
                                </main>
                            ) :
                            null
                        ) :
                        (
                            <EmptyChat />
                        )
            }
        </div>
    );
}

export default ChatLayout;