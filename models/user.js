const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    address: String,
    cart: {
      type: Array,
      default: [],
    },
    wishlist: [{
      type: ObjectId,
      ref: 'Product'
    }],
    role: {
      type: String,
      default: "user-normal",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
