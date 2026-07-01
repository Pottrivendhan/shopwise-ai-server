const mongoose = require("mongoose");

// ── PriceHistory ──────────────────────────────────────────
const priceHistorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    price: { type: Number, required: true },
    platform: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// ── Wishlist ──────────────────────────────────────────────
const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// ── Alert ─────────────────────────────────────────────────
const alertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    targetPrice: { type: Number, required: true },
    triggered: { type: Boolean, default: false },
    triggeredAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ── Review ────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 200 },
    body: { type: String, maxlength: 5000 },
    helpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = {
  PriceHistory: mongoose.model("PriceHistory", priceHistorySchema),
  Wishlist: mongoose.model("Wishlist", wishlistSchema),
  Alert: mongoose.model("Alert", alertSchema),
  Review: mongoose.model("Review", reviewSchema),
};
