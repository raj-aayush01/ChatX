const express = require("express");
const router = express.Router();

const { validateUser } = require("./../middleware/authMiddleware") ;
const { getMessages, sendMessage } = require("./../controllers/messageController") ;

router.post("/" , validateUser, sendMessage) ;
router.get("/:chatId", validateUser, getMessages) ;

module.exports = router;