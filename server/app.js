const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const connectDB = require("./config/database");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173", // Adjust this to the correct frontend URL
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Add all allowed HTTP methods
  credentials: true, // If you're using cookies or credentials
};
app.use(cors(corsOptions));

app.use("/api/user", userRoute); // Your API routes
// app.use("/api/")
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
