const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {timestamps:true}
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.pre("findOneAndUpdate", function (next) {
  const user = this;
  if (!user._update.password) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user._update.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user._update.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;

  return new Promise((resolve) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return resolve(false);
      }

      resolve(true);
    });
  });
};

module.exports = mongoose.model("User", userSchema);
