const express = require("express") ;
const router = express.Router() ;

const { protect } = require("../middleware/authMiddleware");
const { getCurrentUser, searchUser } = require("../controllers/userController");

router.get("/me", protect, getCurrentUser);
router.get("/search", protect, searchUser);

module.exports = router ;