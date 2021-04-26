const Coupon = require("../models/coupon");

exports.createCoupon = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body;
    const coupon = await new Coupon({
      name,
      expiry,
      discount,
    }).save();
    res.json(coupon);
  } catch (err) {
    return res.status(400).json({
      err,
    });
  }
};

exports.removeCoupon = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec());
  } catch (err) {
    return res.status(400).json({
      err,
    });
  }
};

exports.listCoupon = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    return res.status(400).json({
      err,
    });
  }
};
