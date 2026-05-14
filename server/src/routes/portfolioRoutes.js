const { Router } = require("express");
const ctrl = require("../controllers/portfolioController");
const { protect } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");

const router = Router();

router.get("/me", protect, ctrl.listMine);
router.post("/me", protect, upload.array("images", 6), ctrl.create);
router.delete("/:id", protect, ctrl.remove);

module.exports = router;
