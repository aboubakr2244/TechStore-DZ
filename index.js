const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./Config/db");
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const categoryRoute = require("./Routes/categoryRoute");
const productRoute = require("./Routes/productRoute");

const app = express();

app.use(express.json());

connectDB();

app.use("/Uploads", express.static(path.join(__dirname, "/Uploads")));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server is Running ...");
});
