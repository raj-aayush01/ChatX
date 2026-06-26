import { useState, useEffect } from "react";
import "./ChatPage.css";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

import { fetchChats } from "../services/chatService";
import { fetchMessages, sendMessage } from "../services/messageService";

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
        socket.emit(
            "setup",
            currentUser._id
        );

        socket.on(
            "connected",
            () => {
                console.log(
                    "Socket Connected"
                );
            }
        );

        return () => {
            socket.off("connected");
        };
    }, [currentUser]);


    useEffect(() => {
        socket.on(
            "message received",
            (newMessage) => {

                if (
                    newMessage.sender?._id ===
                    currentUser._id
                ) {
                    return;
                }

                setMessages((prev) => [
                    ...prev,
                    newMessage,
                ]);
            }
        );

        return () => {
            socket.off(
                "message received"
            );
        };
    }, [currentUser]);


    useEffect(() => {
        socket.on(
            "user online",
            (userId) => {
                setOnlineUsers((prev) => {
                    if (
                        prev.includes(userId)
                    ) {
                        return prev;
                    }

                    return [
                        ...prev,
                        userId,
                    ];
                });
            }
        );

        socket.on(
            "user offline",
            (userId) => {
                setOnlineUsers((prev) =>
                    prev.filter(
                        (id) =>
                            id !== userId
                    )
                );
            }
        );

        return () => {
            socket.off("user online");
            socket.off("user offline");
        };
    }, []);


    useEffect(() => {
        if (!selectedChat) return;

        const loadMessages = async () => {
            try {
                const data = await fetchMessages(
                    selectedChat._id
                );

                console.log(
                    "Messages:",
                    data
                );

                setMessages(data);

                socket.emit(
                    "join chat",
                    selectedChat._id
                );

            } catch (err) {
                console.error(err);
            }
        };

        loadMessages();
    }, [selectedChat]);


    const handleSend = async () => {
        if (
            !input.trim() ||
            !selectedChat
        )
            return;

        try {
            const newMessage = await sendMessage(
                    input,
                    selectedChat._id
                );

            console.log("NEW MESSAGE RESPONSE:", newMessage);

            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);

            setInput("");

        } catch (err) {
            console.error(err);
        }
    };

    const selectedUser =
        selectedChat?.users?.find(
            (user) =>
                user._id !== currentUser._id
        );

    const isOnline =
        selectedUser &&
        onlineUsers.includes(
            selectedUser._id
        );

    console.log("Chats:", chats);
    console.log("FIRST CHAT:", chats[0]);

    return (
        <div className="chat-wrapper">

            <ChatSidebar
                chats={chats}
                currentUser={currentUser}
                search={search}
                setSearch={setSearch}
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
            />

            <div className="chat-main">
                {selectedChat ? (
                    <>
                        <ChatHeader
                            selectedUser={
                                selectedUser
                            }
                            isOnline={isOnline}
                        />

                        <MessageList
                            messages={messages}
                            currentUser={
                                currentUser
                            }
                        />

                        <MessageInput
                            input={input}
                            setInput={setInput}
                            handleSend={
                                handleSend
                            }
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