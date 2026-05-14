const { Router } = require("express");
const { body } = require("express-validator");
const ctrl = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = Router();

router.post(
  "/register",
  [
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("age").optional().isInt({ min: 14, max: 120 }),
  ],
  ctrl.register
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], ctrl.login);
router.post("/logout", ctrl.logout);
router.get("/me", protect, ctrl.me);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;
