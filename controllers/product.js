const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const product = await new Product(req.body).save();
    res.json(product);
  } catch (err) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listWithCount = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subcategories")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.deleteProduct = async (req, res) => {
  try {
    let deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    res.status(400).semd("Product Delete Failed");
  }
};

exports.readProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subcategories")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    const updateProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updateProduct);
  } catch (err) {
    console.log("UPDATING PRODUCT ERR", err);
    return res.status(400).json({ err: "Product update failed" });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const { sort, order, page, limit } = req.body;
    const currentPage = page || 1;
    const perPageProduct = limit || 4;
    const allProducts = await Product.find({})
      .skip((currentPage - 1) * perPageProduct)
      .populate("category")
      .populate("subcategories")
      .sort([[sort, order]]) //eg: sort-> createdAt order-> asc
      .limit(perPageProduct)
      .exec();
    res.json(allProducts);
  } catch (err) {
    console.log(err);
  }
};

exports.productCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const { star } = req.body;
  const user = await User.findOne({
    email: req.user.email,
  }).exec();

  let existingRattingObj = product.ratings.find(
    (rat) => rat.postedBy.toString() === user._id.toString()
  );

  if (existingRattingObj === undefined) {
    //create new ratting
    let ratting = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: {
          ratings: {
            star,
            postedBy: user._id,
          },
        },
      },
      {
        useFindAndModify: false,
        new: true,
      }
    ).exec();

    res.json(ratting);
  } else {
    //update ratting
    const rattingUpdated = await Product.updateOne(
      {
        ratings: {
          $elemMatch: existingRattingObj,
        },
      },
      {
        $set: {
          "ratings.$.star": star,
        },
      },
      {
        new: true,
      }
    ).exec();
    res.json(rattingUpdated);
  }
};

exports.relatedProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(4)
    .populate("category")
    .populate("subcategories")
    .exec();
  res.json(related);
};

exports.searchFilterProduct = async (req, res) => {
  const {
    search_query,
    price,
    category,
    numberOfStars,
    subCategories,
    shipping,
    color,
    brand,
  } = req.body;

  if (search_query) {
    const products = await Product.find({
      $text: { $search: search_query },
    })
      .populate("category")
      .populate("subcategories")
      .sort([["createdAt", "desc"]])
      .exec();
    return res.json(products);
  }

  if (price !== undefined) {
    try {
      const products = await Product.find({
        price: {
          $gte: price[0],
          $lte: price[1],
        },
      })
        .populate("category")
        .populate("subcategories")
        .sort([["createdAt", "desc"]])
        .exec();
      return res.json(products);
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  }

  if (category) {
    try {
      const products = await Product.find({
        category,
      })
        .populate("category")
        .populate("subcategories")
        .sort([["createdAt", "desc"]])
        .exec();
      return res.json(products);
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  }

  if (numberOfStars) {
    try {
      Product.aggregate([
        {
          $project: {
            document: "$$ROOT", //complete fields of products, can use title:'$title' instead
            floorAverage: {
              $floor: {
                $avg: "$ratings.star",
              },
            },
          },
        },
        { $match: { floorAverage: numberOfStars } },
      ]).exec((err, aggregates) => {
        if (err) {
          res.status(400).json({
            err: err,
          });
        } else {
          Product.find({ _id: aggregates })
            .populate("category")
            .populate("subcategories")
            .sort([["createdAt", "desc"]])
            .exec((err, products) => {
              if (err) {
                res.status(400).json({
                  err: err,
                });
              } else {
                return res.json(products);
              }
            });
        }
      });
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  }

  if (subCategories) {
    try {
      const products = await Product.find({
        subcategories: subCategories,
      })
        .populate("category")
        .populate("subcategories")
        .sort([["createdAt", "desc"]])
        .exec();
      return res.json(products);
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  }

  if (shipping) {
    try {
      const products = await Product.find({
        shipping: shipping,
      })
        .populate("category")
        .populate("subcategories")
        .sort([["createdAt", "desc"]])
        .exec();
      return res.json(products);
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  }

  if (color) {
    try {
      const products = await Product.find({
        color: color,
      })
        .populate("category")
        .populate("subcategories")
        .sort([["createdAt", "desc"]])
        .exec();
      return res.json(products);
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  }

  if (brand) {
    try {
      const products = await Product.find({
        brand: brand,
      })
        .populate("category")
        .populate("subcategories")
        .sort([["createdAt", "desc"]])
        .exec();
      return res.json(products);
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  }

  if (
    !search_query &&
    !price &&
    !category &&
    !numberOfStars &&
    !subCategories &&
    !shipping &&
    !color &&
    !brand
  ) {
    return res.json({
      error: "Please provide a query",
    });
  }
};
