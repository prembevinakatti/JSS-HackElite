const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { head } = require("../routes/userRoute");

module.exports.loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
    res.cookie("token", token);

    res
      .status(200)
      .json({ message: "Logged in successfully", success: true, user });
  } catch (error) {
    console.log("Error Login Account in server: ", error.message);
  }
};

module.exports.createAdminOrStaff = async (req, res) => {
  try {
    const { fullName, branch, department, role, password, email } = req.body;
    const user = req.user;
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!fullName || !branch || !role || !password || !email || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const headUser = await userModel.findOne({ email: user.email });
    console.log("Head", headUser.role);

    if (headUser.role !== "Head") {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await userModel.create({
      fullName,
      email,
      password,
      role,
      branch,
      department,
    });

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create account" });
    }

    res.status(201).json({
      message: "Account created successfully",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log("Error creating Admin or Staff in server: ", error.message);
  }
};
