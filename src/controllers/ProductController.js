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
    res.status(200).send({ response });
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
    console.log(id, req.body, "-----------------id");
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
    console.log(response, "-------------------res");
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

module.exports = {
  getProduct,
  addProduct,
  putProduct,
  deleteProduct,
};
