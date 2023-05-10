const uploadFile = require("../components/uploadFile");
const ProductModel = require("../models/Products");

const addProduct = async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = await uploadFile(req.file);
      req.body.image = imageUrl;
    }
    const product = new ProductModel({
      ...req.body,
    });
    const response = await product.save();
    res.status(200).send({response});
  } catch (error) {
    console.log(error, "-----------errorD");
    res.status(500).send(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const response = await ProductModel.find();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const putProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const imageUrl = await uploadFile(req.file);
    req.body.image = imageUrl;
    const product = await ProductModel.findByIdAndUpdate(
      { id },
      { ...req.body },
      { update: true }
    );
    const response = await product.save();
    res.status(200).send({ response });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getProduct,
  addProduct,
  putProduct,
};
