import { useEffect, useRef } from "react";
import "./MessageList.css";
import MessageBubble from "./MessageBubble";

const MessageList = ({
    messages,
    currentUser,
}) => {

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className="messages-area">
            {messages.map((msg) => {
                const isMine =
                    msg.sender?._id ===
                    currentUser._id;

                return (
                    <MessageBubble
                        key={msg._id}
                        msg={msg}
                        isMine={isMine}
                    />
                );
            })}

            <div ref={messagesEndRef}></div>

        </div>
    );
};

export default MessageList;