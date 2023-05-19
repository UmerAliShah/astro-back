const mongoose = require("mongoose");

const Batch = new mongoose.Schema(
  {
    BatchID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batches", Batch);
