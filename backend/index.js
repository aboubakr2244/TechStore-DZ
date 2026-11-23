const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./Config/db");
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const categoryRoute = require("./Routes/categoryRoute");
const productRoute = require("./Routes/productRoute");
const cartRoute = require("./Routes/cartRoute");
const orderRoute = require("./Routes/orderRoute");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

connectDB();

app.use("/Uploads", express.static(path.join(__dirname, "/Uploads")));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server is Running ...");
});
