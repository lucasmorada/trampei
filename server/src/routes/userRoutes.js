const { Router } = require("express");
const { body } = require("express-validator");
const ctrl = require("../controllers/userController");
const { protect } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");

const router = Router();

router.get("/professionals", ctrl.listProfessionals);
router.get("/:id", ctrl.getById);
router.patch(
  "/me",
  protect,
  [
    body("firstName").optional().trim().notEmpty(),
    body("lastName").optional().trim().notEmpty(),
    body("age").optional().isInt({ min: 14, max: 120 }),
  ],
  ctrl.updateProfile
);
router.patch("/me/availability", protect, ctrl.updateAvailability);
router.post("/me/completed-jobs", protect, ctrl.addCompletedJob);
router.post("/me/photo", protect, upload.single("file"), ctrl.uploadProfilePhoto);

module.exports = router;
