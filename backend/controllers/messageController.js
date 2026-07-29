const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { getIO } = require("../socket");

const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;
        if(!content || !chatId ){
            return res.status(400).json({
                message: "Content and Chat Id are required"
            });
        }

        const message = await Message.create({
            sender: req.user.id,
            content,
            chat: chatId
        });

        const populatedMessage = await Message.findById(message._id).populate("sender", "name");

        const io = getIO();

        await Chat.findByIdAndUpdate(
            chatId,
            {
                latestMessage: message._id
            }
        );

        io.to(chatId).emit("message received", populatedMessage);

        return res.status(201).json(populatedMessage);

    } catch ( err ){
        return res.status(500).json({
            message: err.message
        });
    }
};

const fetchMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        if(!chatId){
            return res.status(400).json({
                message: "Chat Id is required"
            });
        }

        const messages = await Message.find({
            chat: chatId
        }).populate("sender" , "name")
          .sort({createdAt: 1})
          .limit(50);

        return res.status(200).json(messages);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        const chatId = message.chat;
        await Message.findByIdAndDelete(messageId);

        try {
            const io = getIO();
            if (io) {
                io.to(chatId.toString()).emit("message deleted", { messageId, chatId });
            }
        } catch (e) {
            // Socket IO broadcast optional if socket not initialized in test mode
        }

        return res.status(200).json({ success: true, message: "Message deleted", messageId, chatId });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    sendMessage,
    fetchMessages,
    deleteMessage
};