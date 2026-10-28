const express = require("express") ;
const cors = require("cors") ;

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes")

const app = express() ;

app.use(cors()) ;
app.use(express.json()) ;

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes) ;

module.exports = app ;