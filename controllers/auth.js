const User = require("../models/user");

exports.createUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;
  const user = await User.findOneAndUpdate(
    { email: email },
    { name, picture },
    { new: true, useFindAndModify: false }
  );
  if (user) {
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name,
      picture,
    }).save();
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) {
      throw new Error(err);
    }
    res.json(user);
  });
};
