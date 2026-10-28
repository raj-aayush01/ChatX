require("dotenv").config() ;
const http = require("http") ;
const { Server } = require("socket.io") ;
const PORT = process.env.PORT || 5000 ;

const connectDB = require("./config/db.js") ;
const app = require("./app.js") ;
const { setIO } = require("./socket.js") ;

const httpServer = http.createServer(app) ;

const io = new Server(httpServer , {
    cors: {
        origin: "http://localhost:5173",
    },
});

setIO(io) ;

const startServer = async () => {
    try {
        await connectDB() ;
        httpServer.listen(PORT, () => {
            console.log(`Server is listening on PORT: ${PORT}`) ;
        }) ;
    }
    catch ( err ){
        console.log("Failed to start server: ", err) ;
    }
} ;

startServer() ;