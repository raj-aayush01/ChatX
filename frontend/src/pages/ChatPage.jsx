import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

import { fetchChats, accessChat, deleteChatApi } from "../services/chatService";
import { fetchMessages, sendMessage, deleteMessageApi } from "../services/messageService";
import { searchUsers } from "../services/userService";
import { logoutApi } from "../services/authService";

import socket from "../socket/socket";

const ChatPage = () => {
    const navigate = useNavigate();
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
            } catch (err) {
                console.error(err);
            }
        };
        loadChats();
    }, []);

    useEffect(() => {
        if (!currentUser?._id) return;
        socket.emit("setup", currentUser._id);

        socket.on("connected", () => {
            console.log("Socket Connected");
        });

        return () => {
            socket.off("connected");
        };
    }, [currentUser]);

    useEffect(() => {
        socket.on("message received", (newMessage) => {
            if (newMessage.sender?._id === currentUser?._id) return;

            setMessages((prev) => [...prev, newMessage]);
        });

        socket.on("message deleted", ({ messageId }) => {
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        });

        socket.on("chat deleted", (chatId) => {
            setChats((prev) => prev.filter((c) => c._id !== chatId));
            if (selectedChat?._id === chatId) {
                setSelectedChat(null);
                setMessages([]);
            }
        });

        return () => {
            socket.off("message received");
            socket.off("message deleted");
            socket.off("chat deleted");
        };
    }, [currentUser, selectedChat]);

    useEffect(() => {
        socket.on("user online", (userId) => {
            setOnlineUsers((prev) => {
                if (prev.includes(userId)) return prev;
                return [...prev, userId];
            });
        });

        socket.on("user offline", (userId) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
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
                const data = await fetchMessages(selectedChat._id);
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
            const newMessage = await sendMessage(input, selectedChat._id);
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
                const exists = prevChats.find((c) => c._id === chat._id);
                if (exists) return prevChats;
                return [chat, ...prevChats];
            });

            setSearch("");
            setSearchResults([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteChat = async () => {
        if (!selectedChat) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this conversation?");
        if (!confirmDelete) return;

        try {
            await deleteChatApi(selectedChat._id);
            socket.emit("delete chat", selectedChat._id);

            setChats((prev) => prev.filter((c) => c._id !== selectedChat._id));
            setSelectedChat(null);
            setMessages([]);
        } catch (err) {
            console.error("Failed to delete chat:", err);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessageApi(messageId);
            if (selectedChat) {
                socket.emit("delete message", { messageId, chatId: selectedChat._id });
            }
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const selectedUser = selectedChat?.users?.find((user) => user._id !== currentUser?._id);
    const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

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
                onLogout={handleLogout}
            />

            <div className="chat-main">
                {selectedChat ? (
                    <>
                        <ChatHeader
                            selectedUser={selectedUser}
                            isOnline={isOnline}
                            isTyping={isTyping}
                            onDeleteChat={handleDeleteChat}
                        />

                        <MessageList
                            messages={messages}
                            currentUser={currentUser}
                            onDeleteMessage={handleDeleteMessage}
                        />

                        <MessageInput
                            input={input}
                            handleInputChange={handleInputChange}
                            handleSend={handleSend}
                        />
                    </>
                ) : (
                    <div className="chat-empty">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;