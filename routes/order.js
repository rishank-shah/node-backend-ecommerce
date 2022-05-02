const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getAllOrdersAdmin,
  orderStatusAdmin,
} = require("../controllers/order");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/user/order-create", authCheck, createOrder);

router.get("/user/orders", authCheck, getOrders);

router.get("/admin/orders", authCheck, adminCheck, getAllOrdersAdmin);

router.put("/admin/order-status", authCheck, adminCheck, orderStatusAdmin);

module.exports = router;
