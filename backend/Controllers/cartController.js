const cartService = require("../Services/cartService");

const addToCart = async (req, res) => {
  try {
    const cart = await cartService.addToCart(req.user._id, req.body);
    res.status(200).json({ message: "Product added to cart", data: cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const result = await cartService.getCart(req.user._id);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(
      req.user._id,
      productId,
      quantity,
    );
    res.status(200).json({ message: "Cart updated successfully", data: cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeCartItem(req.user._id, productId);
    res.status(200).json({ message: "Product removed from cart", data: cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
