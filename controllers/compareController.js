const Product = require("../models/Product");
const { Wishlist, Alert } = require("../models/index");

// ─── COMPARE ─────────────────────────────────────────────────────────────
// POST /api/compare
exports.compare = async (req, res, next) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ success: false, message: "Provide at least 2 product IDs." });
    }
    const products = await Product.find({ _id: { $in: productIds.slice(0, 4) } }).lean();
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

// ─── WISHLIST ────────────────────────────────────────────────────────────
// GET /api/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    let doc = await Wishlist.findOne({ user: req.user._id }).populate("products").lean();
    if (!doc) doc = { products: [] };
    res.json({ success: true, items: doc.products });
  } catch (err) { next(err); }
};

// POST /api/wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { upsert: true }
    );
    res.json({ success: true, message: "Added to wishlist." });
  } catch (err) { next(err); }
};

// DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: req.params.productId } }
    );
    res.json({ success: true, message: "Removed from wishlist." });
  } catch (err) { next(err); }
};

// ─── ALERTS ──────────────────────────────────────────────────────────────
// GET /api/alerts
exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ user: req.user._id, isActive: true })
      .populate("product", "name price image platform")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, alerts });
  } catch (err) { next(err); }
};

// POST /api/alerts
exports.createAlert = async (req, res, next) => {
  try {
    const { productId, targetPrice } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    const alert = await Alert.create({
      user: req.user._id,
      product: productId,
      targetPrice,
      triggered: product.price <= targetPrice,
    });
    res.status(201).json({ success: true, alert });
  } catch (err) { next(err); }
};

// DELETE /api/alerts/:id
exports.deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!alert) return res.status(404).json({ success: false, message: "Alert not found." });
    res.json({ success: true, message: "Alert removed." });
  } catch (err) { next(err); }
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────
// GET /api/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const [wishlistDoc, alerts] = await Promise.all([
      Wishlist.findOne({ user: req.user._id }).populate("products").lean(),
      Alert.find({ user: req.user._id, isActive: true }).populate("product", "name price").lean(),
    ]);

    const wishlistItems = wishlistDoc?.products || [];
    const activeAlerts = alerts.filter((a) => !a.triggered);
    const savings = wishlistItems.reduce((acc, p) => {
      return acc + Math.max(0, (p.originalPrice || 0) - (p.price || 0));
    }, 0);

    res.json({
      success: true,
      wishlist: wishlistItems,
      alerts,
      activeAlerts: activeAlerts.length,
      comparisons: 0,
      savings,
    });
  } catch (err) { next(err); }
};
