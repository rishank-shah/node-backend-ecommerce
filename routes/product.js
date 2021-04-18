const express = require("express");
const router = express.Router();
const {
  create,
  listWithCount,
  deleteProduct,
  readProduct,
  update,
  listProducts,
  productCount,
  productStar,
} = require("../controllers/product");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.get("/products/:count", listWithCount);
router.get("/product/:slug", readProduct);

router.post("/products", listProducts);
router.get("/product/total/count", productCount);

router.put("/product/star/:productId", authCheck, productStar);

router.post("/product", authCheck, adminCheck, create);
router.put("/product/:slug", authCheck, adminCheck, update);
router.delete("/product/:slug", authCheck, adminCheck, deleteProduct);

module.exports = router;
