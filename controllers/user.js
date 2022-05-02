const User = require("../models/user");
const Product = require("../models/product");
const UserCart = require("../models/cart");

exports.userCartSave = async (req, res) => {
  try {
    const { cart } = req.body;
    let products = [];
    let totalPriceOfCart = 0;

    const user = await User.findOne({
      email: req.user.email,
    }).exec();

    cartExisting = await UserCart.findOne({
      orderedBy: user._id,
    }).exec();

    if (cartExisting) {
      cartExisting.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      let obj = {};
      obj.product = cart[i]._id;
      obj.count = cart[i].count;
      obj.color = cart[i].color;
      let prod = await Product.findById(cart[i]._id).select("price").exec();
      obj.price = prod.price;
      products.push(obj);
    }

    for (let i = 0; i < products.length; i++) {
      totalPriceOfCart += products[i].price * products[i].count;
    }

    const newCart = await new UserCart({
      products: products,
      cartTotal: totalPriceOfCart,
      orderedBy: user._id,
    }).save();

    return res.json({
      success: true,
      cart: newCart,
    });
  } catch (err) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
    }).exec();

    userCartObj = await UserCart.findOne({
      orderedBy: user._id,
    })
      .populate("products.product", "_id title price")
      .exec();

    const { products, cartTotal, totalAfterDiscount } = userCartObj;

    return res.json({
      success: true,
      products,
      cartTotal,
      totalAfterDiscount,
    });
  } catch (err) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.deleteUserCart = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
    }).exec();

    userCartObj = await UserCart.findOneAndRemove({
      orderedBy: user._id,
    }).exec();

    return res.json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.saveUserAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    {
      email: req.user.email,
    },
    {
      address: req.body.address,
    }
  ).exec();
  res.json({
    success: true,
  });
};

exports.getUserAddress = async (req, res) => {
  const userAddress = await User.findOne({
    email: req.user.email,
  }).exec();
  res.json({
    address: userAddress.address || '',
  });
};

exports.getUserWishlist = async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  })
    .select('wishlist')
    .populate('wishlist')
    .exec();
  return res.json({
    wishlist: user.wishlist,
    success: true
  });
}

exports.saveUserWishlist = async (req, res) => {
  const { productID } = req.body
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productID } }
  ).exec()
  return res.json({
    success: true,
  })
}

exports.updateUserWishlist = async (req, res) => {
  const { productID } = req.params
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productID } }
  ).exec()
  return res.json({
    success: true,
  })
}