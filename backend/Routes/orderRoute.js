const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../Controllers/orderController");
const { authMiddleware } = require("../Middlewares/authMiddleware");
const { roleMiddleware } = require("../Middlewares/roleMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateOrderStatus,
);

module.exports = router;
