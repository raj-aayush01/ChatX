let io ;

const setIO = (ioInstance) => {
    io = ioInstance ;
}

const getIO = () => {
    if(!io){
        throw new Error("Socket.IO has not been initialized!") ;
    }

    return io ;
}

module.exports = {
    setIO,
    getIO
} ;