const Message = require("../models/Message");
const Chat = require("../models/Chat");

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

        await Chat.findByIdAndUpdate(
            chatId,
            {
                latestMessage: message._id
            }
        );

        return res.status(201).json(message);

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
          .sort({createdAt: -1})
          .limit(50);

        return res.status(200).json(messages);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


module.exports = {
    sendMessage,
    fetchMessages
};