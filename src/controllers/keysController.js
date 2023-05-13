const BatchModel = require("../models/Batch");
const KeysModel = require("../models/Keys");

const createKeys = async (req, res) => {
  const { batchId, keys } = req.body;
  try {
    let savedBatch = await BatchModel.findOne({ BatchID: batchId });
    if (!savedBatch) {
      savedBatch = new BatchModel({
        BatchID: batchId,
      });
      savedBatch = await savedBatch.save();
      const savedkeys = await KeysModel.insertMany(
        keys.map((key) => ({ key, batchId: savedBatch._id }))
      );
      res.status(200).send(savedkeys);
    } else {
      res.status(300).send({ error: "Batch Id should be unique" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const findKey = async (req, res) => {
  const { key } = req.body;
  try {
    const result = await KeysModel.findOne({ key: key });
    if (!result) {
      return res.status(404).send({ error: "Key not found" });
    }
    const setVerify = await KeysModel.findOneAndUpdate(
      { _id: result._id },
      { $set: { activated: new Date() } },
      { new: true }
    );
    if (!setVerify) {
      return res.status(500).send({ error: "Error setting activated" });
    }
    res.status(200).send(setVerify);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error finding key" });
  }
};

module.exports = { createKeys, findKey };
