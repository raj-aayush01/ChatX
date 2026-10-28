const express = require("express");
const router = express.Router();

const { validateUser } = require("../middleware/authMiddleware") ;
const { getMe, searchUsers } = require("./../controllers/userController") ;

router.get("/me", validateUser, getMe) ;
router.get("/search", validateUser, searchUsers)

module.exports = router;