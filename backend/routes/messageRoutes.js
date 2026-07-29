const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { sendMessage, fetchMessages, deleteMessage } = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/:chatId" , protect, fetchMessages);
router.delete("/:messageId", protect, deleteMessage);

module.exports = router ;