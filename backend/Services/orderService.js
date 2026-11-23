const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");

const createOrder = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalPrice = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error("product not found");
    }

    const price = product.price;
    totalPrice += price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: price,
      quantity: item.quantity,
      image: product.image,
    });
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalPrice,
  });

  cart.items = [];
  await cart.save();

  return order;
};

const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return orders;
};

const getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    throw new Error("Order not found");
  }

  const isOwner = order.user._id.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    throw new Error("Access denied");
  }

  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).populate("user", "name email");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
