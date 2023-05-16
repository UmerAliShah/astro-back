const uploadFile = require("../components/uploadFile");
const ProductModel = require("../models/Products");
const KeysModel = require("../models/Keys");

const addProduct = async (req, res) => {
  const { code } = req.body;
  try {
    const sameCode = await ProductModel.find({ code });
    if (!sameCode.length) {
      if (req.file) {
        const imageUrl = await uploadFile(req.file);
        req.body.image = imageUrl;
      }
      const product = new ProductModel({
        ...req.body,
      });
      const response = await product.save();
      res.status(200).send({ response });
    } else {
      return res.status(403).send({ error: "Product code must be unique" });
    }
  } catch (error) {
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
    if (req.file) {
      const imageUrl = await uploadFile(req.file);
      req.body.image = imageUrl;
    }
    const product = await ProductModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { update: true }
    );
    const response = await product.save();
    res.status(200).send({ response });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProductModel.findByIdAndDelete({ _id: id });
    const response = await ProductModel.find();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getVerifiedProduct = async (req, res) => {
  const { pc } = req.params;
  try {
    const productCode = pc?.slice(-2);
    const product = await ProductModel.findOne({ code: productCode });
    const batch = await KeysModel.findOne({ key: pc }).populate("batchId");
    res.status(200).send({ product, batch });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getProduct,
  addProduct,
  putProduct,
  deleteProduct,
  getVerifiedProduct,
};
