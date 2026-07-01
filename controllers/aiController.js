const Product = require("../models/Product");
const { Review } = require("../models/index");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAIResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();

  } catch (error) {

    console.error("Gemini Error:", error);

    return JSON.stringify({
      overview: "AI service is temporarily unavailable.",
      pros: [
        "Good quality",
        "Value for money",
        "Easy to use"
      ],
      cons: [
        "Limited information available"
      ],
      verdict: "Recommended based on available product data."
    });

  }
};

// POST /api/ai/review-summary
exports.reviewSummary = async (req, res, next) => {
  // Fallback mock for development (no API key needed)
  return JSON.stringify({
    overview: "This product has received generally positive feedback from customers.",
    pros: ["Good build quality", "Value for money", "Easy to use"],
    cons: ["Could be improved packaging", "Limited color options"],
    verdict: "A solid choice for most users looking for reliable performance.",
  });
};

// POST /api/ai/review-summary
exports.reviewSummary = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    const reviews = await Review.find({ product: productId })
      .limit(20)
      .select("rating title body")
      .lean();

    const reviewText =
      reviews.length > 0
        ? reviews.map((r) => `${r.rating}/5: ${r.title || ""} - ${r.body || ""}`).join("\n")
        : `Product: ${product.name}, Rating: ${product.rating}/5, ${product.reviewCount} reviews. Average customer rating suggests ${product.rating >= 4 ? "high" : product.rating >= 3 ? "moderate" : "low"} satisfaction.`;

    const prompt = `Analyze these reviews for "${product.name}" (₹${product.price}):
${reviewText}

Respond with ONLY this JSON (no extra text):
{
  "overview": "2-3 sentence overall summary",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "verdict": "1-sentence buying verdict"
}`;

    const raw = await getAIResponse(prompt);
    let summary;
    try {
      summary = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      summary = {
        overview: raw,
        pros: ["Good value", "Reliable quality"],
        cons: ["Limited availability"],
        verdict: "Worth considering based on customer feedback.",
      };
    }

    res.json({ success: true, summary });
  } catch (err) { next(err); }
};

// POST /api/ai/recommend
exports.recommend = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    const siblings = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      availability: true,
    })
      .sort({ rating: -1 })
      .limit(20)
      .select("name price rating image _id brand")
      .lean();

    const prompt = `You are a shopping advisor. A user is viewing:
"${product.name}" - ₹${product.price}, Rating: ${product.rating}/5, Category: ${product.category}

Available alternatives: ${JSON.stringify(siblings.slice(0, 10).map((p) => ({ id: p._id, name: p.name, price: p.price, rating: p.rating })))}

Respond ONLY with this JSON:
{
  "advice": "1-2 sentence buying advice for this product",
  "budgetId": "id of best budget pick (cheapest with good rating)",
  "bestId": "id of best overall pick",
  "premiumId": "id of best premium pick (highest rated, may cost more)"
}`;

    const raw = await getAIResponse(prompt);
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      const sorted = [...siblings].sort((a, b) => a.price - b.price);
      const bestRated = [...siblings].sort((a, b) => b.rating - a.rating);
      parsed = {
        advice: `${product.name} is a popular choice in the ${product.category} category.`,
        budgetId: sorted[0]?._id,
        bestId: bestRated[0]?._id,
        premiumId: bestRated[1]?._id,
      };
    }

    const findProduct = (id) => siblings.find((p) => String(p._id) === String(id));
    res.json({
      success: true,
      advice: parsed.advice,
      budget: findProduct(parsed.budgetId) || siblings[0],
      best: findProduct(parsed.bestId) || siblings[1],
      premium: findProduct(parsed.premiumId) || siblings[2],
    });
  } catch (err) { next(err); }
};

// POST /api/ai/buying-advice
exports.buyingAdvice = async (req, res, next) => {
  try {
    const { query, budget } = req.body;
    const prompt = `A user wants to buy: "${query}"${budget ? ` with a budget of ₹${budget}` : ""}.
Give concise buying advice in JSON: { "advice": "...", "tips": ["tip1","tip2","tip3"], "watchOut": ["watchout1"] }`;

    const raw = await getAIResponse(prompt);
    let result;
    try {
      result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      result = { advice: raw, tips: [], watchOut: [] };
    }
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};
