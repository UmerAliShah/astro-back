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
    console.log(result, "reess");
    if (result?.activated === null) {
      const setVerify = await KeysModel.findOneAndUpdate(
        { _id: result._id },
        { $set: { activated: new Date() } },
        { new: true }
      );
      if (!setVerify) {
        return res.status(500).send({ error: "Error setting activated" });
      }
      return res.status(200).send(setVerify);
    } else {
      return res.status(400).send({ error: "Already used" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error finding key" });
  }
};

const getKeys = async (req, res) => {
  const dayAgo = new Date();
  dayAgo.setDate(dayAgo.getDate() - 1);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const pageSize = 20;
  const page = parseInt(req.query.page) || 1;
  let dateCondition;
  if (req.query.day) {
    dateCondition = { $gte: dayAgo };
  } else if (req.query.week) {
    dateCondition = { $gte: weekAgo };
  } else if (req.query.month) {
    dateCondition = { $gte: monthAgo };
  }

  const status = {
    ...(req.query.status === "activated" ? { activated: { $ne: null } } : {}),
    ...(req.query.status === "unactivated" ? { activated: null } : {}),
    ...(req.query.flavour
      ? { key: { $regex: `${req.query.flavour}`, $options: "i" } }
      : {}),
    ...(dateCondition
      ? { $and: [{ activated: { $ne: null } }, { activated: dateCondition }] }
      : {}),
  };

  try {
    const totalCount = await KeysModel.countDocuments(status);
    const totalPages = Math.ceil(totalCount / pageSize);

    const result = await KeysModel.find(status)
      .populate("batchId", "BatchID")
      .sort(
        req.query.sort === "activated"
          ? { activated: -1 }
          : req.query.sort === "created"
          ? { createdAt: -1 }
          : { createdAt: -1 }
      )
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const activatedToday = await KeysModel.countDocuments({
      activated: { $gte: dayAgo },
    });

    const activatedThisWeek = await KeysModel.countDocuments({
      activated: { $gte: weekAgo },
    });

    const activatedThisMonth = await KeysModel.countDocuments({
      activated: { $gte: monthAgo },
    });
    const totalActivated = await KeysModel.countDocuments({
      activated: { $ne: null },
    });

    res.status(200).send({
      keys: result,
      currentPage: page,
      totalPages,
      totalCount,
      activatedToday,
      activatedThisWeek,
      activatedThisMonth,
      totalActivated,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllKeys = async (req, res) => {
  try {
    const result = await KeysModel.find().populate("batchId");
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteKey = async (req, res) => {
  const id = req.params.id;

  try {
    const key = await KeysModel.findById(id);
    if (key.activated) {
      res.status(400).send({ message: "Cannot delete activated key" });
    } else {
      const deletedKey = await KeysModel.findByIdAndDelete(id);
      const keys = await KeysModel.find();
      res.status(200).send(keys);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createKeys,
  findKey,
  getAllKeys,
  deleteKey,
  getKeys,
};
