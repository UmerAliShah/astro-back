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
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batches",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", Products);
