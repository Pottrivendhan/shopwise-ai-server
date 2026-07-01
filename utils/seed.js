require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { PriceHistory } = require("../models/index");
const User = require("../models/User");

const products = [
  // ── Mobiles ─────────────────────────────────────────────────────────────
  { name: "Apple iPhone 15 (128GB) - Black", brand: "Apple", category: "mobiles", price: 69999, originalPrice: 79999, platform: "flipkart", rating: 4.6, reviewCount: 15234, availability: true, isFeatured: true, isTrending: true, image: "https://via.placeholder.com/400x400/1d1d1d/ffffff?text=iPhone+15", tags: ["apple","iphone","smartphone"], specifications: { Display: "6.1-inch Super Retina XDR", Processor: "A16 Bionic", RAM: "6GB", Storage: "128GB", Camera: "48MP + 12MP", Battery: "3279 mAh", OS: "iOS 17" } },
  { name: "Samsung Galaxy S24 (256GB) - Phantom Black", brand: "Samsung", category: "mobiles", price: 74999, originalPrice: 84999, platform: "amazon", rating: 4.5, reviewCount: 9871, availability: true, isFeatured: true, isTrending: true, image: "https://via.placeholder.com/400x400/2c2c2c/ffffff?text=Galaxy+S24", tags: ["samsung","galaxy","android"], specifications: { Display: "6.2-inch Dynamic AMOLED 2X", Processor: "Snapdragon 8 Gen 3", RAM: "8GB", Storage: "256GB", Camera: "50MP + 12MP + 10MP", Battery: "4000 mAh", OS: "Android 14" } },
  { name: "OnePlus 12 (256GB) - Silky Black", brand: "OnePlus", category: "mobiles", price: 64999, originalPrice: 69999, platform: "amazon", rating: 4.4, reviewCount: 7234, availability: true, isTrending: true, image: "https://via.placeholder.com/400x400/111111/ffffff?text=OnePlus+12", tags: ["oneplus","android","flagship"], specifications: { Display: "6.82-inch LTPO AMOLED", Processor: "Snapdragon 8 Gen 3", RAM: "12GB", Storage: "256GB", Camera: "50MP + 48MP + 64MP", Battery: "5400 mAh", OS: "OxygenOS 14" } },
  { name: "Xiaomi 14 Pro (512GB) - Titanium Black", brand: "Xiaomi", category: "mobiles", price: 99999, originalPrice: 109999, platform: "flipkart", rating: 4.3, reviewCount: 3421, availability: true, image: "https://via.placeholder.com/400x400/333/ffffff?text=Xiaomi+14+Pro", tags: ["xiaomi","flagship","leica"], specifications: { Display: "6.73-inch LTPO AMOLED", Processor: "Snapdragon 8 Gen 3", RAM: "16GB", Storage: "512GB", Camera: "50MP Leica", Battery: "4880 mAh" } },
  { name: "Realme GT 6 (256GB) - Fluid Silver", brand: "Realme", category: "mobiles", price: 39999, originalPrice: 44999, platform: "flipkart", rating: 4.2, reviewCount: 5643, availability: true, image: "https://via.placeholder.com/400x400/c0c0c0/333333?text=Realme+GT6", tags: ["realme","midrange","fast-charging"], specifications: { Display: "6.78-inch AMOLED", Processor: "Snapdragon 8s Gen 3", RAM: "12GB", Storage: "256GB", Battery: "5500 mAh" } },
  { name: "Google Pixel 8a (128GB) - Obsidian", brand: "Google", category: "mobiles", price: 52999, originalPrice: 59999, platform: "flipkart", rating: 4.5, reviewCount: 4120, availability: true, image: "https://via.placeholder.com/400x400/1a1a2e/ffffff?text=Pixel+8a", tags: ["google","pixel","ai-phone"], specifications: { Display: "6.1-inch OLED", Processor: "Google Tensor G3", RAM: "8GB", Storage: "128GB", Camera: "64MP", Battery: "4492 mAh", OS: "Android 14" } },

  // ── Electronics ──────────────────────────────────────────────────────────
  { name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", brand: "Sony", category: "electronics", price: 26990, originalPrice: 34990, platform: "amazon", rating: 4.7, reviewCount: 22341, availability: true, isFeatured: true, isTrending: true, image: "https://via.placeholder.com/400x400/2d2d2d/ffffff?text=Sony+WH1000XM5", tags: ["sony","headphones","anc","wireless"], specifications: { "Battery Life": "30 hours", "Driver Size": "30mm", Connectivity: "Bluetooth 5.2", "Noise Cancellation": "Industry-leading ANC", Weight: "250g" } },
  { name: "Apple AirPods Pro (2nd Gen) with MagSafe", brand: "Apple", category: "electronics", price: 22900, originalPrice: 26900, platform: "amazon", rating: 4.6, reviewCount: 18900, availability: true, isFeatured: true, image: "https://via.placeholder.com/400x400/f5f5f7/333333?text=AirPods+Pro", tags: ["apple","airpods","earbuds","anc"], specifications: { "Battery Life": "6 hours (30 with case)", Connectivity: "Bluetooth 5.3", Chip: "H2", "Noise Cancellation": "Active", "Water Resistance": "IPX4" } },
  { name: "Samsung 55-inch 4K QLED Smart TV (QN90C)", brand: "Samsung", category: "electronics", price: 89999, originalPrice: 119999, platform: "flipkart", rating: 4.5, reviewCount: 6780, availability: true, isFeatured: true, image: "https://via.placeholder.com/400x400/0a0a0a/ffffff?text=Samsung+QLED+TV", tags: ["samsung","tv","4k","qled"], specifications: { Resolution: "3840x2160 (4K)", Panel: "QLED", "Refresh Rate": "120Hz", HDR: "HDR10+", Ports: "4x HDMI 2.1", OS: "Tizen" } },
  { name: "MacBook Air M3 (13-inch, 8GB, 256GB SSD)", brand: "Apple", category: "electronics", price: 114900, originalPrice: 119900, platform: "amazon", rating: 4.8, reviewCount: 8934, availability: true, isFeatured: true, image: "https://via.placeholder.com/400x400/e8e8e8/333333?text=MacBook+Air+M3", tags: ["apple","macbook","laptop","m3"], specifications: { Chip: "Apple M3", RAM: "8GB Unified", Storage: "256GB SSD", Display: "13.6-inch Liquid Retina", Battery: "Up to 18 hours", Weight: "1.24 kg" } },
  { name: "Dell XPS 15 (Core i7-13700H, 32GB, 1TB SSD)", brand: "Dell", category: "electronics", price: 169999, originalPrice: 189999, platform: "amazon", rating: 4.5, reviewCount: 3421, availability: true, image: "https://via.placeholder.com/400x400/222831/ffffff?text=Dell+XPS+15", tags: ["dell","laptop","xps","windows"], specifications: { Processor: "Intel Core i7-13700H", RAM: "32GB DDR5", Storage: "1TB NVMe SSD", Display: "15.6-inch OLED 3.5K", GPU: "NVIDIA RTX 4060" } },
  { name: "Boat Airdopes 141 Bluetooth TWS Earbuds", brand: "boAt", category: "electronics", price: 1299, originalPrice: 2999, platform: "amazon", rating: 4.1, reviewCount: 98765, availability: true, isTrending: true, image: "https://via.placeholder.com/400x400/0038a8/ffffff?text=boAt+141", tags: ["boat","earbuds","tws","budget"], specifications: { "Battery Life": "42 hours total", Driver: "8mm", Connectivity: "Bluetooth 5.0", "Water Resistance": "IPX4" } },
  { name: "Canon EOS R50 Mirrorless Camera (Body Only)", brand: "Canon", category: "electronics", price: 59999, originalPrice: 69999, platform: "amazon", rating: 4.6, reviewCount: 2341, availability: true, image: "https://via.placeholder.com/400x400/cc0000/ffffff?text=Canon+EOS+R50", tags: ["canon","camera","mirrorless","photography"], specifications: { Sensor: "24.2MP APS-C CMOS", "Video": "4K 30fps", "AF Points": "651", Viewfinder: "0.39-inch OLED EVF", Weight: "375g" } },

  // ── Fashion ──────────────────────────────────────────────────────────────
  { name: "Nike Air Max 270 (Men's, Size 10)", brand: "Nike", category: "fashion", price: 7495, originalPrice: 12995, platform: "myntra", rating: 4.4, reviewCount: 12543, availability: true, isTrending: true, image: "https://via.placeholder.com/400x400/ff6b35/ffffff?text=Nike+Air+Max", tags: ["nike","shoes","running","airmax"], specifications: { Type: "Running Shoes", Upper: "Mesh", Sole: "Air Max unit", Sizes: "6-13 UK" } },
  { name: "Levi's 511 Slim Fit Jeans (Men's)", brand: "Levi's", category: "fashion", price: 2699, originalPrice: 3999, platform: "myntra", rating: 4.3, reviewCount: 34512, availability: true, image: "https://via.placeholder.com/400x400/1a237e/ffffff?text=Levis+511", tags: ["levis","jeans","mens","denim"] },
  { name: "Adidas Ultraboost 22 Running Shoes (Women's)", brand: "Adidas", category: "fashion", price: 9999, originalPrice: 17999, platform: "flipkart", rating: 4.5, reviewCount: 8765, availability: true, image: "https://via.placeholder.com/400x400/000000/ffffff?text=Adidas+Ultraboost", tags: ["adidas","shoes","running","women"] },
  { name: "H&M Oversized Hoodie", brand: "H&M", category: "fashion", price: 1299, originalPrice: 1999, platform: "myntra", rating: 4.0, reviewCount: 23451, availability: true, image: "https://via.placeholder.com/400x400/b0bec5/333333?text=H%26M+Hoodie", tags: ["hm","hoodie","casual","unisex"] },

  // ── Home & Kitchen ────────────────────────────────────────────────────────
  { name: "Philips HL7707 600W Mixer Grinder (3 Jars)", brand: "Philips", category: "home", price: 2499, originalPrice: 3999, platform: "amazon", rating: 4.3, reviewCount: 45678, availability: true, isFeatured: true, image: "https://via.placeholder.com/400x400/0277bd/ffffff?text=Philips+Mixer", tags: ["philips","mixer","kitchen","appliance"], specifications: { Power: "600W", Jars: "3", Speed: "3 speed + pulse", Warranty: "2 years" } },
  { name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker (6L)", brand: "Instant Pot", category: "home", price: 8999, originalPrice: 12999, platform: "amazon", rating: 4.6, reviewCount: 12345, availability: true, image: "https://via.placeholder.com/400x400/e0e0e0/333333?text=Instant+Pot", tags: ["instantpot","pressure-cooker","kitchen"] },
  { name: "Dyson V12 Detect Slim Cordless Vacuum Cleaner", brand: "Dyson", category: "home", price: 44900, originalPrice: 54900, platform: "amazon", rating: 4.7, reviewCount: 5432, availability: true, image: "https://via.placeholder.com/400x400/7b1fa2/ffffff?text=Dyson+V12", tags: ["dyson","vacuum","cordless","cleaning"], specifications: { "Battery Life": "60 min", Suction: "150 AW", Weight: "2.2 kg" } },
  { name: "Havells Sprint 1200mm Ceiling Fan", brand: "Havells", category: "home", price: 2799, originalPrice: 3800, platform: "flipkart", rating: 4.2, reviewCount: 8765, availability: true, image: "https://via.placeholder.com/400x400/01579b/ffffff?text=Havells+Fan", tags: ["havells","fan","ceiling","home"] },

  // ── Books ────────────────────────────────────────────────────────────────
  { name: "Atomic Habits by James Clear (Paperback)", brand: "Penguin", category: "books", price: 399, originalPrice: 599, platform: "amazon", rating: 4.8, reviewCount: 89012, availability: true, isTrending: true, image: "https://via.placeholder.com/400x400/f39c12/ffffff?text=Atomic+Habits", tags: ["book","self-help","habits"] },
  { name: "The Psychology of Money by Morgan Housel", brand: "Jaico", category: "books", price: 349, originalPrice: 499, platform: "amazon", rating: 4.7, reviewCount: 56789, availability: true, image: "https://via.placeholder.com/400x400/27ae60/ffffff?text=Psychology+of+Money", tags: ["book","finance","investing"] },
  { name: "Rich Dad Poor Dad by Robert Kiyosaki", brand: "Plata Publishing", category: "books", price: 299, originalPrice: 450, platform: "flipkart", rating: 4.6, reviewCount: 120345, availability: true, image: "https://via.placeholder.com/400x400/c0392b/ffffff?text=Rich+Dad+Poor+Dad", tags: ["book","finance","classic"] },

  // ── Sports ───────────────────────────────────────────────────────────────
  { name: "Nivia Storm Football (Size 5)", brand: "Nivia", category: "sports", price: 599, originalPrice: 999, platform: "amazon", rating: 4.1, reviewCount: 14523, availability: true, image: "https://via.placeholder.com/400x400/2c3e50/ffffff?text=Nivia+Football", tags: ["nivia","football","sports"] },
  { name: "Yonex Astrox 99 Badminton Racket", brand: "Yonex", category: "sports", price: 7999, originalPrice: 10000, platform: "flipkart", rating: 4.5, reviewCount: 3456, availability: true, image: "https://via.placeholder.com/400x400/e74c3c/ffffff?text=Yonex+Racket", tags: ["yonex","badminton","racket"] },
  { name: "Decathlon Domyos Yoga Mat (173cm x 61cm)", brand: "Decathlon", category: "sports", price: 999, originalPrice: 1499, platform: "flipkart", rating: 4.3, reviewCount: 23456, availability: true, image: "https://via.placeholder.com/400x400/8e24aa/ffffff?text=Yoga+Mat", tags: ["decathlon","yoga","fitness"] },

  // ── Beauty ───────────────────────────────────────────────────────────────
  { name: "Lakme 9to5 Primer + Matte Liquid Lip Color", brand: "Lakme", category: "beauty", price: 399, originalPrice: 550, platform: "myntra", rating: 4.2, reviewCount: 34567, availability: true, image: "https://via.placeholder.com/400x400/e91e63/ffffff?text=Lakme+Lipstick", tags: ["lakme","lipstick","makeup"] },
  { name: "Neutrogena Hydro Boost Water Gel Moisturizer (50ml)", brand: "Neutrogena", category: "beauty", price: 799, originalPrice: 1199, platform: "amazon", rating: 4.4, reviewCount: 45678, availability: true, image: "https://via.placeholder.com/400x400/00bcd4/ffffff?text=Neutrogena+Hydro", tags: ["neutrogena","skincare","moisturizer"] },
  { name: "Forest Essentials Sandalwood & Saffron Face Mask", brand: "Forest Essentials", category: "beauty", price: 1295, originalPrice: 1500, platform: "amazon", rating: 4.5, reviewCount: 8765, availability: true, image: "https://via.placeholder.com/400x400/795548/ffffff?text=Forest+Essentials", tags: ["forestessentials","organic","skincare"] },

  // ── Toys ─────────────────────────────────────────────────────────────────
  { name: "LEGO Technic Lamborghini Sián FKP 37 (3696 pcs)", brand: "LEGO", category: "toys", price: 34999, originalPrice: 44999, platform: "amazon", rating: 4.9, reviewCount: 5678, availability: true, isFeatured: true, image: "https://via.placeholder.com/400x400/f9a825/ffffff?text=LEGO+Lamborghini", tags: ["lego","technic","car","collectible"] },
  { name: "Hot Wheels Track Builder Unlimited Loop Launcher", brand: "Hot Wheels", category: "toys", price: 1499, originalPrice: 2499, platform: "flipkart", rating: 4.2, reviewCount: 12345, availability: true, image: "https://via.placeholder.com/400x400/f44336/ffffff?text=Hot+Wheels", tags: ["hotwheels","cars","toy","kids"] },
];

const generatePriceHistory = (currentPrice) => {
  const history = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const fluctuation = (Math.random() - 0.4) * 0.08;
    history.push({ price: Math.round(currentPrice * (1 + fluctuation)), date });
  }
  return history;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      require("../models/index").PriceHistory.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing products and price history");

    // Insert products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products`);

    // Generate price history for each product
    const historyDocs = inserted.flatMap((p) =>
      generatePriceHistory(p.price).map((h) => ({
        product: p._id,
        price: h.price,
        platform: p.platform,
        date: h.date,
      }))
    );
    await require("../models/index").PriceHistory.insertMany(historyDocs);
    console.log(`✅ Generated ${historyDocs.length} price history records`);

    // Create admin user
    const adminExists = await User.findOne({ email: "admin@shopwise.ai" });
    if (!adminExists) {
      await User.create({
        name: "Admin User",
        email: "admin@shopwise.ai",
        password: "Admin@123",
        role: "admin",
      });
      console.log("✅ Admin user created: admin@shopwise.ai / Admin@123");
    }

    // Create demo user
    const demoExists = await User.findOne({ email: "demo@shopwise.ai" });
    if (!demoExists) {
      await User.create({
        name: "Demo User",
        email: "demo@shopwise.ai",
        password: "Demo@123",
        role: "user",
      });
      console.log("✅ Demo user created: demo@shopwise.ai / Demo@123");
    }

    console.log("\n🚀 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Products: ${inserted.length}`);
    console.log(`   Price history: ${historyDocs.length} records`);
    console.log("   Admin: admin@shopwise.ai / Admin@123");
    console.log("   Demo:  demo@shopwise.ai  / Demo@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();
