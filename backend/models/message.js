const mongoose = require("mongoose") ;

const messageSchema = new mongoose.Schema(
    {
        chat:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat" ,
            required: true ,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" ,
            required: true ,
        },

        text: {
            type: String,
            required: true ,
            trim: true,
            minlength: 1,
            maxlength: 5000,
        },
    },
    {
        timestamps: true,
    }
);

// adding compound indexing...
// Chat --> ascending order
// Messages --> descending order based on createdAt
// Break ties using id of messages if createdAt is same...
messageSchema.index({
    chat: 1,
    createdAt: -1,
    _id: -1 ,
});

module.exports = mongoose.model("Message", messageSchema) ;