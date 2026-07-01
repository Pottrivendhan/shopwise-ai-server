const Product = require("../models/Product");
const { PriceHistory } = require("../models/index");

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      q, category, brand, minPrice, maxPrice, minRating,
      sort = "relevance", page = 1, limit = 20,
    } = req.query;

    const query = {};

    if (q) {
      query.$text = { $search: q };
    }
    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, "i");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) query.rating = { $gte: Number(minRating) };

    const sortMap = {
      relevance: q ? { score: { $meta: "textScore" } } : { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };
    const sortOpt = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query, q ? { score: { $meta: "textScore" } } : {})
        .sort(sortOpt)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) { next(err); }
};

// GET /api/products/featured
exports.getFeatured = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10).lean();
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

// GET /api/products/trending
exports.getTrending = async (req, res, next) => {
  try {
    const products = await Product.find({ isTrending: true })
      .sort({ viewCount: -1 })
      .limit(10)
      .lean();
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

// GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// GET /api/products/:id/price-history
exports.getPriceHistory = async (req, res, next) => {
  try {
    const history = await PriceHistory.find({ product: req.params.id })
      .sort({ date: 1 })
      .limit(30)
      .lean();
    res.json({ success: true, history });
  } catch (err) { next(err); }
};

// GET /api/products/category/:category
exports.getByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = "rating" } = req.query;
    const sortMap = { rating: { rating: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 } };
    const products = await Product.find({ category: req.params.category })
      .sort(sortMap[sort] || { rating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    const total = await Product.countDocuments({ category: req.params.category });
    res.json({ success: true, products, total });
  } catch (err) { next(err); }
};
