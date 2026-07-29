const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const initializeSocket = require("./sockets/socket");
const { setIO } = require("./socket");

dotenv.config();

const PORT = process.env.PORT || 3002;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
setIO(io);

initializeSocket(io);

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