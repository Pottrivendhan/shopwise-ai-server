const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    brand: { type: String, trim: true, index: true },
    category: { type: String, trim: true, index: true },
    description: { type: String, maxlength: 5000 },
    image: { type: String },
    images: [String],
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    currency: { type: String, default: "INR" },
    platform: { type: String, enum: ["amazon", "flipkart", "myntra", "snapdeal", "other"], default: "other" },
    url: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    availability: { type: Boolean, default: true },
    specifications: { type: Map, of: String },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, price: 1, rating: -1 });

module.exports = mongoose.model("Product", productSchema);
