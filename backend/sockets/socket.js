const onlineUsers = new Map();

const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New socket connected: ", socket.id);

        socket.on("setup", (userId) => {
            console.log("User setup:", userId);

            socket.join(userId);

            onlineUsers.set(userId, socket.id);

            io.emit(
                "user online",
                userId
            );

            console.log(`Socket ${socket.id} joined room ${userId}`);

            socket.emit("connected");
        });
        

        socket.on("disconnect", () => {
            let disconnectedUser = null;

            for (const [userId, socketId] of onlineUsers) {
                if (socketId === socket.id) {
                    disconnectedUser = userId;
                    break;
                }
            }

            if (disconnectedUser) {
                onlineUsers.delete(
                    disconnectedUser
                );

                io.emit(
                    "user offline",
                    disconnectedUser
                );

                console.log(
                    `User ${disconnectedUser} went offline`
                );
            }
        });

        socket.on("join chat", (chatId) => {
            socket.join(chatId);

            console.log(`Socket ${socket.id} joined chat ${chatId}`);
        });

        socket.on("new message", (message) => {
            console.log("New message received:", message);
        });

        socket.on("typing", (chatId) => {
            socket.to(chatId).emit("typing");
        });

        socket.on("stop typing", (chatId) => {
            socket.to(chatId).emit("stop typing");
        });
    });
};

module.exports = initializeSocket;