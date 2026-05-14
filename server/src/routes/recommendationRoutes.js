const { Router } = require("express");
const ctrl = require("../controllers/recommendationController");
const { protect } = require("../middlewares/auth");

const router = Router();

router.get("/for-you", protect, ctrl.forYou);

module.exports = router;
