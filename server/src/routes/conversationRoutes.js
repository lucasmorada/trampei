const { Router } = require("express");
const ctrl = require("../controllers/conversationController");
const { protect } = require("../middlewares/auth");

const router = Router();

router.post("/", protect, ctrl.getOrCreate);
router.get("/mine", protect, ctrl.listMine);

module.exports = router;
