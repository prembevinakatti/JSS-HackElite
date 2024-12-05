const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const connectDB = require("./config/database");
require("dotenv").config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Adjust this to the correct frontend URL
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Add all allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
  credentials: true, // If you're using cookies or credentials
};

app.use(cors(corsOptions)); // Apply CORS configuration globally
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoute); // Your API routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
