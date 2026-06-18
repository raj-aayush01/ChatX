const User = require("./../models/User");

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);

    } catch ( err ){
        res.status(500).json({
            message: err.message
        });
    }
}

const searchUser = async (req, res) => {
    try {
        const search = req.query.search;

        if(!search){
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const users = await User.find({
            name: { 
                $regex: search , 
                $options: "i" 
            },
            _id: {
                $ne: req.user.id
            }
        }).select("name email profilePic");

        res.status(200).json( users );

    } catch ( err ){
        res.status(500).json({
            message: err.message
        });
    }
}


module.exports = {
    getCurrentUser,
    searchUser
}