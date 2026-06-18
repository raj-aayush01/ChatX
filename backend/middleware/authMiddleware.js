const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided"
            });
        }
        const token = authHeader.split(" ")[1] ;
        console.log(token);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        console.log(decoded);

        req.user = decoded ;

        next();
        
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
};

module.exports = { protect };