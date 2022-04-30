const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
} = require("../controllers/order");
const { authCheck } = require("../middlewares/auth");

router.post("/user/order-create", authCheck, createOrder);

router.get("/user/orders", authCheck, getOrders);

module.exports = router;
