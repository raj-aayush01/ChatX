const jwt = require("jsonwebtoken") ;

const validateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization ;
        console.log("Validate user MIDDLEWARE runs...")

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).send({
                message: "Authentication token is required" ,
            });
        }

        const token = authHeader.split(" ")[1] ;

        if(!token){
            return res.status(401).send({
                message: "Authentication token is required" ,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) ;

        req.user = {
            userId: decoded.userId
        };

        next() ;

    } catch ( err ){
        console.log("Error in validating token...") ;
        return res.status(401).json({
            message: "Error in validating token login again..."
        })
    } 
}

module.exports = {
    validateUser,
}