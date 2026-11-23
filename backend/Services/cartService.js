const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");

const addToCart = async (userId, data) => {
  const { productId, quantity = 1 } = data;

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("product not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity: Number(quantity) }],
    })
    return cart;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  return cart;
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return {
      cart: cart || null,
      totalPrice: 0,
    };
  }

  let totalPrice = 0;
  cart.items.forEach((item) => {
    if (item.product) {
      totalPrice += item.product.price * item.quantity;
    }
  });

  return {
    cart,
    totalPrice,
  };
};

const updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) {
    throw new Error("Product not found in cart");
  }

  item.quantity = Number(quantity);
  await cart.save();
  return cart;
};

const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId,
  );
  if (!itemExists) {
    throw new Error("Product not found in cart");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();
  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
