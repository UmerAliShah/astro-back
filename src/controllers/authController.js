const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      console.log(user);
      const validity = await user.comparePassword(password);
      console.log(validity, "val");
      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
        res.status(200).json({ token });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    console.log(err, "------------------err");
    res.status(500).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log(_id, "_id");
    const response = await UserModel.findOne({ _id });
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  loginUser,
  getUser,
};
