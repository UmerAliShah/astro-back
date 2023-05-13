const mongoose = require("mongoose");

const Batch = new mongoose.Schema({
  BatchID: {
    type: String,
  },
});

module.exports = mongoose.model("Batchs", Batch);
