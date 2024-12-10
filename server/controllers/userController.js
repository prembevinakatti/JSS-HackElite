const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.createAccount = async (req, res) => {
  try {
    const {
      fullName,
      email,
      userId,
      password,
      phoneNumber,
      role,
      department,
      branch,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !branch ||
      !password ||
      !phoneNumber ||
      !role ||
      !department
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await userModel.create({
      fullName,
      email,
      userId,
      password,
      phoneNumber,
      role,
      branch,
      department,
    });

    return res
      .status(200)
      .json({ message: "User created successfully", success: true, user });
  } catch (error) {
    console.log("Error creating account in server: ", error.message);
  }
};
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
    const {
      fullName,
      branch,
      department,
      role,
      password,
      confirmPassword,
      email,
      userId,
      phoneNumber,
    } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !fullName ||
      !branch ||
      !role ||
      !password ||
      !email ||
      !department ||
      !phoneNumber ||
      !userId ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const headUser = await userModel.findOne({ email: user.email });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (headUser?.role !== "Head") {
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
      phoneNumber,
      userId,
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

module.exports.setMetamaskId = async (req, res) => {
  try {
    const user = req.user;
    const { metamaskId } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!metamaskId) {
      return res.status(400).json({ message: "Metamask ID is required" });
    }

    if (user.metamaskId) {
      return res.status(400).json({ message: "Metamask ID already set" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { metamaskId },
      { new: true }
    );

    res.status(200).json({
      message: "Metamask ID set successfully",
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.error("Error setting Metamask ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUserByMetamaskId = async (req, res) => {
  try {
    const metamaskId = req.body;

    if (!metamaskId) {
      return res.status(400).json({ message: "Metamask ID is required" });
    }

    const user = await userModel.findOne({ metamaskId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User found successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error Getting User By Metamask Id", error.message);
  }
};
