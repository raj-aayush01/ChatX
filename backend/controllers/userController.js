const User = require("../models/user") ;

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("_id name email avatar") ;
        console.log("--- GET: api/users/me route hitted --- (userId from token)")

        if(!user){
            return res.staus(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch( err ){
        console.log("user not found login again") ;
        return res.status(500).json({
            message: "Internal Server Error..." ,
        });
    } 
}

const searchUsers = async (req, res) => {
    try {
        const searchText = req.query.query?.trim() ;
        console.log("--- GET: api/users/search route hitted --- (searchText from req.query.query)")

        if(!searchText){
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const escapedText = searchText.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(escapedText, "i");

        const users = await User.find({
            _id: { $ne: req.user.userId },
            name: regex
        })
            .select("_id name avatar")
            .limit(20);

        return res.status(200).json({
            users
        });

    } catch ( err ){
        console.log("Error in searching...") ;
        res.status(500).json({
            message: "Internal server error" ,
        });
    }
}

module.exports = {
    getMe,
    searchUsers
}