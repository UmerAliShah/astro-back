const mongoose = require("mongoose");

const Keys = new mongoose.Schema({
  key: {
    type: String,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batchs",
  },
  activated: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Keys", Keys);
