const express = require("express");
const router = express.Router();
const {
  createCoupon,
  removeCoupon,
  listCoupon,
  applyCouponToCart
} = require("../controllers/coupon");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/coupon/create", authCheck, adminCheck, createCoupon);

router.get("/coupon/list", listCoupon);

router.post("/coupon/apply-to-cart", authCheck,applyCouponToCart);

router.delete("/coupon/delete/:couponId", authCheck, adminCheck, removeCoupon);


module.exports = router;
