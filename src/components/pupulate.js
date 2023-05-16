const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");

module.exports = async function Populate() {
 

  try {
    const user = new User({
      username: "Alex",
      email: "admin@example.com",
      password: "12345678",
      isAdmin: true,
    });
    await user.save();

  } catch (err) {
    return console.log("error", err);
  }
};
