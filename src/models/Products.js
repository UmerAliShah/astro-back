const mongoose = require("mongoose");

const Products = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    batch: {
      type: String,
    },
    name: {
      type: String,
    },
    activitated: {
      type: Date,
    },
    code: {
      type: String,
      unique: true,
    },
    size: {
      type: String,
    },
    description: {
      type: String,
    },
    displayOrder: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", Products);
