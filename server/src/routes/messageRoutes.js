const { Router } = require("express");
const ctrl = require("../controllers/messageController");
const { protect } = require("../middlewares/auth");

const router = Router();

router.get("/:conversationId", protect, ctrl.list);
router.post("/", protect, ctrl.send);
router.post("/:conversationId/read", protect, ctrl.markRead);

module.exports = router;
