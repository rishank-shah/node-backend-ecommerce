const Order = require("../models/order")
const User = require("../models/user")
const Cart = require("../models/cart")
const Product = require("../models/product")

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse
  const user = await User.findOne({ email: req.user.email }).exec()

  const { products } = await Cart.findOne({ orderedBy: user._id }).exec()

  const order = await new Order({
    products,
    orderedBy: user._id,
    paymentIntent
  }).save()

  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count,
          }
        }
      }
    }
  })

  let updated = await Product.bulkWrite(bulkOption, {})

  return res.json({
    success: true,
  })
}

exports.getOrders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()
  const orders = await Order.find({ orderedBy: user._id }).populate('products.product').exec()
  return res.json({
    success: true,
    orders,
  })
}

exports.getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec()
  return res.json({
    success: true,
    orders,
  })
}

exports.orderStatusAdmin = async (req, res) => {
  const { orderID, orderStatus } = req.body;
  let updated = await Order.findByIdAndUpdate(
    orderID,
    { orderStatus },
    { new: true }
  ).exec();
  return res.json({
    success: true,
    order: updated,
  })
}