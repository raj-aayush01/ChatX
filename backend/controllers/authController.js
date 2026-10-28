const User = require("../models/user") ;
const bcrypt = require("bcryptjs") ;
const jwt = require("jsonwebtoken") ;

// JWT Token
const generateToken = (userId) => {
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not configured") ;
    }

    return jwt.sign(
        { userId: userId.toString()} ,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
}

// SIGNUP
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body ;
        console.log("--- POST: api/auth/signup route hitted --- (name, email, password)")

        if(!name?.trim() || !email?.trim() || !password?.trim()){
            return res.status(400).json({
                message: "Name, email and password are required" ,
            });
        }

        if(password.length < 8){
            return res.status(400).json({
                message: "Password must be atleast 8 characters long" ,
            }) ;
        }

        const normalizedEmail = email.trim().toLowerCase() ;

        const existingUser = await User.findOne({
            email: normalizedEmail,
        }) ;

        if(existingUser){
            return res.status(409).json({
                message: "An account with this email already exists!" ,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12) ;

        // create user...
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        })

        const token = generateToken(user._id) ;

        return res.status(201).json({
            message: "Account created successfully!" ,
            token,
            user: {
                _id: user._id ,
                name: user.name ,
                email: user.email ,
                avatar: user.avatar
            }
        });
    }
    catch ( err ){
        console.error("Signup error: ") ;

        return res.status(500).json({
            message: "Internal server error." ,
        })
    }
};


//LOGIN...
const login = async (req, res) => {
    try {
        console.log("--- POST: api/auth/login route hitted --- (email, password)")
        const { email, password } = req.body ;
        if(!email?.trim() || !password?.trim()){
            return res.status(400).json({
                message: "Username or password is invalid..." ,
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password") ;

        if(!user){
            return res.status(400).json({
                message: "Username or password is invalid..." ,
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user?.password
        );

        if(!isMatch){
            return res.status(400).json({
                message: "Username or password is invalid..." ,
            });
        }

        const token = generateToken(user._id) ;

        return res.status(200).json({
            message: "Logged in successfully!" ,
            token,
            user: {
                _id: user._id ,
                name: user.name ,
                email: user.email ,
                avatar: user.avatar
            }
        });

    }
    catch ( err ){
        console.log("Login Error: ") ;
        res.status(500).json({
            message: "Internal server error..." ,
        }) ;
    }

}

const logout = async(req, res) => {
    return res.status(200).json({
        message: "Logged out successfully..." ,
    });
};


// Check for the authenticated user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("_id name email avatar") ;
        console.log("--- GET: api/auth/me route hitted --- (userId from token)")

        if(!user) {
            return res.status(401).json({
                message: "User not found. Please login again." ,
            }) ;
        }

        return res.status(200).json({
            user: {
                _id: user._id ,
                name: user.name ,
                email: user.email ,
                avatar: user.avatar,
            } ,
        }) ;

    } catch ( error ) {
        console.log("Get current user error...") ;

        return res.status(500).json({
            message: "Internal server error." ,
        }) ;
    }
}

module.exports = {
    signup,
    login,
    logout,
    getCurrentUser,
}