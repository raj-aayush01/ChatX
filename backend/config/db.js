const mongoose = require("mongoose") ;

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI) ;
        console.log("MONGODB Connected...");
    } catch(err){
        console.log("Error in connecting DB" , err.message) ;
    }
}

module.exports = connectDB;