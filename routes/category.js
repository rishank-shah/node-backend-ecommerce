const express = require("express");
const router = express.Router();
const {
  create,
  read,
  update,
  remove,
  list,
  getSubCategory,
} = require("../controllers/category");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.get("/category/subcategories/:id", getSubCategory);

router.get("/category/list", list);
router.get("/category/:slug", read);

router.post("/category", authCheck, adminCheck, create);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);

module.exports = router;
