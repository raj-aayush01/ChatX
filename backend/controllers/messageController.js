const mongoose = require("mongoose") ;
const Chat = require("./../models/chat") ;
const Message = require("./../models/message") ;


// Creating new message...
const sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body ;
        const userId = req.user.userId ;
        console.log("--- POST: api/messages/ route hitted --- (chatId, text from body, userId from token)")

        if(typeof text !== "string" || !text.trim()){
            return res.status(400).json({
                message: "Message text is required" ,
            }) ;
        }
        
        if(!chatId || !mongoose.Types.ObjectId.isValid(chatId)){
            return res.status(400).json({
                message: "Valid chat Id is required" ,
            });
        }

        const trimmedText = text.trim() ;

        if(trimmedText.length > 5000){
            return res.status(400).json({
                message: "Message cannot exceed 5000 characters" ,
            });
        }

        const chat = await Chat.findOne({
            _id: chatId ,
            participants: userId,
        }) ;

        if(!chat){
            return res.status(404).json({
                message: "Chat not found" ,
            });
        }

        const message = await Message.create({
            chat: chatId,
            sender: userId,
            text: trimmedText
        });

        chat.latestMessage = message.text ;
        await chat.save() ;

        const populatedMessage = await Message.findById(message._id).populate("sender", "name avatar") ;

        return res.status(201).json({
            message: populatedMessage,
        });

    } catch ( error ) {
        console.log("Error sending message...") ;

        return res.status(500).json({
            message: "Internal server error" ,
        }) ;
    }
};


// Get messages with pagination....

const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params ;
        const { cursorTime, cursorId } = req.query ;
        const limit = ( cursorTime || cursorId )? 20 : 50 ;
        const userId = req.user.userId ;

        console.log("--- GET: api/messages/ route hitted --- (chatId from params, userId from token)")

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                message: "Invalid chat ID"
            });
        }

        // A cursor must contain both values or neither.
        if(Boolean(cursorTime) !== Boolean(cursorId)) {
            return res.status(400).json({
                message: "Both cursorTime and cursorId are required" ,
            });
        }

        if(cursorTime && (
            Number.isNaN(Date.parse(cursorTime)) || !mongoose.Types.ObjectId.isValid(cursorId)
        )) {
            return res.status(400).json({
                message: "Invalid cursor"
            }) ;
        }

        const chat = await Chat.findOne({
            _id: chatId ,
            participants: userId
        }) ;

        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            }) ;
        }

        const filter = { chat: chatId } ;

        if(cursorTime && cursorId) {
            const time = new Date(cursorTime) ;
            const id = new mongoose.Types.ObjectId(cursorId) ;

            filter.$or = [
                { createdAt: { $lt: time }},
                {
                    createdAt: time,
                    _id: { $lt: id }
                }
            ] ;
        }

        // Fetch one extra message to determine whether older history exists.
        const results = await Message.find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1)
            .populate("sender", "name avatar");

        const hasMore = results.length > limit;
        console.log(`${limit}: Messages sent to the frontend. More exists: ${hasMore}`) ;

        const messages = results
            .slice(0, limit)
            .reverse();

        return res.status(200).json({
            messages,
            hasMore
        });

    } catch (error) {
        console.log("Error fetching messages...");

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = {
    sendMessage,
    getMessages
}