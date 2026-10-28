const express = require("express");
const router = express.Router();

const { validateUser } = require("../middleware/authMiddleware")
const { createChat, getChats, getChatById } = require("../controllers/chatController") ;

router.post("/", validateUser, createChat);
router.get("/", validateUser, getChats) ;
router.get("/:chatId", validateUser, getChatById) ;

module.exports = router;