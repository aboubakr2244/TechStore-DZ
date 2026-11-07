const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");

const getAllProducts = async () => {
  const products = await Product.find().populate("category", "name");
  return products;
};

const getProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("product not found");
  }
  return product;
};

const createProduct = async (data) => {
  const existingCategory = await Category.findById(data.category);
  if (!existingCategory) {
    throw new Error("Category not found");
  }
  const newProduct = await Product.create(data);
  return newProduct;
};

const updateProduct = async (id, data) => {
  if (data.category) {
    const existingCategory = await Category.findById(data.category);
    if (!existingCategory) {
      throw new Error("Category not exist");
    }
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("category", "name");
  if (!updatedProduct) {
    throw new Error("product not found");
  }
  return updatedProduct;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error("product not found");
  }
  return product;
};

const searchProducts = async (keyword) => {
  const products = await Product.find({
    name: {
      $regex: keyword,
      $options: "i",
    },
  }).populate("category", "name");
  return products;
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
