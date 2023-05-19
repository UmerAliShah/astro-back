const mongoose = require("mongoose");

const Keys = new mongoose.Schema(
  {
    key: {
      type: String,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batches",
    },
    activated: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Keys", Keys);
