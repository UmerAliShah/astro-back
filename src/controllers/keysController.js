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
    return res.status(500).send({ error: "Error finding key" });
  }
};

const getKeys = async (req, res) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const pageSize = 20;
  const page = parseInt(req.query.page) || 1;
  let dateCondition;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  if (req.query.day) {
    dateCondition = { $gte: startOfToday, $lte: endOfToday };
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

  if (req.query.batch) {
    status.batchId = { $in: [] };
  }

  try {
    const activatedToday = await KeysModel.count({
      activated: { $gte: startOfToday, $lte: endOfToday },
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
    if (req.query.batch) {
      const batches = await BatchModel.find(
        { BatchID: req.query.batch },
        "_id"
      );
      status.batchId.$in = batches.map((batch) => batch._id);
    }

    const totalCount = await KeysModel.countDocuments(status);
    const totalPages = Math.ceil(totalCount / pageSize);

    const result = await KeysModel.find(status)
      .populate("batchId", "BatchID")
      .sort({
        ...(req.query.sort === "activated"
          ? { activated: -1, _id: 1 }
          : req.query.sort === "created"
          ? { createdAt: -1, _id: 1 }
          : { createdAt: -1, _id: 1 }),
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

   

    console.log(
      ".....hushdo",
      activatedToday,
      activatedThisWeek,
      activatedThisMonth,
      totalActivated
    );

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

const getBatch = async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "batches",
          localField: "batchId",
          foreignField: "_id",
          as: "batch",
        },
      },
      {
        $unwind: "$batch",
      },
      {
        $group: {
          _id: "$batchId",
          batchName: { $first: "$batch.BatchID" },
          keys: { $addToSet: "$key" },
          totalKeys: { $sum: 1 },
          totalActivatedKeys: {
            $sum: { $cond: [{ $ne: ["$activated", null] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 1,
          batchName: 1,
          totalKeys: 1,
          totalActivatedKeys: 1,
          totalInactivatedKeys: {
            $subtract: ["$totalKeys", "$totalActivatedKeys"],
          },
        },
      },
    ];

    const result = await KeysModel.aggregate(pipeline);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteBatch = async (req, res) => {
  const batchId = req.params.id;

  try {
    // Find the batch to be deleted
    const batch = await BatchModel.findById(batchId);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const keysToDelete = await KeysModel.find({
      batchId: batchId,
      activated: null,
    });

    await KeysModel.deleteMany({
      _id: { $in: keysToDelete.map((key) => key._id) },
    });

    res
      .status(200)
      .json({ message: "Batch and associated keys deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBulkKeys = async (req, res) => {
  const { data } = req.body;
  try {
    const deletedKeys = await KeysModel.deleteMany({ _id: { $in: data } });
    res
      .status(200)
      .send({ message: "Deleted", deletedCount: deletedKeys.deletedCount });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
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
    res.status(500).send({ message: "Internal server error" });
  }
};

const getAllBatches = async (req, res) => {
  try {
    const result = await BatchModel.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createKeys,
  findKey,
  getAllKeys,
  deleteBulkKeys,
  deleteKey,
  getKeys,
  getBatch,
  deleteBatch,
  getAllBatches,
};
