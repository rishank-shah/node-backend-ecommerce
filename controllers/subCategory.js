const subCategory = require("../models/subCategory");
const slugify = require("slugify");
const Product = require('../models/product')

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const sub = await new subCategory({
      name,
      parent,
      slug: slugify(name),
    }).save();
    res.json(sub);
  } catch (err) {
    res.status(400).send("Creating SubCategory Failed");
  }
};

exports.list = async (req, res) => {
  return res.json(await subCategory.find().sort({ createdAt: -1 }).exec());
};

exports.remove = async (req, res) => {
  try {
    const deleted = await subCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Deleting SubCategory Failed");
  }
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const update = await subCategory.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      {
        name,
        parent,
        slug: slugify(name),
      },
      {
        new: true,
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send("Updating SubCategory Failed");
  }
};

exports.read = async (req, res) => {
  let subcategory = await subCategory
    .findOne({
      slug: req.params.slug,
    })
    .exec();
  res.json(subcategory);
};

exports.getProductBySubCategory = async (req, res) => {

  let { page } = req.body;
  const currentPage = page || 1;
  const perPageProduct = 4;

  let subcategory = await subCategory
    .findOne({
      slug: req.params.slug,
    })
    .exec();

  let productsCount = await Product.countDocuments({
    subcategories: subcategory,
  }).exec();

  let products = await Product.find({ subcategories: subcategory })
    .skip((currentPage - 1) * perPageProduct)
    .populate("category")
    .populate("subcategories")
    .sort([["createdAt", "desc"]])
    .limit(perPageProduct)
    .exec();

  res.json({
    subcategory,
    products,
    productsCount,
    currentPage,
  });
};