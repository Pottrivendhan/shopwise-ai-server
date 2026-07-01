// authRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validator");
const { protect } = require("../middleware/authMiddleware");
const auth = require("../controllers/authController");

router.post("/register",
  [body("name").trim().notEmpty().withMessage("Name is required"),
   body("email").isEmail().withMessage("Valid email required"),
   body("password").isLength({ min: 6 }).withMessage("Password min 6 chars")],
  validate, auth.register
);
router.post("/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate, auth.login
);
router.get("/me", protect, auth.getMe);
router.put("/profile", protect, auth.updateProfile);
router.put("/change-password", protect, auth.changePassword);
router.post("/forgot-password", auth.forgotPassword);

module.exports = router;
