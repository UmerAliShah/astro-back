const mongoose = require("mongoose");

const Content = new mongoose.Schema({
  verification_heading: {
    type: String,
  },
  advertisment_content: {
    type: String,
  },
});

module.exports = mongoose.model("Content", Content);
