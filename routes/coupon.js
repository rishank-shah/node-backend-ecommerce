const express = require("express");
const router = express.Router();
const {
  createCoupon,
  removeCoupon,
  listCoupon,
} = require("../controllers/coupon");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/coupon/create", authCheck, adminCheck, createCoupon);

router.get("/coupon/list", listCoupon);

router.delete("/coupon/delete/:couponId", authCheck, adminCheck, removeCoupon);


module.exports = router;
