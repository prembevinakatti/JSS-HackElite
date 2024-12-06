const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  branch: {
    type: String,
    required: true,
  },
  department: [
    {
      type: String,
      required: true,
    },
  ],
  password: {
    type: String,
    required: true,
  },
  metamaskId: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
    enum: ["Head", "Admin", "Staff"],
  },
  userId: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = mongoose.model("User", userSchema);
