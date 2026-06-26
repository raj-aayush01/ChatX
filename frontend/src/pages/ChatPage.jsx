import { useState, useEffect, useRef } from "react";
import "./ChatPage.css";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

import { fetchChats, accessChat } from "../services/chatService";
import { fetchMessages, sendMessage } from "../services/messageService";
import { searchUsers } from "../services/userService";

import socket from "../socket/socket";

const ChatPage = () => {
    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [selectedChat, setSelectedChat] = useState(null);
    const [search, setSearch] = useState("");
    const [input, setInput] = useState("");
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const typingTimeoutRef = useRef(null);
    

    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await fetchChats();
                setChats(data);
                console.log("Chats State:", data);

            } catch (err) {
                console.error(err);
            }
        };
        loadChats();

    }, []);


    useEffect(() => {
        socket.emit( "setup", currentUser._id );

        socket.on( "connected", () => {
            console.log("Socket Connected");
        });

        return () => {
            socket.off("connected");
        };

    }, [currentUser]);


    useEffect(() => {
        socket.on("message received", (newMessage) => {
            if ( newMessage.sender?._id === currentUser._id ) return;

            setMessages((prev) => [
                    ...prev,
                    newMessage,
                ]);
        });

        return () => {
            socket.off("message received");
        };

    }, [currentUser]);


    useEffect(() => {
        socket.on("user online", (userId) => {
            setOnlineUsers((prev) => {
                if ( prev.includes(userId) ) return prev;

                return [
                    ...prev,
                    userId,
                ];
            });
        });

        socket.on("user offline", (userId) => {
            setOnlineUsers((prev) =>
                prev.filter( (id) => id !== userId )
            );
        });

        return () => {
            socket.off("user online");
            socket.off("user offline");
        };

    }, []);


    useEffect(() => {
        if (!selectedChat) return;

        const loadMessages = async () => {
            try {
                const data = await fetchMessages( selectedChat._id );

                console.log("Messages:", data );

                setMessages(data);

                socket.emit("join chat", selectedChat._id);

            } catch (err) {
                console.error(err);
            }
        };

        loadMessages();

    }, [selectedChat]);


    useEffect(() => {
        socket.on("typing", () => {
            setIsTyping(true);
        });

        socket.on("stop typing", () => {
            setIsTyping(false);
        });

        return () => {
            socket.off("typing");
            socket.off("stop typing");
        };

    }, []);


    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);


    const handleInputChange = (e) => {
        setInput(e.target.value);

        if (!selectedChat) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }, 2000);
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedChat) return;

        if (typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }

        try {
            const newMessage = await sendMessage(
                input,
                selectedChat._id
            );

            setMessages((prev) => [...prev, newMessage]);

            setInput("");

        } catch (err) {
            console.error(err);
        }
    };


    const handleSearch = async (value) => {
        setSearch(value);

        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const users = await searchUsers(value);
            setSearchResults(users);
        } catch (err) {
            console.error(err);
        }
    };


    const handleUserSelect = async (user) => {
        try {
            const chat = await accessChat(user._id);

            setSelectedChat(chat);

            setChats((prevChats) => {
                const exists = prevChats.find(
                    (c) => c._id === chat._id
                );

                if (exists) return prevChats;

                return [chat, ...prevChats];
            });

            setSearch("");
            setSearchResults([]);

        } catch (err) {
            console.error(err);
        }
    };


    const selectedUser = selectedChat?.users?.find( (user) => user._id !== currentUser._id );
    const isOnline = selectedUser && onlineUsers.includes( selectedUser._id );

    console.log("Chats:", chats);
    console.log("FIRST CHAT:", chats[0]);

    return (
        <div className="chat-wrapper">

            <div className="chat-orb-right" />

            <ChatSidebar
                chats={chats}
                currentUser={currentUser}
                search={search}
                handleSearch={handleSearch}
                searchResults={searchResults}
                handleUserSelect={handleUserSelect}
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
            />

            <div className="chat-main">
                {selectedChat ? (
                    <>
                        <ChatHeader
                            selectedUser={ selectedUser }
                            isOnline={ isOnline }
                            isTyping={ isTyping }
                        />

                        <MessageList
                            messages={messages}
                            currentUser={
                                currentUser
                            }
                        />

                        <MessageInput
                            input={input}
                            handleInputChange={handleInputChange}
                            handleSend={ handleSend }
                        />
                    </>
                ) : (
                    <div className="chat-empty">
                        <p>
                            Select a
                            conversation to
                            start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;