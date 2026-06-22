const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New socket connected: ", socket.id);

        socket.on("setup", (userId) => {
            console.log("User setup:", userId);

            socket.join(userId);

            console.log(`Socket ${socket.id} joined room ${userId}`);
            socket.emit("connected");
        });

        socket.on("join chat", (chatId) => {
            socket.join(chatId);

            console.log(`Socket ${socket.id} joined chat ${chatId}`);
        });

        socket.on("new message", (message) => {
            console.log("New message received:", message);
        });
    });
};

module.exports = initializeSocket;