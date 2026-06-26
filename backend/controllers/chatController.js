const Chat = require("../models/Chat");

const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if(!userId){
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const existingChat = await Chat.findOne({
            isGroupChat: false,
            users: {
                $all: [req.user.id, userId]
            }
        })
        .populate("users", "-password")
        .populate("latestMessage");

        if(existingChat){
            return res.status(200).json(existingChat)
        }

        const newChat = await Chat.create({
            isGroupChat: false,
            users: [req.user.id, userId]
        });

        const fullChat = await Chat.findById(newChat._id)
            .populate("users", "-password")
            .populate("latestMessage");

        return res.status(201).json(fullChat);

    } catch ( err ){
        res.status(500).json({
            message: err.message
        });
    }
};

const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            users: {
                $in: [req.user.id]
            }
        }).populate("users" , "-password")
          .populate("latestMessage");

        return res.status(200).json(chats);

    } catch ( err ) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    accessChat,
    fetchChats
};