const express = require("express");
const router = express.Router();
const { authCheck } = require("../middlewares/auth");
const {
  userCartSave,
  getUserCart,
  deleteUserCart,
  saveUserAddress,
} = require("../controllers/user");

router.post("/user/cart/checkout", authCheck, userCartSave);

router.get("/user/cart/checkout", authCheck, getUserCart);

router.delete("/user/cart/checkout", authCheck, deleteUserCart);

router.post('/user/address',authCheck,saveUserAddress)

module.exports = router;
