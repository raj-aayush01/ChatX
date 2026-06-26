import "./MessageInput.css";

const MessageInput = ({ input, handleInputChange, handleSend, }) => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="chat-input-area">
            <input
                className="chat-input"
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={ handleInputChange }
                onKeyDown={handleKeyDown}
            />

            <button className="send-btn" onClick={handleSend}>
                Send
            </button>
        </div>
    );
};

export default MessageInput;