const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../Controllers/productController");

const { authMiddleware } = require("../Middlewares/authMiddleware");
const { roleMiddleware } = require("../Middlewares/roleMiddleware");
const uploadMiddleware = require("../Middlewares/uploadMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadMiddleware.single("image"),
  createProduct,
);

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.get("/", searchProducts);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadMiddleware.single("image"),
  updateProduct,
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

module.exports = router;
