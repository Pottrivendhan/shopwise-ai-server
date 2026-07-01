const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");

router.get("/", ctrl.getProducts);
router.get("/featured", ctrl.getFeatured);
router.get("/trending", ctrl.getTrending);
router.get("/category/:category", ctrl.getByCategory);
router.get("/:id", ctrl.getProductById);
router.get("/:id/price-history", ctrl.getPriceHistory);

module.exports = router;
