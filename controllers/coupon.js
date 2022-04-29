const Coupon = require("../models/coupon");
const Cart = require("../models/cart");
const User = require("../models/user");

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

exports.applyCouponToCart = async(req,res)=>{
  try{
    const {coupon} = req.body
    const couponValid = await Coupon.findOne({name:coupon}).exec()
    if(couponValid === null){
      return res.json({
        'err':"Invalid Coupon"
      })
    }else if(new Date(couponValid.expiry).getTime() < new Date()){
      return res.json({
        'err':"Coupon has expired"
      })
    }else{
      const user = await User.findOne({email : req.user.email}).exec()
      let {products,cartTotal,totalAfterDiscount} = await Cart.findOne({
        orderedBy : user._id
      }).populate("products.product","_id title price")
      if(totalAfterDiscount !== 0){
        return res.json({
          'err':"Coupon already applied"
        })
      }else{
        let totalAfterDiscount2 = (cartTotal - (cartTotal*couponValid.discount)/100).toFixed(2)
        console.log(totalAfterDiscount2,cartTotal,couponValid.discount)

        await Cart.findOneAndUpdate(
          {orderedBy : user._id},
          {totalAfterDiscount : totalAfterDiscount2},
          {new:true}
        ).exec();
        res.json({
          'totalAfterDiscount':totalAfterDiscount2
        })
      } 
    }

  }catch (err) {
    console.log(err)
    return res.status(400).json({
      'err':err
    });
  }
}