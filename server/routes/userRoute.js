const express = require("express");
const {
  createAccount,
  loginAccount,
  createAdminOrStaff,
} = require("../controllers/userController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/loginAccount").post(loginAccount);
router.route("/createAdminOrStaff").post(isAuthenticated, createAdminOrStaff);

module.exports = router;
