const express = require("express");
const router = express.Router();
const { authCheck } = require("../middlewares/auth");
const {
  userCartSave,
  getUserCart,
  deleteUserCart,
  saveUserAddress,
  getUserAddress,
  getUserWishlist,
  saveUserWishlist,
  updateUserWishlist,
} = require("../controllers/user");

router.post("/user/cart/checkout", authCheck, userCartSave);

router.get("/user/cart/checkout", authCheck, getUserCart);

router.delete("/user/cart/checkout", authCheck, deleteUserCart);

router.get("/user/saved/address", authCheck, getUserAddress);

router.post("/user/address", authCheck, saveUserAddress);

router.get("/user/wishlist", authCheck, getUserWishlist);

router.post("/user/wishlist", authCheck, saveUserWishlist);

router.put("/user/wishlist/:productID", authCheck, updateUserWishlist);

module.exports = router;
