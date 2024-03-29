const Category = require("../models/category");
const slugify = require("slugify");
const Subcategory = require("../models/subCategory");
const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    res.json(category);
  } catch (err) {
    res.status(400).send("Creating Category Failed");
  }
};

exports.list = async (req, res) => {
  return res.json(await Category.find().sort({ createdAt: -1 }).exec());
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Deleting Category Failed");
  }
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const update = await Category.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      {
        name,
        slug: slugify(name),
      },
      {
        new: true,
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send("Updating Category Failed");
  }
};

exports.read = async (req, res) => {
  let category = await Category.findOne({
    slug: req.params.slug,
  }).exec();
  res.json(category);
};

exports.getSubCategory = (req, res) => {
  Subcategory.find({ parent: req.params.id }).exec((err, sub) => {
    if (err) {
      res.status(400).json({
        err,
      });
    }
    res.json(sub);
  });
};

exports.getProductByCategory = async (req, res) => {
  
  let { page } = req.body;
  const currentPage = page || 1;
  const perPageProduct = 4;

  let category = await Category.findOne({
    slug: req.params.slug,
  }).exec();

  let productsCount = await Product.countDocuments({
    category: category,
  }).exec();

  let products = await Product.find({ category: category })
    .skip((currentPage - 1) * perPageProduct)
    .populate("category")
    .populate("subcategories")
    .sort([["createdAt", "desc"]])
    .limit(perPageProduct)
    .exec();

  res.json({
    category,
    products,
    productsCount,
    currentPage,
  });
};
