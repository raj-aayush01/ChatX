const mongoose = require("mongoose") ;
const User = require("../models/user") ;
const Chat = require("./../models/chat") ;


// Create a new chat when user search for its friend and if exist return the existing one
const createChat = async (req, res) => {
    try {
        const { participantId } = req.body ;
        const currentUserId = req.user.userId ;
        console.log("--- POST: api/chats/ route hitted --- (participantID from body, userId from token)")

        if(!participantId){
            return res.status(400).json({
                message: "Participant ID is required" ,
            });
        }

        if(!mongoose.Types.ObjectId.isValid(participantId)){
            return res.status(400).json({
                message: "Invalid participant ID" ,
            });
        }

        if(participantId === String(currentUserId)){
            return res.status(400).json({
                message: "You cannot create a chat with yourself" ,
            });
        }

        const participant = await User.findById(participantId).select("_id") ;

        if(!participant){
            return res.status(404).json({
                message: "Participant not found" ,
            });
        }

        const existingChat = await Chat.findOne({
            participants: {
                $all: [currentUserId, participantId],
                $size: 2,
            },
        });

        if(existingChat){
            return res.status(200).json({
                message: "Chat already exists" ,
                chat: existingChat,
            })
        }

        const chat = await Chat.create({
            participants: [currentUserId, participantId],
            latestMessage: "" ,
        });

        return res.status(201).json({
            message: "Chat created successfully",
            chat,
        });

    } catch ( err ){
        console.log("Error in creating chat...") ;

        return res.status(500).json({
            message: "Internal server error" ,
        });
    }
}

// Get all existing chats of a user...
const getChats = async (req, res) => {
    try {
        const userId = req.user.userId ;
        console.log("--- GET: api/chats/ route hitted --- (userId from token)")

        const allChats = await Chat.find({
            participants: {$in: [userId]}
        }).populate("participants", "name avatar");

        return res.status(200).json({
            chats: allChats
        });

    } catch ( err ) {
        console.log("Error in fetching chats...") ;

        return res.status(500).json({
            message: "Internal server error"
        });
    }

};


// Get a existing chat details...
const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params ;
        const userId = req.user.userId ;
        console.log("--- GET: api/chats/:chatID route hitted --- (chatId from params, userId from token)")

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                message: "Invalid chatID" ,
            }) ;
        }

        const chat = await Chat.findOne({
            _id: chatId ,
            participants: userId
        }).populate("participants", "name avatar"); 

        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            }) ;
        }

        return res.status(200).json({
            chat
        }) ;

    } catch ( error ){
        console.log("Error in getting get chat by ID...") ;

        return res.status(500).json({
            message: "Internal server error"
        }) ;
    }
} ;

module.exports = {
    createChat,
    getChats,
    getChatById,
}