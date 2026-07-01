const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const ctrl = require("../controllers/compareController");
const aiCtrl = require("../controllers/aiController");
const adminCtrl = require("../controllers/adminController");

// ── Compare ──────────────────────────────────────────────
const compareRouter = express.Router();
compareRouter.post("/", ctrl.compare);
exports.compareRoutes = compareRouter;

// ── Wishlist ─────────────────────────────────────────────
const wishlistRouter = express.Router();
wishlistRouter.use(protect);
wishlistRouter.get("/", ctrl.getWishlist);
wishlistRouter.post("/", ctrl.addToWishlist);
wishlistRouter.delete("/:productId", ctrl.removeFromWishlist);
exports.wishlistRoutes = wishlistRouter;

// ── Alerts ───────────────────────────────────────────────
const alertRouter = express.Router();
alertRouter.use(protect);
alertRouter.get("/", ctrl.getAlerts);
alertRouter.post("/", ctrl.createAlert);
alertRouter.delete("/:id", ctrl.deleteAlert);
exports.alertRoutes = alertRouter;

// ── Dashboard ────────────────────────────────────────────
const dashboardRouter = express.Router();
dashboardRouter.get("/", protect, ctrl.getDashboard);
exports.dashboardRoutes = dashboardRouter;

// ── AI ───────────────────────────────────────────────────
const aiRouter = express.Router();
aiRouter.post("/review-summary", aiCtrl.reviewSummary);
aiRouter.post("/recommend", aiCtrl.recommend);
aiRouter.post("/buying-advice", aiCtrl.buyingAdvice);
exports.aiRoutes = aiRouter;

// ── Admin ────────────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.use(protect, adminOnly);
adminRouter.get("/dashboard", adminCtrl.getDashboard);
adminRouter.get("/users", adminCtrl.getUsers);
adminRouter.put("/users/:id", adminCtrl.updateUser);
adminRouter.post("/products", adminCtrl.createProduct);
adminRouter.put("/products/:id", adminCtrl.updateProduct);
adminRouter.delete("/products/:id", adminCtrl.deleteProduct);
exports.adminRoutes = adminRouter;
