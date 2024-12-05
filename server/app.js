const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const connectDB = require("./config/database");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
