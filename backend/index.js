const express = require("express") ;
const dotenv = require("dotenv") ;
const connectDB = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");

dotenv.config() ;

connectDB() ;
const PORT = process.env.PORT || 3002 ;
const app = express() ;

app.use(express.json());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});