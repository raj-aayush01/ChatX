const express = require("express") ;
const dotenv = require("dotenv") ;
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const initializeSocket = require("./sockets/socket");
const { setIO } = require("./socket");

dotenv.config() ;

const PORT = process.env.PORT || 3002 ;
const app = express() ;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*" ,
    },
});
setIO(io);

initializeSocket(io);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats" , chatRoutes);
app.use("/api/messages", messageRoutes);

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to connect to DB:", err.message);
        process.exit(1);
    }
};

startServer();