const express = require("express");
const router = express.Router();
const {
  create,
  read,
  update,
  remove,
  list,
} = require("../controllers/subCategory");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.get("/subcategory/list", list);
router.get("/subcategory/:slug", read);

router.post("/subcategory", authCheck, adminCheck, create);
router.put("/subcategory/:slug", authCheck, adminCheck, update);
router.delete("/subcategory/:slug", authCheck, adminCheck, remove);

module.exports = router;
