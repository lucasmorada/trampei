const { Router } = require("express");
const { body } = require("express-validator");
const ctrl = require("../controllers/serviceController");
const { protect, optionalAuth } = require("../middlewares/auth");

const router = Router();

router.get("/", optionalAuth, ctrl.list);
router.get("/mine", protect, ctrl.mine);
router.get("/:id", ctrl.getOne);
router.post(
  "/",
  protect,
  [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("category").trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("city").trim().notEmpty(),
  ],
  ctrl.create
);
router.patch("/:id", protect, ctrl.update);
router.patch("/:id/status", protect, ctrl.updateStatus);
router.delete("/:id", protect, ctrl.remove);

module.exports = router;
