const { Router } = require("express");
const { body } = require("express-validator");
const ctrl = require("../controllers/reviewController");
const { protect } = require("../middlewares/auth");

const router = Router();

router.post(
  "/",
  protect,
  [body("revieweeId").notEmpty(), body("rating").isInt({ min: 1, max: 5 })],
  ctrl.create
);
router.get("/user/:userId", ctrl.listForUser);

module.exports = router;
