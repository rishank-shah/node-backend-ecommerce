const User = require("../models/user");
const Coupon = require("../models/coupon");
const Cart = require("../models/cart");
const Product = require("../models/product");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.createPaymentIntent = async (req, res) => {
  const orderedBy = await User.findOne({ email: req.user.email }).exec()
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderedBy: orderedBy._id })

  let finalAmount = 0;

  if (req.body.coupon && totalAfterDiscount) {
    finalAmount = Math.round(totalAfterDiscount * 100)
  } else {
    finalAmount = Math.round(cartTotal * 100)
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "inr",
  })
  return res.json({
    clientSecret: paymentIntent.client_secret,
    totalAfterDiscount,
    cartTotal,
    finalAmount,
  })
}