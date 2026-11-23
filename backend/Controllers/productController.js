const productService = require("../Services/productService");

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ message: "data fetched", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.getProduct(req.params.id);

    res.status(200).json({ data: product });
  } catch (error) {
    res.status(404).json({ message: "product not found" });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file ? req.file.filename : req.body.image || "",
    };
    const newProduct = await productService.createProduct(productData);
    res
      .status(201)
      .json({ message: "Product created Successfully", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
    };

    if (req.file) {
      productData.image = req.file.filename;
    } else if (req.body.image !== undefined) {
      productData.image = req.body.image;
    }
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      productData,
    );
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(404).json({ message: "product not found" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.status(200).json({ message: "product deleted" });
  } catch (error) {
    res.status(404).json({ message: "product not found" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const products = await productService.searchProducts(keyword);
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
