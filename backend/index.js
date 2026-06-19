const express = require("express") ;
const dotenv = require("dotenv") ;
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config() ;

const PORT = process.env.PORT || 3002 ;
const app = express() ;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats" , chatRoutes);
app.use("/api/messages", messageRoutes);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to connect to DB:", err.message);
        process.exit(1);
    }
};

startServer();