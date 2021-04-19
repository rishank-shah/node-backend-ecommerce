const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid Token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const admin = await User.findOne({ email }).exec();
  if (admin.role !== "user-role-admin") {
    res.status(403).json({
      err: "Access Denied",
    });
  } else {
    next();
  }
};
