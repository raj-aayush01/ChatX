const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, deleteChat } = require("../controllers/chatController");

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.delete("/:chatId", protect, deleteChat);

module.exports = router;